import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../../helpers/state";
import style from "./style.css";

import ActionButton from "../action-button";
import Disclaimer from "../disclaimer";
import ProjectDetail from "../project-detail";
import ProjectList from "../project-list";
import Slide from "../slide";
import Slides from "../slides";

const Slideshow = () => {
  const { endTour, project } = useContext(State);
  return (
    <Slides>
      <Slide
        controls={["year", "scenario", "group", "projects"]}
        viewName="land-change"
        slideGroup="explore"
      >
        <Disclaimer />
      </Slide>
      <Slide
        controls={["year", "scenario", "group", "projects"]}
        viewName="vegetation-type"
        slideGroup="explore"
      >
        <Disclaimer />
      </Slide>
      <Slide
        controls={["year", "scenario", "group", "aep", "projects"]}
        viewName="flood-depth"
        slideGroup="explore"
      >
        <Disclaimer />
      </Slide>
      <Slide
        controls={["year", "scenario", "group", "damage", "projects"]}
        viewName="damage"
        slideGroup="explore"
      >
        <Disclaimer />
      </Slide>
      <Slide color="green" viewName="projects" slideGroup="explore">
        <ProjectList />
      </Slide>

      <Slide viewName="slide-0" slideGroup="tour" controls={["year"]}>
        <p>
          Louisiana&apos;s map has changed significantly over the past century,
          with what was land changing into open water in many areas. Between
          1932 and 2015, over <strong style={{ color: "red" }}>XXXX</strong>{" "}
          square miles of coastal land has been lost. This loss is a result of
          many factors&mdash;the impacts of leveeing the Mississippi River and
          reducing sediment transport, cutting navigation and oil and gas
          industry canals, and climate change.
        </p>
        <p>
          Use the <strong>year</strong> slider to see how land loss (blue) has
          changed the map since 1932.
        </p>
      </Slide>
      <Slide controls={["year"]} viewName="slide-1" slideGroup="tour">
        <p>
          Unfortunately, science shows that as sea level rises and storms
          increase in intensity due to climate change, additional land loss is
          still a threat to coastal Louisiana. Land change over time is
          uncertain to some degree, so the 2023 Coastal Master Plan considers
          multiple future environmental scenarios to ensure we prepare for a
          wide range of possibilities.
        </p>
        <p>
          In the next few slides, we&apos;ll take a look at projections of land
          change over time under a lower (more moderate) and higher (more
          severe) scenario to understand what Louisiana may look like in the
          future.
        </p>
      </Slide>
      <Slide
        controls={["year", "scenario"]}
        viewName="slide-2"
        slideGroup="tour"
      >
        <p>
          Continued sea level rise, along with land subsidence and other
          environmental factors will contribute to future land loss in coastal
          Louisiana. As marsh is converted to open water, the Louisiana coast
          loses habitat and its ability to suppress the impacts of large storms.
          The threat of significant land loss underlines the importance of
          taking action to address coastal challenges.
        </p>
        <p>
          Use the <strong>year</strong> slider to view modeled land change over
          time. Compare the land loss maps at the same point in time under
          different <strong>environmental scenarios</strong> to see different
          possible future outcomes.
        </p>
      </Slide>
      <Slide controls={["year", "aep"]} viewName="slide-3" slideGroup="tour">
        <p>
          Land loss is not the only challenge facing coastal Louisiana. Storm
          surge-based flooding brings waters into coastal communities and can
          damage homes and business. We model a range of storm intensities,
          sizes, and landfall locations across the coast which provides an idea
          of how flooding could occur across Louisiana&apos;s coast over the
          next 50 years if no action is taken.
        </p>
        <p>
          Use the <strong>year</strong> slider and buttons to see how flood
          depths change over time under different scenarios. You can also view
          projected flood depths resulting from storm events of various
          intensities (measured in{" "}
          <strong>annual exceedance probability</strong> or AEP).
        </p>
      </Slide>
      <Slide controls={["year", "damage"]} viewName="slide-4" slideGroup="tour">
        <p>
          Future storm surge-based flooding damages can be estimated by
          considering flood depths and the number and type of assets flooded in
          events across the coast. The cost of these damages in dollars is
          called Estimated Annual Damages, Dollars or EADD. Another way to
          quantify damages is to count how many whole and partial structures are
          damaged from an event and sum them to determine Estimated Annual
          Structural Damage, or EASD.
        </p>
        <p>
          Both damage metrics are projected over time and for different
          scenarios and event AEPs. Use the <strong>year</strong> slider to see
          how damages may change into the future for both{" "}
          <strong>damage metrics</strong>.
        </p>
      </Slide>
      <Slide viewName="slide-5" color="green" slideGroup="tour">
        <p>
          Clearly, if no action is taken, coastal Louisiana will face
          significant challenges that may have negative impacts on lives and
          livelihoods into the future. The 2023 Coastal Master Plan was
          developed in order to conceptualize, evaluate, and ultimately select
          promising restoration and risk reduction projects to address these
          challenges.
        </p>
        <p>
          A suite of <strong style={{ color: "red" }}>XXX</strong> projects have
          been selected for the master plan from a list of 131 candidate
          projects. Projects that were selected were projected to have benefits
          for the coast regardless of which scenario they were evaluated under.
          The projects can be seen in the map above and the impact of these
          projects is discussed in the next few slides.
        </p>
      </Slide>
      <Slide
        controls={["year", "group"]}
        viewName="slide-6"
        color="green"
        slideGroup="tour"
      >
        <p>
          When implemented, the master plan is projected to reduce land loss and
          build or maintain <strong style={{ color: "red" }}>XXX-XXX</strong> sq
          miles of coastal land over the 50 year model window. This is in
          addition to the benefits expected from projects in progress and on the
          ground.
        </p>
        <p>
          Change the <strong>project implementation scenario</strong> and use
          the <strong>year</strong> slider to compare a future without action to
          a future with the master plan over time and see the impact of
          investment in the coast.
        </p>
      </Slide>
      <Slide
        controls={["year", "aep", "group"]}
        viewName="slide-7"
        color="green"
        slideGroup="tour"
      >
        <p>
          Structural risk reductions projects can reduce storm surge-based flood
          depths in locations across coastal Louisiana. By building a physical
          impediment to surge flows, these projects work to improve outcomes
          during surge events.
        </p>
        <p>
          Change the <strong>project implementation scenario</strong> and use
          the <strong>year</strong> slider to see the impact of investment in
          the coast. You can also view changes to projected flood depths
          resulting from storm events of various intensities (measured in{" "}
          <strong>annual exceedance probability</strong> or AEP).
        </p>
      </Slide>
      <Slide
        controls={["year", "damage", "group"]}
        viewName="slide-8"
        color="green"
        slideGroup="tour"
      >
        <p>
          Like flood depths, damages can be reduced to implementation of master
          plan projects. Reduction in both the cost and number of structures
          damaged during storm events is a significant benefit of the 2023
          Coastal Master Plan.
        </p>
        <p>
          Change the <strong>project implementation scenario</strong>to see the
          impact of investment in the coast. Change the{" "}
          <strong>damage metric</strong> and use the <strong>year</strong>{" "}
          slider to see how the master plan changes damage values into the
          future.
        </p>
      </Slide>
      <Slide viewName="slide-9" color="green" slideGroup="tour">
        <p>
          The future coast of Louisiana is going to be experienced as different
          than today&apos;s coast. Through the development of the 2023 Coastal
          Master Plan, projections of coastal change illustrate how challenging
          those changes may be. Fortunately, the restoration and risk reduction
          projects laid out in the master plan can help to mitigate land loss
          and storm surge-based flood risk and associated storm damages.
        </p>
        <p>
          Use the button below to move to the Explore portion of the master plan
          data viewer. While exploring, you can learn more about the future
          coast and projects worth investing in!
        </p>
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
      {project.value ? (
        <Slide title="Project Details" color="green" overlay={true}>
          <ProjectDetail />
        </Slide>
      ) : null}
    </Slides>
  );
};

export default Slideshow;
