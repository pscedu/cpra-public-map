import { h } from "preact";
import { useRef } from "preact/hooks";
import style from "./style.css";

const AddressSearch = ({ geocodeUrl }) => {
  const el = useRef(null);

  const search = async (e) => {
    // Only search when enter is pressed.
    if (e.keyCode !== 13) return;
    const url = new URL(geocodeUrl);
    url.searchParams.append("q", e.target.value);
    url.searchParams.append("addressdetails", "1");
    const res = await fetch(url.toString());
    const results = await res.json();
    if (results.length) zoomToResult(results[0]);
  };

  const zoomToResult = (result) => {
    const coords = result.boundingbox.map(parseFloat);
    const event = new CustomEvent("mapFitBounds", {
      bubbles: true,
      detail: {
        bounds: [coords[2], coords[0], coords[3], coords[1]],
        options: { padding: 100 },
      },
    });
    if (el.current) el.current.dispatchEvent(event);
  };

  return (
    <div class={style["address-search"]} ref={el}>
      <label for="address-search" class="sr-only">
        Address Search
      </label>
      <input
        type="text"
        id="address-search"
        placeholder="Search by Address"
        onKeyUp={search}
      />
    </div>
  );
};

export default AddressSearch;
