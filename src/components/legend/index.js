import { h } from "preact";
import style from "./style.css";

const getItems = (spec) =>
  spec.labels.map((label, i) => {
    const css = {};
    css.backgroundImage = `url("${spec.images[i]}")`;
    const tooltip = spec.tooltips ? { title: spec.tooltips[i] } : {};
    return (
      <li key={label} class={style["legend-item"]} {...tooltip}>
        <span class={style.symbol} style={css} />
        <span class={style.label}>{label}</span>
      </li>
    );
  });

const Legend = ({ dpi, margin, spec, printing }) => {
  const content = [];
  const printingClass =
    style[`legend-${printing ? "printing" : "interactive"}`];
  const inlineStyle = !printing
    ? {}
    : {
        fontSize: `${(dpi * 8) / 72}px`,
        right: `${margin}px`,
        top: `${margin}px`,
      };

  if (spec) content.push(<h2>{spec.title}</h2>, <ul>{getItems(spec)}</ul>);

  return content.length ? (
    <section class={`${style.legend} ${printingClass}`} style={inlineStyle}>
      <div class={style["legend-inner"]}>{content}</div>
    </section>
  ) : null;
};

export default Legend;
