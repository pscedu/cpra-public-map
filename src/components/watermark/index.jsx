import { h } from "preact";
import style from "./style.module.css";

const Watermark = (props) => (
  <div class={style.watermark}>
    <div class={style["watermark-inner"]}>{props.children}</div>
  </div>
);

export default Watermark;
