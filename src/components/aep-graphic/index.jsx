import { h } from "preact";
import style from "./style.module.css";

const AEPGraphic = () => {
  return (
    <div class={style.aep}>
      <p>
        More Intense
        <br />
        Less Likely
      </p>
      <div class={style["arrow-left"]} />
      <div class={style.bar} />
      <div class={style["arrow-right"]} />
      <p>
        Less Intense
        <br />
        More Likely
      </p>
    </div>
  );
};

export default AEPGraphic;
