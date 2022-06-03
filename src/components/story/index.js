import { h } from "preact";
import style from "./style.css";

import Slide from "../slide";
import Slides from "../slides";

const Story = ({
  layers,
  projectMap,
  mapState,
  slide,
  setSlide,
  updateMapState,
}) => {
  if (!layers) return;
  return (
    <Slides
      arrows={true}
      cssClass={style.story}
      currentIdx={slide}
      mapState={mapState}
      navigation="dots"
      projectMap={projectMap}
      setCurrentIdx={setSlide}
      updateMapState={updateMapState}
    >
      <Slide
        layerSpec={layers["Projects"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        title="Welcome to the Louisiana Coastal Protection and Restoration Authority Data Viewer"
      >
        <p>
          The Story Mode introduces users to the CPRA Master Plan process and
          the tools that are available in this data viewer. The Predict sections
          demonstrate predictive modeling data, which is used to better
          understand future coastal change in Louisiana. The Take Action
          sections highlight the protection and restoration projects that have
          been selected as part of the Coastal Master Plan.
        </p>
      </Slide>
      <Slide
        controls={["year"]}
        layerSpec={layers["Land Change"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        title="Land Change"
      >
        <p>
          The combination of sea level rise and land subsidence contributes
          significantly to rapid rates of land loss in coastal Louisiana. As
          marsh is converted to open water, the Louisiana coast loses habitat
          and its ability to suppress the impacts of large storms. To inform
          resilience strategies in coastal Louisiana, teams of scientists and
          engineers have built robust technical models to predict future land
          change. Use the slider below to see where we expect to lose and gain
          land along the Louisiana coast over a 50-year time period.
        </p>
      </Slide>
      <Slide
        controls={["scenario"]}
        layerSpec={layers["Vegetation Type"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        title="Vegetation Type"
      >
        <p>
          A major issue in parts of coastal Louisiana is the inland migration of
          salt water over time. As the salinity gradient from coastal marshes to
          fresh forests is compromised, fresh-brackish species are compressed to
          smaller habitable areas, (or completely wiped out in some cases). The
          severity of salinity change over time is uncertain to some degree, so
          the Louisiana Coastal Master Plan considers multiple future
          environmental scenarios to ensure we prepare for a wide range of
          possibilities. Use the drop-down selector below to view the modeled
          vegetated species mixture taking into account a less-severe future
          environmental scenario (S07) and a more-severe future environmental
          scenario (S08).
        </p>
      </Slide>
    </Slides>
  );
};

export default Story;
