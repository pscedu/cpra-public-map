import { h } from "preact";
import style from "./style.css";

import ActionButton from "../action-button";
import Slide from "../slide";
import Slides from "../slides";

const Story = ({
  dismissOverlay,
  projectMap,
  mapState,
  overlaySlide,
  slide,
  setSlide,
  updateMapState,
  views,
}) => {
  const endTour = () => setSlide(null);
  return (
    <Slides
      cssClass={style.story}
      currentIdx={slide}
      dismissOverlay={dismissOverlay}
      mapState={mapState}
      navigationType="arrows"
      overlaySlide={overlaySlide}
      projectMap={projectMap}
      setCurrentIdx={setSlide}
      updateMapState={updateMapState}
    >
      <Slide
        updateSlideState={updateMapState}
        slideState={mapState}
        view={views["slide-0"]}
      >
        <p>
          Louisiana impacted by environmental change over time (link to past
          change e.g., Brady&apos;s work) that causes challenges with changes to
          landscape/habitat/veg, leads to land loss, community impacts including
          flood risk/damages (you will advance through this guided tour by
          clicking the right pointing arrow at the bottom of the panel).
        </p>
        <p>
          First, we&apos;ll see what the future of Louisiana may look like
          without any further restoration or risk reduction interventions by the
          state.
        </p>
      </Slide>
      <Slide
        controls={["year"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        view={views["slide-1"]}
      >
        <p>
          In order to plan for future change, predictive models are used. For
          planning we look at 50 year window (you will use slider to see data at
          different points in time). We also have uncertainty about how climate
          will change, so we look at outcomes with different environmental
          scenarios (you select lower or higher scenario to see differences
          between possible future conditions). Lower is more moderate changes to
          sea level rise and other climate variables, higher is more significant
          changes from present conditions.
        </p>
      </Slide>
      <Slide
        controls={["year", "scenario"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        view={views["slide-2"]}
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
        <p>
          Click the buttons below to view the modeled land change taking into
          account <strong>Lower</strong> rates of environmental change over time
          and <strong>Higher</strong> rates of environmental change over time.
        </p>
      </Slide>
      <Slide
        controls={["year", "subtype"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        view={views["slide-3"]}
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
          Use the buttons below to view the projected flood depths resulting
          from events of various intensities (measured in annual exceedance
          probability or AEP).
        </p>
      </Slide>
      <Slide
        controls={["year", "damage"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        view={views["slide-4"]}
      >
        <p>Placeholder for EAD and EASD</p>
      </Slide>
      <Slide
        updateSlideState={updateMapState}
        slideState={mapState}
        view={views["slide-5"]}
        tabClass="green"
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
        controls={["year", "scenario"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        view={views["slide-6"]}
        tabClass="green"
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
        <p>
          Click the buttons below to view the modeled land change taking into
          account <strong>Lower</strong> rates of environmental change over time
          and <strong>Higher</strong> rates of environmental change over time.
        </p>
      </Slide>
      <Slide
        controls={["year", "subtype"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        view={views["slide-7"]}
        tabClass="green"
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
          Use the buttons below to view the projected flood depths resulting
          from events of various intensities (measured in annual exceedance
          probability or AEP).
        </p>
      </Slide>
      <Slide
        controls={["year", "damage"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        view={views["slide-8"]}
        tabClass="green"
      >
        <p>Placeholder for EAD and EASD</p>
      </Slide>
      <Slide
        updateSlideState={updateMapState}
        slideState={mapState}
        view={views["slide-9"]}
        tabClass="green"
      >
        <h3>Interested in seeing more data?</h3>
        <p class={style.button}>
          <ActionButton
            analyticsId="tour_end_explore"
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
