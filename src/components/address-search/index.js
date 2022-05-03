import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import bbox from "@turf/bbox";
import buffer from "@turf/buffer";
import { point } from "@turf/helpers";
import style from "./style.css";

const excludedCategories = ["railway"];

function getNames(result) {
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
    primary,
    secondary,
  };
}

function formatResult(result) {
  const names = getNames(result);
  return [
    <span key="primary" class={style["primary"]}>
      {names.primary}
    </span>,
    " ",
    <span key="secondary" class={style["seconary"]}>
      {names.secondary}
    </span>,
  ];
}

const AddressSearch = ({ geocodeUrl, updateMapState }) => {
  const input = useRef(null);
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

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
      const res = await fetch(url.toString());
      const results = (await res.json())
        .filter((r) => excludedCategories.indexOf(r.category) === -1)
        .slice(0, 5);
      setResults(results);
      setCurrentIdx(0);
    })();
  }, [text, geocodeUrl]);

  const select = (result) => {
    showResult(result);
    if (input.current) input.current.value = getNames(result).primary;
    setResults([]);
    setCurrentIdx(0);
  };

  const clear = () => {
    updateMapState({ searchPolygon: null });
    if (input.current) input.current.value = "";
    setResults([]);
    setCurrentIdx(0);
  };

  const showResult = (result) => {
    const searchPolygon =
      result.category == "boundary"
        ? result.geojson
        : buffer(point([result.lon, result.lat].map(parseFloat)), 1, {
            units: "miles",
          }).geometry;
    updateMapState({ searchPolygon });
    const fitBoundsEvent = new CustomEvent("mapFitBounds", {
      detail: {
        bounds: bbox(searchPolygon),
        options: { padding: 100 },
      },
    });
    window.dispatchEvent(fitBoundsEvent);
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
        ref={input}
      />
      {text.length > 0 ? (
        <button class={style["clear"]} onClick={clear}>
          <span class="sr-only">Clear</span>
        </button>
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

export default AddressSearch;
