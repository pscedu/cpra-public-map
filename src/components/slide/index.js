import { h } from "preact";
import style from "./style.css";

const Slide = (props) => {
  return (
    <section class={style.slide}>
      {props.title ? <h2>{props.title}</h2> : null}
      {props.children}
    </section>
  );
};

export default Slide;
