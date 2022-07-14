import { h } from "preact";
import style from "./style.css";

const Modal = ({ children, open = false, title }) => {
  if (!open) return null;
  return (
    <div class={style.background}>
      {title ? <div class={style.title}>{title}</div> : null}
      <div class={style.modal}>{children}</div>
    </div>
  );
};

export default Modal;
