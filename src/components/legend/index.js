import { h } from "preact";
import style from "./style.css";

const getItems = (legend) =>
  legend.labels.map((label, i) => {
    const css = {};
    if (legend.colors) css.backgroundColor = legend.colors[i];
    const cls = legend.classes ? style[legend.classes[i]] : "";
    const tooltip = legend.tooltips ? { title: legend.tooltips[i] } : {};
    return (
      <li key={label} class={style["legend-item"]} {...tooltip}>
        <span class={`${style.symbol} ${cls}`} style={css} />
        <span class={style.label}>{label}</span>
      </li>
    );
  });

const Legend = ({ legends, mapState }) => {
  const content = [];
  const cssClass =
    style[`legend-${mapState.layer.replace(" ", "-").toLowerCase()}`];

  if (mapState.layer && legends[mapState.layer])
    content.push(
      <h2>{mapState.layer}</h2>,
      <ul>{getItems(legends[mapState.layer])}</ul>
    );

  return content.length ? (
    <section class={`${style.legend} ${cssClass}`}>{content}</section>
  ) : null;
};

export default Legend;
