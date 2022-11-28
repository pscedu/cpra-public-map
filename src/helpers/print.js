const hPadding = 200,
  wPadding = 100;

const drawLogo = (canvas, dpi, logoImage, margin = 0.5) => {
  const ctx = canvas.getContext("2d");
  const targetWidth = dpi * 0.5;
  const targetHeight = (logoImage.height * targetWidth) / logoImage.width;
  ctx.drawImage(
    logoImage,
    canvas.width - dpi * margin - targetWidth,
    canvas.height - dpi * margin - targetHeight,
    targetWidth,
    targetHeight
  );
};

const drawText = ({
  ctx,
  text,
  fontFamily,
  fontSize,
  fontWeight,
  color,
  x,
  y,
}) => {
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};

const drawTitles = (glCanvas, dpi, titles, margin = 0.5) => {
  const canvas = document.createElement("canvas");
  canvas.height = glCanvas.height;
  canvas.width = glCanvas.width;

  const ctx = canvas.getContext("2d");
  const options = {
    color: "#005371",
    ctx,
    fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
    x: margin * dpi,
  };

  // Copy map image to 2D canvas.
  ctx.drawImage(glCanvas, 0, 0);

  const lines = [];
  for (let title of titles.primary)
    lines.push({
      ...options,
      fontSize: (18 * dpi) / 72,
      fontWeight: "bold",
      lineHeight: 1.1,
      text: title.toUpperCase(),
    });

  for (let title of titles.secondary)
    lines.push({
      ...options,
      fontSize: (12 * dpi) / 72,
      fontWeight: "normal",
      lineHeight: 1.1,
      text: title.toUpperCase(),
    });

  lines.reverse();
  let y = canvas.height - dpi * margin;
  lines.forEach((line, i) => {
    if (i > 0) y -= line.fontSize * line.lineHeight;
    drawText({ ...line, y });
  });

  return canvas;
};

const loadImage = (url) => {
  const img = new Image();
  return new Promise((resolve) => {
    img.onload = () => resolve(img);
    img.src = url;
  });
};

const loadPrintMap = (style, bounds, width, height) => {
  return new Promise((resolve) => {
    let container = document.createElement("div");
    container.style.height = `${height}px`;
    container.style.left = "-9999px";
    container.style.position = "absolute";
    container.style.top = "-9999px";
    container.style.width = `${width}px`;
    document.body.appendChild(container);

    // eslint-disable-next-line no-undef
    let map = new maplibregl.Map({
      bounds,
      container,
      fadeDuration: 0,
      interactive: false,
      preserveDrawingBuffer: true,
      style,
    });

    map.on("load", () => resolve(map));
  });
};

export function addLineBreaks(values) {
  return values.map((value, i) => [
    value,
    i === values.length - 1 ? null : <br />,
  ]);
}

export function getDimensions() {
  const vh = window.innerHeight,
    vw = window.innerWidth,
    vhh = vh - hPadding,
    vhw = (vhh * 11) / 8.5,
    vww = vw - wPadding,
    vwh = (vww * 8.5) / 11;

  return [Math.min(vhw, vww), Math.min(vhh, vwh)];
}

export async function mapToImage({
  style,
  bounds,
  dpi,
  width,
  height,
  scaleFactor,
  titles,
}) {
  style.layers.forEach((layer) => {
    if (layer.type === "raster") {
      layer.paint = layer.paint || {};
      layer.paint["raster-fade-duration"] = 0;
    }
    for (let category of ["layout", "paint"]) {
      if (!layer[category]) continue;
      for (let propName in layer[category]) {
        let value = layer[category][propName];
        if (
          propName.endsWith("-radius") ||
          propName.endsWith("-size") ||
          propName.endsWith("-width")
        ) {
          if (value[0] == "interpolate") {
            layer[category][propName][4] = value[4] * scaleFactor;
            layer[category][propName][6] = value[4] * scaleFactor;
          } else {
            layer[category][propName] = ["*", value, scaleFactor];
          }
        }
      }
    }
  });

  const [map, logoImage] = await Promise.all([
    loadPrintMap(style, bounds, width, height),
    loadImage("/assets/images/logo.png"),
  ]);
  const canvas = drawTitles(map.getCanvas(), dpi, titles);
  drawLogo(canvas, dpi, logoImage);
  const dataUrl = canvas.toDataURL();
  const container = map.getContainer();
  map.remove();
  document.body.removeChild(container);
  return dataUrl;
}
