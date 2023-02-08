import { State } from "../../helpers/state";
import { useSignal } from "@preact/signals";
import { useContext, useLayoutEffect, useRef } from "preact/hooks";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Legend,
  Title,
  Tooltip,
} from "chart.js";

// Register the Chart.js components used in the visualization.
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip
);

const diagonalStripesPattern = (color = "#8b8daa", width = 8) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 8;
  canvas.height = 8;
  context.strokeStyle = color;
  context.lineWidth = width;

  context.stroke;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, 8);
  context.stroke();

  const pattern = context.createPattern(canvas, "repeat");
  pattern.setTransform(new DOMMatrix("rotate(45deg)"));
  return pattern;
};

const getDatasetData = (props, unit, prefix) => {
  return [0, 10, 20, 30, 40, 50].map(
    (year) => props[`${prefix}${year}`] / unit
  );
};

const getValues = (props, damage, scenario) => {
  const prefix = [
    damage === "eadd" ? "ead" : "easd",
    scenario === "lower" ? "s07" : "s08",
  ].join("_");
  const unit = damage === "eadd" ? 1000000 : 1;
  return {
    fwoa: getDatasetData(props, unit, `${prefix}_g500_year`),
    fwa: getDatasetData(props, unit, `${prefix}_g516_year`),
  };
};

const getDisplayValues = (props, damage, scenario) => {
  const values = getValues(props, damage, scenario);
  const fwa = [0, ...values.fwa.slice(1)];
  return {
    fwoa: values.fwoa.map((value, i) => value - fwa[i]),
    fwa,
  };
};

const getData = (props, damage, scenario) => {
  const values = getDisplayValues(props, damage, scenario);
  return {
    labels: [0, 10, 20, 30, 40, 50],
    datasets: [
      {
        label: "With Plan",
        data: values.fwa,
        backgroundColor: "#8b8daa",
      },
      {
        label: "Without Plan",
        data: values.fwoa,
        backgroundColor: diagonalStripesPattern(),
      },
    ],
  };
};

const CommunityDetail = () => {
  const canvas = useRef(null);
  const chart = useSignal(null);
  const { damage, scenario, selection } = useContext(State);
  if (!selection.value || !selection.value.community) return;
  const props = selection.value.community;

  useLayoutEffect(() => {
    const metricName = {
      eadd: "Estimated Annual Damage, Dollars",
      easd: "Estimated Annual Structural Damage",
    }[damage.value];
    const chartOptions = {
      plugins: {
        title: {
          display: true,
          text: `${metricName}: ${
            scenario.value === "higher" ? "Higher" : "Lower"
          } Scenario`,
        },
      },
      responsive: false,
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Year",
          },
        },
        y: {
          stacked: true,
          min: 0,
          title: {
            display: true,
            text: damage.value === "eadd" ? "Millions of $" : "Structures",
          },
        },
      },
    };
    if (!chart.value) {
      chart.value = new Chart(canvas.current, {
        type: "bar",
        data: getData(props, damage.value, scenario.value),
        options: chartOptions,
      });
    } else {
      const displayValues = getDisplayValues(
        props,
        damage.value,
        scenario.value
      );
      chart.value.data.datasets[0].data = displayValues.fwa;
      chart.value.data.datasets[1].data = displayValues.fwoa;
      chart.value.options = chartOptions;
      chart.value.update();
    }
  }, [props, damage.value, scenario.value]);

  return <canvas ref={canvas} style={{ height: "100%", width: "100%" }} />;
};

export default CommunityDetail;
