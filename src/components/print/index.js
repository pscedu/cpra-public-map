import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { fireEvent, mapToImage } from "../../utils";
import style from "./style.css";

import ActionButton from "../action-button";
import Legend from "../legend";

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

function addLineBreaks(values) {
  return values.map((value, i) => [
    value,
    i === values.length - 1 ? null : <br />,
  ]);
}

const Print = ({
  children,
  layer,
  legends,
  map,
  mapState,
  printing,
  printText,
  setPrinting,
}) => {
  const [initialWidth, initialHeight] = getDimensions();
  const [height, setHeight] = useState(initialHeight);
  const [width, setWidth] = useState(initialWidth);

  const titles = {
    primary: [
      "2023 Coastal Master Plan",
      `${printText.group[mapState.group]} - Draft`,
    ],
    secondary: [
      `${printText.layer[layer] || layer} - Year ${mapState.year}`,
      `${printText.scenario[mapState.scenario]} - ${mapState.scenario}`,
    ],
  };

  const print = async () => {
    let dpi = 150;
    let imageUrl = await mapToImage({
      style: map.getStyle(),
      bounds: map.getBounds(),
      width: 11 * dpi,
      height: 8.5 * dpi,
      legend: legends[layer],
      dpi,
      scaleFactor: (11 * dpi) / width,
      titles,
    });
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

  const dpi = height / 8.5;
  const margin = 0.5 * dpi;
  const legend = (
    <Legend
      dpi={dpi}
      legends={legends}
      layer={layer}
      margin={margin}
      printing={printing}
    />
  );

  return printing ? (
    <div class={style.print}>
      <div class={style.page} style={{ height, width }}>
        {[
          legend,
          children,
          <div
            class={style.label}
            key="print-title"
            style={{
              fontSize: `${(12 * dpi) / 72}px`,
              left: `${margin}px`,
              bottom: `${margin}px`,
            }}
          >
            <p class={style.primary}>{addLineBreaks(titles.primary)}</p>
            <p class={style.secondary}>{addLineBreaks(titles.secondary)}</p>
          </div>,
          <img
            key="logo"
            class={style.logo}
            src="/assets/images/logo.png"
            alt="Costal Protection and Restoration Authority"
            style={{
              bottom: `${margin}px`,
              height: 0.5 * dpi,
              right: `${margin}px`,
            }}
          />,
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
    [legend, children]
  );
};

export default Print;
