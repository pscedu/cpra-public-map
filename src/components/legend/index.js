import { h } from "preact";
import style from "./style.css";

const Legend = (props) => {
  const legendItems = props.legend.labels.map((label, i) => (
    <li class={style["legend-item"]}>
      <span
        class={style.symbol}
        style={{ backgroundColor: props.legend.colors[i] }}
      ></span>
      <span class={style.label}>{label}</span>
    </li>
  ));
  return (
    <section class={style.legend}>
      <h2>Legend</h2>
      <ul>{legendItems}</ul>
    </section>
  );
};

export default Legend;
