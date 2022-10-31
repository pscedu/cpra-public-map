import { h } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import * as config from "../../helpers/config";
import { State } from "../../helpers/state";
import { mapToImage } from "../../helpers/utils";
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

const Print = ({ children }) => {
  const { group, map, mapResize, scenario, subtype, printing, view, year } =
    useContext(State);
  const layerName = view.value.layer.name;
  const { printText } = config;

  const [initialWidth, initialHeight] = getDimensions();
  const [height, setHeight] = useState(initialHeight);
  const [width, setWidth] = useState(initialWidth);

  const titles = {
    primary: [
      "2023 Coastal Master Plan",
      `${printText.group[group.value]} - Draft`,
    ],
    secondary: [
      `${printText.layer[layerName] || layerName} - Year ${year.value}`,
      `${printText.scenario[scenario.value]} - ${scenario.value}`,
    ],
  };

  const print = async () => {
    let dpi = 150;
    let imageUrl = await mapToImage({
      style: map.value.getStyle(),
      bounds: map.value.getBounds(),
      width: 11 * dpi,
      height: 8.5 * dpi,
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
      mapResize();
    });
  }, []);

  const dpi = height / 8.5;
  const margin = 0.5 * dpi;
  const legend = (
    <Legend
      dpi={dpi}
      spec={view.value.layer.legend(subtype.value)}
      margin={margin}
      printing={printing.value}
    />
  );

  return printing.value ? (
    <div class={`${style.print} printing`}>
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
        <ActionButton action={print}>Print or Save</ActionButton>
        <ActionButton action={() => (printing.value = false)}>
          Cancel
        </ActionButton>
      </div>
    </div>
  ) : (
    [legend, children]
  );
};

export default Print;
