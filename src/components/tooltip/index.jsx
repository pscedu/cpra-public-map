import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import tippy from "tippy.js";
import style from "./style.module.css";
import "tippy.js/dist/tippy.css";

const Tooltip = ({ content }) => {
  const handle = useRef(null);
  useEffect(() => {
    if (handle.current)
      tippy(handle.current, {
        content,
        allowHTML: true,
      });
  }, [handle.current]);
  return (
    <div class={style.tooltip}>
      <span class={style.handle} ref={handle}>
        <ion-icon src="/assets/buttons/info.svg" />
      </span>
    </div>
  );
};

export default Tooltip;
