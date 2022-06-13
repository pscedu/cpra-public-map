import { h } from "preact";
import style from "./style.css";

const ActionButton = ({ action, children, cssClass, icon }) => (
  <button class={`${style["action-button"]} ${cssClass}`} onClick={action}>
    {icon ? <ion-icon name={icon} /> : null}
    {children}
  </button>
);

export default ActionButton;
