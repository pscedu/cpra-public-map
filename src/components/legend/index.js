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
  if (mapState.showProjects)
    content.push(<h2>Projects</h2>, <ul>{getItems(legends["Projects"])}</ul>);

  if (mapState.modelLayer !== "")
    content.push(
      <h2>{mapState.modelLayer}</h2>,
      <ul>{getItems(legends[mapState.modelLayer])}</ul>
    );

  return content.length ? (
    <section class={style.legend}>{content}</section>
  ) : null;
};

export default Legend;
