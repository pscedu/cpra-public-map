import { h } from "preact";
import style from "./style.css";
import { fireEvent } from "../../utils";

import AEPGraphic from "../aep-graphic";
import ActionButton from "../action-button";
import Slide from "../slide";
import Slides from "../slides";
import Disclaimer from "../disclaimer";

const Story = ({
  layer,
  layers,
  projectMap,
  mapState,
  slide,
  setSlide,
  updateMapState,
}) => {
  if (!layers) return;
  const viewProjectList = () => updateMapState({ view: "projects" });
  const selectProject = (project) => projectMap[project].select();
  const resetMap = () => {
    fireEvent("mapFitBounds", {
      bounds: [-93.845, 29.09, -89.175, 30.395],
      options: {
        padding: {
          top: 50,
          right: 100,
          bottom: 300,
          left: 50,
        },
      },
    });
    fireEvent("searchClearResult");
  };
  const aepGraphic = <AEPGraphic />;
  return (
    <Slides
      arrows={true}
      cssClass={style.story}
      currentIdx={slide}
      layer={layer}
      mapState={mapState}
      navigation="dots"
      projectMap={projectMap}
      setCurrentIdx={setSlide}
      updateMapState={updateMapState}
      changeCallback={resetMap}
    >
      <Slide
        controls={["scenario"]}
        layerSpec={layers["Land Change"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        scenario="S07"
        year="50"
      >
        <p>
          Louisiana's complex and fragile ecosystem is disappearing at an
          alarming rate. Between 1932 and 2010, Louisiana's coast lost more than
          1,800 square miles of land. From 2004 through 2008 alone, more than
          300 square miles of marshland were lost to Hurricanes Katrina, Rita,
          Gustav, and Ike. The major causes of this land loss include the
          effects of climate change, sea level rise, subsidence, hurricanes,
          storm surges, disconnection of the Mississippi River from coastal
          marshes, and human impacts. The rate of land change is uncertain, so
          the 2023 Coastal Master Plan considers <strong>Lower</strong> and{" "}
          <strong>Higher</strong> environmental scenarios to ensure we prepare
          for a wide range of possibilities.
        </p>
        <Disclaimer />
      </Slide>
      <Slide
        layerSpec={layers["Land Change"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        scenario="S07"
        year="50"
      >
        <p>
          As marsh is converted to open water, the Louisiana coast loses habitat
          and its ability to suppress the impacts of large storms. The 2023
          Coastal Master Plan sets an ambitious path to respond to the loss of
          our coastal land and the threats from storm surge events. The master
          plan, in its purest sense, is a list of projects that build or
          maintain land and reduce risk to our communities.
        </p>
        <p>
          One candidate project, the proposed{" "}
          <strong>Lower Barataria Landbridge</strong>, is designed to act as a
          natural barrier to control hydrology in the basin, mitigate the
          impacts of sea level rise, and stimulate the natural regeneration of
          marsh in this ecologically diverse region. If the project performs
          well in our modeling, it may be selected for inclusion in the Coastal
          Master Plan with the potential for future funding and construction.
        </p>
        <p class={style.button}>
          <ActionButton
            action={() => selectProject("Lower Barataria Landbridge")}
          >
            View the Proposed Lower Barataria Landbridge
          </ActionButton>
        </p>
      </Slide>
      <Slide
        controls={["year"]}
        layerSpec={layers["Vegetation Type"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        scenario="S07"
        year="0"
      >
        <p>
          One major challenge in parts of coastal Louisiana is the inland
          migration of salt water over time. As the salinity gradient from
          coastal marshes to fresh forests is compromised, fresh and brackish
          species are forced into smaller habitable areas or completely wiped
          out.
        </p>
        <p>
          Teams of scientists and engineers have built robust technical models
          to predict vegetation change over time as a response to anticipated
          salinity changes. The Master Plan Data Viewer displays the predicted
          vegetation change over <strong>50 years in 10-year increments</strong>
          .
        </p>
      </Slide>
      <Slide
        layerSpec={layers["Vegetation Type"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        scenario="S07"
        year="50"
      >
        <p>
          The proposed <strong>Atchafalaya River Diversion</strong> project is
          designed to convey fresh water from the Atchafalaya River into the
          Terrebonne basin in order to maintain a natural/healthy fresh-saline
          gradient. If the project performs well in our modeling, it may be
          selected for inclusion in the Coastal Master Plan with the potential
          for future funding and construction.
        </p>
        <p class={style.button}>
          <ActionButton
            action={() => selectProject("Atchafalaya River Diversion")}
          >
            View the Proposed Atchafalaya River Diversion
          </ActionButton>
        </p>
      </Slide>
      <Slide
        controls={["subtype"]}
        layerSpec={layers["Flood Depth"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        scenario="S07"
        year="50"
        footer={aepGraphic}
      >
        <p>
          Coastal Louisiana experiences a wide range of storm intensities, from
          tropical storms to Category 5 hurricanes. To estimate future flooding
          impacts, we model a range of storm intensities, sizes, and landfall
          locations across the coast. This information, along with the relative
          likelihood of each storm occurring, provides a rough idea of how
          flooding could occur across Louisiana's coast over the next 50 years.
        </p>
        <p>
          We model storm events of various intensities, measured in annual
          exceedance probability (AEP), from <strong>0.2% to 10.0% AEP</strong>.
        </p>
      </Slide>
      <Slide
        layerSpec={layers["Flood Depth"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        scenario="S07"
        year="50"
      >
        <p>Information about a proposed project addressing flooding.</p>
        <p class={style.button}>
          <ActionButton>View the Proposed Project</ActionButton>
        </p>
      </Slide>
      <Slide
        layerSpec={layers["Projects"]}
        updateSlideState={updateMapState}
        slideState={mapState}
      >
        <p>
          More than 140 restoration and flood risk reduction projects are
          currently under consideration for inclusion in the 2023 Coastal Master
          Plan. The candidate projects are based on public input from
          researchers, local experts, community members, and others.
        </p>
        <p>
          Candidate projects are evaluated through an intensive modeling effort
          that predicts their performance over 50 years. The projects selected
          for inclusion in the master plan will maintain land area and/or
          decrease flood risk over time across a variety of environmental
          scenarios; meet budget and resource constraints; and provide benefit
          to Louisiana residents.
        </p>
        <p>
          To learn more about the candidate projects,{" "}
          <strong>explore the map or view the candidate project list.</strong>
        </p>
        <p class={style.button}>
          <ActionButton
            action={viewProjectList}
            cssClass={style["action-button"]}
          >
            View the Candidate Project List
          </ActionButton>
        </p>
      </Slide>
    </Slides>
  );
};

export default Story;
