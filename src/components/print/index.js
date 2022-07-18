import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { fireEvent, mapToImage } from "../../utils";
import ActionButton from "../action-button";
import style from "./style.css";

const hPadding = 200,
  wPadding = 100;
function getDimensions() {
  const vh = window.innerHeight,
    vw = window.innerWidth,
    vhh = vh - hPadding,
    vhw = (vhh * 11) / 8.5,
    vww = vw - wPadding,
    vwh = (vww * 8.5) / 11;

  return [Math.min(vhw, vww), Math.min(vhh, vwh)];
}

const Print = ({ children, map, printing, setPrinting }) => {
  const [initialWidth, initialHeight] = getDimensions();
  const [height, setHeight] = useState(initialHeight);
  const [width, setWidth] = useState(initialWidth);

  const print = async () => {
    let dpi = 150;
    let imageUrl = await mapToImage(
      map.getStyle(),
      map.getBounds(),
      11 * dpi,
      8.5 * dpi,
      (11 * dpi) / width
    );
    window.open(imageUrl);
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      const [newWidth, newHeight] = getDimensions();
      setHeight(newHeight);
      setWidth(newWidth);
      fireEvent("mapResize");
    });
  }, []);

  return printing ? (
    <div class={style.print}>
      <div class={style.page} style={{ height, width }}>
        {[
          children,
          // <div class={style.label} key="print-title">
          //   <p class={style.primary}>
          //     2023 Coastal Master Plan
          //     <br />
          //     Future Without Action - Draft
          //   </p>
          //   <p class={style.secondary}>
          //     Land Change from Initial Conditions - Year 50
          //     <br />
          //     Higher Project Selection Scenario - S08
          //   </p>
          // </div>,
        ]}
      </div>
      <div class={style.buttons}>
        <ActionButton icon="print" action={print}>
          Print or Save
        </ActionButton>
        <ActionButton icon="close" action={() => setPrinting(false)}>
          Cancel
        </ActionButton>
      </div>
    </div>
  ) : (
    children
  );
};

export default Print;
