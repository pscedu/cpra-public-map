import { h } from "preact";
import style from "./style.css";
import { gtag } from "../../helpers/utils";

const ActionButton = ({ action, analyticsId, children, cssClass, icon }) => {
  const onClick = () => {
    gtag("event", "button_click", {
      button_id: analyticsId,
      button_text: children,
    });
    action();
  };
  return (
    <button class={`${style["action-button"]} ${cssClass}`} onClick={onClick}>
      {icon ? <ion-icon name={icon} /> : null}
      {children}
    </button>
  );
};

export default ActionButton;
