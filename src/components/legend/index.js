import { h } from "preact";
import style from "./style.css";

const getItems = (legend) =>
  legend.labels.map((label, i) => {
    const css = {};
    css.backgroundImage = `url("${legend.images[i]}")`;
    const tooltip = legend.tooltips ? { title: legend.tooltips[i] } : {};
    return (
      <li key={label} class={style["legend-item"]} {...tooltip}>
        <span class={style.symbol} style={css} />
        <span class={style.label}>{label}</span>
      </li>
    );
  });

const Legend = ({ legends, layer }) => {
  const content = [];
  const cssClass = style[`legend-${layer.replace(" ", "-").toLowerCase()}`];

  if (layer && legends[layer])
    content.push(<h2>{layer}</h2>, <ul>{getItems(legends[layer])}</ul>);

  return content.length ? (
    <section class={`${style.legend} ${cssClass}`}>{content}</section>
  ) : null;
};

export default Legend;
