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

const getColors = (scenario) => {
  return {
    fwoa: scenario === "lower" ? "#0BA7A0" : "#006B66",
    fwa: scenario === "lower" ? "#96CC3B" : "#5E8021",
  };
};

const getData = (props, damage, scenario) => {
  const values = getValues(props, damage, scenario);
  const colors = getColors(scenario);
  return {
    labels: [0, 10, 20, 30, 40, 50],
    datasets: [
      {
        label: "Without Plan",
        data: values.fwoa,
        backgroundColor: colors.fwoa,
      },
      {
        label: "With Plan",
        data: values.fwa,
        backgroundColor: colors.fwa,
      },
    ],
  };
};

const dollarFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

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
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        title: {
          display: true,
          text: `${metricName}: ${
            scenario.value === "higher" ? "Higher" : "Lower"
          } Scenario`,
        },
        tooltip: {
          callbacks: {
            label: (item) => {
              return `${item.dataset.label}: ${
                damage.value === "eadd"
                  ? dollarFormat.format(item.raw * 1000000)
                  : item.formattedValue
              }`;
            },
            title: (items) => `Year ${items[0].label}`,
          },
        },
      },
      responsive: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Year",
          },
        },
        y: {
          min: 0,
          title: {
            display: true,
            text:
              damage.value === "eadd"
                ? "Millions of $"
                : "Structure Equivalents",
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
      const values = getValues(props, damage.value, scenario.value);
      const colors = getColors(scenario.value);
      chart.value.data.datasets[0].data = values.fwoa;
      chart.value.data.datasets[0].backgroundColor = colors.fwoa;
      chart.value.data.datasets[1].data = values.fwa;
      chart.value.data.datasets[1].backgroundColor = colors.fwa;
      chart.value.options = chartOptions;
      chart.value.update();
    }
  }, [props, damage.value, scenario.value]);

  return <canvas ref={canvas} style={{ height: "100%", width: "100%" }} />;
};

export default CommunityDetail;
