import { h } from "preact";
import { useRef } from "preact/hooks";
import bbox from "@turf/bbox";
import buffer from "@turf/buffer";
import { point } from "@turf/helpers";
import style from "./style.css";

const AddressSearch = ({ geocodeUrl, updateMapState }) => {
  const el = useRef(null);

  const search = async (e) => {
    // Only search when enter is pressed.
    if (e.keyCode !== 13) return;
    const url = new URL(geocodeUrl);
    url.searchParams.append("q", e.target.value);
    url.searchParams.append("addressdetails", "1");
    url.searchParams.append("polygon_geojson", "1");
    const res = await fetch(url.toString());
    const results = await res.json();
    if (results.length) showResult(results[0]);
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
      bubbles: true,
      detail: {
        bounds: bbox(searchPolygon),
        options: { padding: 100 },
      },
    });
    if (el.current) el.current.dispatchEvent(fitBoundsEvent);
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
