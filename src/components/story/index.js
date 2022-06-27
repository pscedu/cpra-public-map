import { h } from "preact";
import style from "./style.css";

import ActionButton from "../action-button";
import Slide from "../slide";
import Slides from "../slides";

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
  const endTour = () => setSlide(null);
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
    >
      <Slide
        updateSlideState={updateMapState}
        slideState={mapState}
        layerSpec={layers["Projects"]}
      >
        <p>
          Louisiana's complex and fragile ecosystem is disappearing at an
          alarming rate. Between 1932 and 2010, Louisiana's coast lost more than
          1,800 square miles of land. From 2004 through 2008 alone, more than
          300 square miles of marshland were lost to Hurricanes Katrina, Rita,
          Gustav, and Ike. The major causes of this land loss include the
          effects of climate change, sea level rise, subsidence, hurricanes,
          storm surges, disconnection of the Mississippi River from coastal
          marshes, and human impacts.
        </p>
        <p>
          The 2023 Coastal Master Plan sets an ambitious path to respond to the
          loss of our coastal land and the threats from storm surge events. The
          master plan, in its purest sense, is a list of projects that build or
          maintain land and reduce risk to our communities.
        </p>
      </Slide>
      <Slide
        controls={["year"]}
        layerSpec={layers["Vegetation Type"]}
        updateSlideState={updateMapState}
        slideState={mapState}
      >
        <p>
          One major challenge in parts of coastal Louisiana is the inland
          migration of salt water over time. As the salinity gradient from
          coastal marshes to fresh forests is compromised, fresh and brackish
          species are forced into smaller habitable areas or completely wiped
          out. To inform restoration and resilience strategies in coastal
          Louisiana, teams of scientists and engineers have built robust
          technical models to predict vegetation change over time as a response
          to anticipated salinity changes.
        </p>
      </Slide>
      <Slide
        controls={["scenario"]}
        layerSpec={layers["Land Change"]}
        updateSlideState={updateMapState}
        slideState={mapState}
      >
        <p>
          The combination of sea level rise, land subsidence, and other
          environmental factors contributes significantly to rapid rates of land
          loss in coastal Louisiana. As marsh is converted to open water, the
          Louisiana coast loses habitat and its ability to suppress the impacts
          of large storms. The rate of land change over time is uncertain to
          some degree, so the 2023 Coastal Master Plan considers multiple future
          environmental scenarios to ensure we prepare for a wide range of
          possibilities.
        </p>
      </Slide>
      <Slide
        controls={["subtype"]}
        layerSpec={layers["Flood Depth"]}
        updateSlideState={updateMapState}
        slideState={mapState}
      >
        <p>
          Coastal Louisiana experiences a wide range of storm intensities, from
          tropical storms to Category 5 hurricanes. To estimate future flooding
          impacts, we model a range of storm intensities, sizes, and landfall
          locations across the coast. This information, along with the relative
          likelihood of each storm occurring, provides a rough idea of how
          flooding could occur across Louisiana's coast over the next 50 years.
        </p>
      </Slide>
      <Slide
        layerSpec={layers["Projects"]}
        updateSlideState={updateMapState}
        slideState={mapState}
      >
        <p>
          Restoration and flood risk reduction projects are key to addressing
          the challenges that Louisiana will face over the next 50 years (and
          beyond). Project concepts are acquired through public solicitation
          periods, which allow researchers, local experts, community members,
          and others to submit ideas to the Coastal Protection and Restoration
          Authority for consideration.
        </p>
        <p>
          A subset of proposed projects that meet baseline requirements are
          grouped into the 2023 Coastal Master Plan candidate project list, and
          their anticipated performance over a 50-year period is evaluated
          through an intensive modeling effort. Projects that are predicted to
          (1) maintain land area and/or decrease flood risk over time across a
          variety of environmental scenarios, (2) meet budget and resource
          constraints and (3) provide benefit to Louisiana residents are
          ultimately selected for the final list of 2023 Coastal Master Plan
          projects.
        </p>
      </Slide>
      <Slide
        layerSpec={layers["Projects"]}
        updateSlideState={updateMapState}
        slideState={mapState}
      >
        <p>
          Use the map navigation features to learn more about 2023 Coastal
          Master Plan candidate projects. Interested in seeing more data?
        </p>
        <p class={style.button}>
          <ActionButton
            icon="map"
            action={endTour}
            cssClass={style["action-button"]}
          >
            Explore the Map
          </ActionButton>
        </p>
      </Slide>
    </Slides>
  );
};

export default Story;
