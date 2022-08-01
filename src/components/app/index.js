import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { fireEvent, gtag, internal } from "../../utils";

import * as config from "./config";
import {
  useHashState,
  useLayers,
  useProjects,
  useSearchIndex,
  useServices,
} from "./hooks";

import Drawer from "../drawer";
import Explore from "../explore";
import Header from "../header";
import Intro from "../intro";
import Legend from "../legend";
import Map from "../map";
import Print from "../print";
import Story from "../story";
import Toolbar from "../toolbar";
import Watermark from "../watermark";

const App = () => {
  const baseUrl = window.location.href.replace(window.location.hash, "");
  const projects = useProjects(config.projectListUrl);
  const projectMap = {};
  projects.forEach((proj) => (projectMap[proj.name] = proj));

  const searchIndex = useSearchIndex(projects);
  const services = useServices(config.servicesUrl);
  const layers = useLayers(services);
  const [selection, setSelection] = useState({});
  const [map, setMap] = useState(null);
  const [mapState, updateMapStateHash] = useHashState(
    {
      scenario: "S07",
      view: "slide-0",
      group: "G500",
      politicalBoundary: null,
      prevYear: null,
      subtype: null,
      year: "50",
    },
    ["prevYear"]
  );
  const [printing, setPrinting] = useState(false);

  // Send initial analytics configuration.
  useEffect(() => {
    gtag("js", new Date());
    gtag("config", "G-B9C4QG8HKV", {
      debug_mode: internal,
      send_page_view: false,
      traffic_type: internal ? "internal" : "external",
    });
    gtag("set", "page_location", `${baseUrl}#view=${mapState.view}`);
    gtag("set", "page_title", config.views[mapState.view].title);
    gtag("event", "page_view");
  }, []);

  // Generate an analytics page view when the view changes.
  const updateMapState = (updates) => {
    if (updates.view && updates.view != mapState.view) {
      gtag("set", "page_location", `${baseUrl}#view=${updates.view}`);
      gtag("set", "page_title", config.views[updates.view].title);
      gtag("event", "page_view");
      if (updates.view === "slide-5") gtag("event", "tutorial_complete");
    }
    updateMapStateHash(updates);
  };

  const layer = config.views[mapState.view].layer;
  const storySlide = mapState.view.startsWith("slide-")
    ? parseInt(mapState.view.replace("slide-", ""), 10)
    : null;
  const setStorySlide = (idx) => {
    updateMapState({ view: idx === null ? "land-change" : `slide-${idx}` });
  };

  const startTour = () => {
    fireEvent("searchClearResult");
    fireEvent("mapFitBounds", {
      bounds: config.mapDefaults.bounds,
      options: {
        padding: config.mapDefaults.padding,
      },
    });
    setStorySlide(0);
    gtag("event", "tutorial_begin");
  };
  const endTour = () => setStorySlide(null);

  let drawerContent;
  if (mapState.view === "intro") {
    drawerContent = <Intro endTour={endTour} startTour={startTour} />;
  } else if (storySlide == null) {
    drawerContent = (
      <Explore
        layer={layer}
        projectMap={projectMap}
        projects={projects}
        projectTypeDescriptions={config.projectTypeDescriptions}
        projectTypes={config.projectTypes}
        selection={selection}
        mapState={mapState}
        layers={layers}
        updateMapState={updateMapState}
      />
    );
  } else {
    drawerContent = (
      <Story
        layer={layer}
        layers={layers}
        projectMap={projectMap}
        mapState={mapState}
        slide={storySlide === null ? storySlide : parseInt(storySlide, 10)}
        setSlide={setStorySlide}
        updateMapState={updateMapState}
      />
    );
  }

  const drawerTitle = config.views[mapState.view].title;

  return (
    <div id="app">
      <Header
        endTour={endTour}
        geocodeUrl={config.geocodeUrl}
        searchIndex={searchIndex}
        setSelection={setSelection}
        startTour={startTour}
        storySlide={storySlide}
        printing={printing}
      />
      <Toolbar
        contactEmail={config.contactEmail}
        printing={printing}
        setPrinting={setPrinting}
        updateMapState={updateMapState}
        websiteUrl={config.websiteUrl}
      />
      {printing ? null : <Watermark>DRAFT</Watermark>}
      <Print
        layer={layer}
        map={map}
        mapState={mapState}
        printing={printing}
        printText={config.printText}
        setPrinting={setPrinting}
      >
        {printing ? null : <Legend legends={config.legends} layer={layer} />}
        <Map
          {...{
            layer,
            mapDefaults: config.mapDefaults,
            map,
            mapState,
            projects,
            selection,
            services,
            servicesUrl: config.servicesUrl,
            setMap,
            updateMapState,
          }}
        />
      </Print>
      {!printing ? (
        <Drawer title={drawerTitle} open={true}>
          {drawerContent}
        </Drawer>
      ) : null}
    </div>
  );
};

export default App;
