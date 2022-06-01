import { h } from "preact";
import style from "./style.css";

const ActionButton = ({ children, icon }) => (
  <button class={style["action-button"]}>
    {icon ? <ion-icon name={icon} /> : null}
    {children}
  </button>
);

export default ActionButton;
