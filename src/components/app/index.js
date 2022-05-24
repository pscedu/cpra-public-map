import { h } from "preact";
import { useState } from "preact/hooks";
import { Router } from "preact-router";

import * as config from "./config";
import { useLayers, useProjects, useSearchIndex, useServices } from "./hooks";

import Header from "../header";
import Legend from "../legend";
import Map from "../map";
import Toolbar from "../toolbar";
import Watermark from "../watermark";
import Explore from "../../routes/explore";

const App = () => {
  const projects = useProjects(config.projectListUrl);
  const searchIndex = useSearchIndex(projects);
  const services = useServices(config.servicesUrl);
  const layers = useLayers(services);
  const [selection, setSelection] = useState({});
  const [mapState, setMapState] = useState({
    environment: "S08",
    layer: null,
    plan: "G500",
    politicalBoundary: null,
    prevYear: null,
    subtype: null,
    year: "50",
  });

  return (
    <div id="app">
      <Header
        geocodeUrl={config.geocodeUrl}
        setSelection={setSelection}
        searchIndex={searchIndex}
      />
      <Legend legends={config.legends} mapState={mapState} />
      <Toolbar />
      <Watermark>DRAFT</Watermark>
      <Map
        {...{
          projects,
          servicesUrl: config.servicesUrl,
          services,
          mapState,
          selection,
          setMapState,
        }}
      />
      <Router>
        <Explore
          path="/:slideId?"
          projects={projects}
          projectTypeDescriptions={config.projectTypeDescriptions}
          projectTypes={config.projectTypes}
          selection={selection}
          mapState={mapState}
          layers={layers}
          setMapState={setMapState}
        />
      </Router>
    </div>
  );
};

export default App;
