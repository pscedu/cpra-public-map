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

const Legend = ({ dpi, legends, layer, margin, printing }) => {
  const content = [];
  const layerClass = style[`legend-${layer.replace(" ", "-").toLowerCase()}`];
  const printingClass =
    style[`legend-${printing ? "printing" : "interactive"}`];
  const inlineStyle = !printing
    ? {}
    : {
        fontSize: `${(dpi * 8) / 72}px`,
        right: `${margin}px`,
        top: `${margin}px`,
      };

  if (layer && legends[layer])
    content.push(<h2>{layer}</h2>, <ul>{getItems(legends[layer])}</ul>);

  return content.length ? (
    <section
      class={`${style.legend} ${layerClass} ${printingClass}`}
      style={inlineStyle}
    >
      <div class={style["legend-inner"]}>{content}</div>
    </section>
  ) : null;
};

export default Legend;
