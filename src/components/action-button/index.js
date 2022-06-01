import { h } from "preact";
import style from "./style.css";

const ActionButton = ({ action, children, icon }) => (
  <button class={style["action-button"]} onClick={action}>
    {icon ? <ion-icon name={icon} /> : null}
    {children}
  </button>
);

export default ActionButton;
