import { h } from "preact";
import { useSignalEffect, useSignal } from "@preact/signals";
import { useContext, useRef } from "preact/hooks";
import { State } from "../../helpers/state";
import style from "./style.css";

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

const Search = () => {
  const { clearSearch, searchResult, searchResults, searchText } =
    useContext(State);
  const input = useRef(null);
  const currentIdx = useSignal(0);
  const focused = useSignal(false);

  const reset = () => {
    currentIdx.value = 0;
    clearSearch();
  };

  const keyUp = async (e) => {
    // Select the active result when enter is pressed.
    const results = searchResults.value;
    const idx = currentIdx.value;
    if (e.keyCode === 13) return (searchResult.value = results[idx]);
    if (e.keyCode === 27) return reset();
    if (e.keyCode === 38 && idx > 0) return currentIdx.value--;
    if (e.keyCode === 40 && idx < results.length - 1) return currentIdx.value++;
    searchText.value = e.target.value;
  };

  useSignalEffect(() => {
    if (input.current)
      input.current.value = searchResult.value
        ? searchResult.value.name
        : searchText.value;
  });

  return (
    <div class={style["address-search"]}>
      <label for="address-search" class="sr-only">
        Address Search
      </label>
      <input
        type="text"
        id="address-search"
        placeholder="Search by address, project, or region"
        onKeyDown={(e) =>
          [13, 27, 38, 40].includes(e.keyCode) && e.preventDefault()
        }
        onKeyUp={keyUp}
        onFocus={() => (focused.value = true)}
        onBlur={() => (focused.value = false)}
        ref={input}
      />
      {searchResult.value || searchText.value.length > 0 ? (
        <button class={style["clear"]} onClick={reset}>
          <span class="sr-only">Clear</span>
        </button>
      ) : null}
      {searchText.value.length == 0 && focused.value ? (
        <div class={style["instructions"]}>
          <p>These are examples of things you can find:</p>
          <ul class={style["examples"]}>
            <li>
              <strong>Address:</strong>{" "}
              <span class={style["example"]}>1300 Perdido St, New Orleans</span>
            </li>
            <li>
              <strong>LA House or Senate District:</strong>{" "}
              <span class={style["example"]}>State House District 49</span>
            </li>
            <li>
              <strong>Parish:</strong>{" "}
              <span class={style["example"]}>Terrebonne Parish</span>
            </li>
            <li>
              <strong>Project Name:</strong>{" "}
              <span class={style["example"]}>Morganza to the Gulf</span> or{" "}
              <span class={style["example"]}>#110b</span>
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
              <span class={style["example"]}>Congressional District 1</span>
            </li>
          </ul>
        </div>
      ) : null}
      {searchResults.value.length ? (
        <ul class={style["results"]}>
          {searchResults.value.map((result, i) => (
            <li
              key={result}
              class={`${style["result"]} ${
                style[i == currentIdx.value ? "active" : "inactive"]
              }`}
              onClick={() => (searchResult.value = result)}
              onMouseEnter={() => {
                currentIdx.value = i;
              }}
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
