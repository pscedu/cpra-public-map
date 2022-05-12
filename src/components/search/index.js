import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import bbox from "@turf/bbox";
import { bufferPoint, fireEvent, normalizeText } from "../../utils";
import style from "./style.css";

const excludedCategories = ["railway"];

function getLocalResults(text, searchIndex) {
  let needles = normalizeText(text)
    .split(" ")
    .filter((part) => part.length);

  return searchIndex.filter((entry) => {
    if (needles.length == 0) return false;
    for (let needle of needles)
      if (entry.haystack.indexOf(needle) === -1) return false;
    return true;
  });
}

function getOsmResults(json) {
  return json
    .filter((result) => excludedCategories.indexOf(result.category) === -1)
    .map((result) => {
      const addr = result.address;
      let primary = addr[result.category];
      let secondary =
        addr.neighbourhood || addr.town || addr.city || addr.county || null;
      if (!primary)
        primary = [addr.house_number, addr.road]
          .filter((part) => part !== undefined)
          .join(" ");

      if (primary == "") {
        primary = secondary;
        secondary = null;
      }
      return {
        type: "osm",
        name: primary,
        category: secondary,
        details: result,
      };
    });
}

function formatResult(result) {
  return [
    <span key="primary" class={style["primary"]}>
      {result.name}
    </span>,
    " ",
    <span key="secondary" class={style["secondary"]}>
      {result.category}
    </span>,
  ];
}

const Search = ({ geocodeUrl, searchIndex, setSelection }) => {
  const input = useRef(null);
  const [text, setText] = useState("");
  const [hasResult, setHasResult] = useState(false);
  const [results, setResults] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    window.addEventListener("searchSelectResult", (e) => {
      setHasResult(true);
      select(e.detail.result);
    });
    window.addEventListener("searchClearResult", clear);
  }, []);

  const keyUp = async (e) => {
    // Select the active result when enter is pressed.
    if (e.keyCode === 13) return select(results[currentIdx]);
    if (e.keyCode === 38 && currentIdx > 0)
      return setCurrentIdx(currentIdx - 1);
    if (e.keyCode === 40 && currentIdx < results.length - 1)
      return setCurrentIdx(currentIdx + 1);
    setText(e.target.value);
  };

  // Perform a search when text changes.
  useEffect(() => {
    (async () => {
      const url = new URL(geocodeUrl);
      url.searchParams.append("q", text);
      url.searchParams.append("addressdetails", "1");
      url.searchParams.append("polygon_geojson", "1");
      const req = fetch(url.toString());
      const results = getLocalResults(text, searchIndex);
      const res = await req;
      results.push(...getOsmResults(await res.json()));
      setResults(results.slice(0, 5));
      setCurrentIdx(0);
    })();
  }, [text, geocodeUrl, searchIndex]);

  const select = (result) => {
    showResult(result);
    if (input.current) input.current.value = result.name;
    setResults([]);
    setCurrentIdx(0);
    setHasResult(true);
  };

  const clear = () => {
    setSelection({});
    if (input.current) input.current.value = "";
    setText("");
    setResults([]);
    setCurrentIdx(0);
    setHasResult(false);
  };

  const getOsmSelection = (details) => {
    const polygon =
      details.category == "boundary"
        ? details.geojson
        : bufferPoint(parseFloat(details.lon), parseFloat(details.lat), 1609);
    return { polygon };
  };

  const showResult = (result) => {
    const selection = result.selection || getOsmSelection(result.details);
    setSelection(selection);

    let bounds = result.bounds;
    if (selection.polygon) bounds = bbox(selection.polygon);
    if (bounds)
      fireEvent("mapFitBounds", { bounds, options: { padding: 100 } });
  };

  return (
    <div class={style["address-search"]}>
      <label for="address-search" class="sr-only">
        Address Search
      </label>
      <input
        type="text"
        id="address-search"
        placeholder="Search by address, project, or region"
        onKeyUp={keyUp}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        ref={input}
      />
      {hasResult || text.length > 0 ? (
        <button class={style["clear"]} onClick={clear}>
          <span class="sr-only">Clear</span>
        </button>
      ) : null}
      {text.length == 0 && focused ? (
        <div class={style["instructions"]}>
          <p>These are examples of things you can find:</p>
          <ul class={style["examples"]}>
            <li>
              <strong>Address:</strong>{" "}
              <span class={style["example"]}>1300 Perdido St, New Orleans</span>
            </li>
            <li>
              <strong>LA House or Senate District:</strong>{" "}
              <span class={style["example"]}>House-53</span>
            </li>
            <li>
              <strong>Parish:</strong>{" "}
              <span class={style["example"]}>Terrebonne Parish</span>
            </li>
            <li>
              <strong>Project Name:</strong>{" "}
              <span class={style["example"]}>Lower Barataria Landbridge</span>
            </li>
            <li>
              <strong>Project Type:</strong>{" "}
              <span class={style["example"]}>Marsh Creation</span>
            </li>
            <li>
              <strong>Region:</strong>{" "}
              <span class={style["example"]}>Central Coast</span>
            </li>
            <li>
              <strong>U.S. Congressional District:</strong>{" "}
              <span class={style["example"]}>US-2</span>
            </li>
          </ul>
        </div>
      ) : null}
      {results.length ? (
        <ul class={style["results"]}>
          {results.map((result, i) => (
            <li
              key={result}
              class={`${style["result"]} ${
                style[i == currentIdx ? "active" : "inactive"]
              }`}
              onClick={() => select(result)}
              onMouseEnter={() => setCurrentIdx(i)}
            >
              {formatResult(result)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default Search;
