import { h } from "preact";
import { useContext } from "preact/hooks";
import { factSheetBaseUrl } from "../../helpers/config";
import { State } from "../../helpers/state";
import style from "./style.css";

import ActionButton from "../action-button";
import CommunityDetail from "../community-detail";
import ProjectDetail from "../project-detail";
import ProjectList from "../project-list";
import Slide from "../slide";
import Slides from "../slides";
import Tooltip from "../tooltip";

const Slideshow = () => {
  const { endTour, project, selection } = useContext(State);
  return (
    <Slides>
      <Slide
        controls={["year", "scenario", "group", "projects"]}
        viewName="land-change"
        slideGroup="explore"
      >
        <p>
          With continuing coastal change, sea level rise and other environmental
          processes will lead to additional land loss in coastal Louisiana over
          50 years. Projects included in the 2023 Coastal Master Plan will
          reduce land loss in areas across the coast.
        </p>
        <p>
          Through building and/or maintaining coastal wetlands, the fully
          implemented master plan would avoid losing approximately 310 square
          miles of land under a lower environmental scenario and 230 square
          miles under a higher environmental scenario over 50 years. This is in
          addition to the benefits expected from projects in progress and those
          that are already on the ground.
        </p>
      </Slide>
      <Slide
        controls={["year", "scenario", "vegetation", "group", "projects"]}
        viewName="vegetation-type"
        slideGroup="explore"
      >
        <p>
          Wetland vegetation is responsive to changes in the environment, such
          as increases to salinity or inundation levels over time. Over 50 years
          the distribution of different wetland vegetation classes will shift
          and change, impacting habitats and ecosystems. The projects selected
          for the 2023 Coastal Master Plan support a variety of vegetation types
          coastwide.
        </p>
      </Slide>
      <Slide
        controls={["year", "scenario", "aep", "group", "projects"]}
        viewName="flood-depth"
        slideGroup="explore"
      >
        <p>
          Future flood risk will change into the future. To estimate future
          flooding potential, we modeled a range of storm intensities, sizes,
          and landfall locations across the coast. This information, along with
          the relative likelihood of each storm occurring, allow us to project
          potential flood depths into the future.
        </p>
        <p>
          This map allows you to adjust parameters to explore the flood depth
          for a storm of a given annual exceedance probability (% AEP) if
          experienced at a particular location and time under either the lower
          or higher environmental scenario.
        </p>
      </Slide>
      <Slide
        controls={["year", "scenario", "damage", "group", "projects"]}
        viewName="damage"
        slideGroup="explore"
      >
        <p>
          Economic and structure damage related to storm surge-based flooding
          are expected to increase over time as sea level rises and storms
          intensify. If fully implemented, the projects in the 2023 Coastal
          Master Plan can reduce risk and prevent damage over 50 years.
        </p>
        <p>
          Without the plan, under the lower scenario, there would be expected
          annual damage of approximately $15 billion and damage to the
          equivalent of 14,000 structures. With the plan, $11 billion in
          expected annual damage in dollars is prevented, along with reducing
          expected annual damage to the equivalent of 11,000 structures.
        </p>
        <p>
          Without the plan, under the higher scenario, there would be expected
          annual damage of approximately $24 billion and damage to the
          equivalent of 22,000 structures. With the plan, $15 billion in
          expected annual damage in dollars is prevented, along with reducing
          expected annual damage to the equivalent of 15,000 structures.
        </p>
      </Slide>
      <Slide
        controls={["yearimplementation"]}
        color="green"
        layout="full"
        viewName="projects"
        slideGroup="explore"
      >
        <ProjectList />
      </Slide>

      <Slide viewName="slide-0" slideGroup="tour" controls={["year"]}>
        <p>
          Louisiana&apos;s map has changed significantly over the past century,
          with what was land changing into open water in many areas.{" "}
          <a href="https://pubs.er.usgs.gov/publication/sim3381">
            Between 1932 and 2015, over 2,000 square miles of coastal land has
            been lost.
          </a>{" "}
          This loss is a result of many factors&mdash;the impacts of leveeing
          the Mississippi River and reducing sediment transport, cutting
          navigation and oil and gas industry canals, and climate change.
        </p>
        <p>
          Use the <strong>year</strong> slider to see how land loss (blue) has
          changed the landscape since 1932.
        </p>
      </Slide>
      <Slide viewName="slide-1" slideGroup="tour">
        <p>
          As sea level rises and storms increase in intensity due to climate
          change, land loss will continue to be a threat to coastal Louisiana.
          Land change over time is uncertain to some degree, so the 2023 Coastal
          Master Plan considers multiple future environmental scenarios to
          ensure we prepare for a wide range of possibilities.
        </p>
        <p>
          In the next few slides, we&apos;ll take a look at projections of land
          change over time under a lower (more moderate) and higher (more
          severe) scenario to understand what coastal Louisiana may look like in
          the future.
        </p>
      </Slide>
      <Slide
        controls={["year", "scenario"]}
        viewName="slide-2"
        slideGroup="tour"
      >
        <p>
          Without the implementation of the 2023 Coastal Master Plan, Louisiana
          would be at risk of losing approximately 1,100 square miles of land
          under a lower environmental scenario and 3,000 square miles under a
          higher environmental scenario over 50 years. The threat of significant
          land loss underlines the importance of taking action to address
          coastal challenges.
        </p>
        <p>
          Use the <strong>year</strong> slider to view modeled land change over
          time. Compare the land loss maps at the same point in time under
          different <strong>environmental scenarios</strong> to see a range of
          possible future outcomes.
        </p>
      </Slide>
      <Slide
        controls={["year", "scenario", "aep"]}
        viewName="slide-3"
        slideGroup="tour"
      >
        <p>
          Land loss is not the only challenge facing coastal Louisiana. Storm
          surge-based flooding brings waters into coastal communities and can
          damage homes and business, costing tens of billions of dollars. We
          model a range of storm intensities, sizes, and landfall locations
          across the coast which provides an idea of how flooding could occur
          across Louisiana&apos;s coast over the next 50 years if no action is
          taken.
        </p>
        <p>
          Adjust the <strong>year</strong> slider and{" "}
          <strong>environmental scenario</strong> to see how flood depths change
          over time under different scenarios. You can also view projected flood
          depths resulting from storm events of various intensities (measured in{" "}
          <strong>annual exceedance probability</strong> or AEP).
        </p>
      </Slide>
      <Slide
        controls={["year", "scenario", "damage"]}
        viewName="slide-4"
        slideGroup="tour"
      >
        <p>
          Future storm surge-based flooding damages can be estimated by
          considering flood depths and the number and type of assets flooded in
          events across the coast. The cost of these damages is the Expected
          Annual Damage in Dollars or EADD. Another way to quantify damages is
          to count how many whole and partial structures are damaged from an
          event and sum them to determine the Expected Annual Structural Damage,
          or EASD.
        </p>
        <p>
          Both damage metrics are projected over time and for different
          scenarios and event AEPs. Adjust the <strong>year</strong> slider and{" "}
          <strong>environmental scenario</strong> to see how damages may change
          into the future for both <strong>damage metrics</strong>.
        </p>
      </Slide>
      <Slide
        controls={["yearimplementation"]}
        viewName="slide-5"
        color="green"
        slideGroup="tour"
      >
        <p>
          To take action toward addressing the challenges of a changing coast, a
          suite of 73 restoration and risk reduction projects has been selected
          for the 2023 Coastal Master Plan. When fully implemented, the plan
          will provide a myriad of benefits for coastal communities and
          ecosystems, including avoiding hundreds of square miles of land loss
          and reducing expected annual damage from storm surge-based flooding by
          billions of dollars.
        </p>
        <p>
          Projects take time to design and construct, and therefore do not all
          appear on the landscape at the same time. Adjust the{" "}
          <strong>year</strong> slider to see when and where selected projects
          are implemented across the 50 year master plan period.
        </p>
      </Slide>
      <Slide
        controls={["year", "scenario", "group"]}
        viewName="slide-6"
        color="green"
        slideGroup="tour"
      >
        <p>
          Projects included in the 2023 Coastal Master Plan will reduce land
          loss in areas across the coast. Through building and/or maintaining
          coastal wetlands, the fully implemented master plan would avoid losing
          approximately 310 square miles of land under a lower environmental
          scenario and 230 square miles under a higher environmental scenario
          over 50 years. This is in addition to the benefits expected from
          projects in progress and those that are already on the ground.
        </p>
        <p>
          Change the <strong>plan implementation scenario</strong> and use the{" "}
          <strong>year</strong> slider to compare a future without action to a
          future with the master plan over time and see the impact of investment
          in the coast.
        </p>
      </Slide>
      <Slide
        controls={["year", "scenario", "aep", "group"]}
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
          Change the <strong>plan implementation scenario</strong> and use the{" "}
          <strong>year</strong> slider to see the impact of investment in the
          coast. You can also view changes to projected flood depths resulting
          from storm events of various intensities (measured in{" "}
          <strong>annual exceedance probability</strong> or AEP).
        </p>
      </Slide>
      <Slide
        controls={["year", "scenario", "damage"]}
        viewName="slide-8"
        color="green"
        slideGroup="tour"
      >
        <p>
          As with flood depths, economic and structure damage can be reduced
          through the implementation of master plan projects. Reduction in both
          the cost (billions of dollars) and number (thousands) of structures
          damaged during storm events is a significant benefit of the 2023
          Coastal Master Plan.
        </p>
        <p>
          Change the <strong>plan implementation scenario</strong> to see the
          impact of investment in the coast. Change the{" "}
          <strong>damage metric</strong> and use the <strong>year</strong>{" "}
          slider to see how the master plan changes damage values into the
          future.
        </p>
      </Slide>
      <Slide viewName="slide-9" color="green" slideGroup="tour">
        <p>
          The future coast of Louisiana is going to be experienced differently
          than today&apos;s coast. The 2023 Coastal Master Plan presents a
          vision for a future coast that can support people living, working, and
          playing in Louisiana into the future while adapting to the changing
          landscape through the implementation of the 73 restoration and risk
          reduction projects selected for the plan.
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
            Explore the Plan
          </ActionButton>
        </p>
      </Slide>
      {project.value ? (
        <Slide title="Project Details" color="green" overlay={true}>
          <ProjectDetail />
        </Slide>
      ) : null}
      {selection.value && selection.value.community ? (
        <Slide
          title={selection.value.community.display_name}
          overlay={true}
          controls={["scenario", "damage"]}
          additionalControls={
            <>
              <div class="input">
                <label class="label">
                  <Tooltip
                    content="Damage data is presented for spatial units across the coast.
                Each unit represents a portion of a coastal Parish. For damage
                information at the Parish level, please see the Parish Fact Sheets in Attachment F3."
                  />{" "}
                  CLARA Community
                  <span class="value">
                    : {selection.value.community.community_id}
                  </span>
                </label>
              </div>
              <ActionButton
                action={() =>
                  window.open(
                    `${factSheetBaseUrl}MP2023_datasheet_community_${selection.value.community.community_id}.pdf`,
                    "_blank"
                  )
                }
              >
                Community Datasheet (PDF)
              </ActionButton>
            </>
          }
        >
          <CommunityDetail />
        </Slide>
      ) : null}
    </Slides>
  );
};

export default Slideshow;
