import { h } from "preact";
import { useState } from "preact/hooks";
import { Router } from "preact-router";

import * as config from "./config";
import { useProjects, useServices } from "./hooks";

import Header from "../header";
import Layers from "../layers";
import Legend from "../legend";
import Map from "../map";
import Toolbar from "../toolbar";
import Watermark from "../watermark";
import Explore from "../../routes/explore";

const App = () => {
  const [projects, projectFilters, setProjectFilters] = useProjects(
    config.projectListUrl
  );
  const services = useServices(config.servicesUrl);
  const [mapState, setMapState] = useState({
    modelLayer: null,
    politicalBoundary: null,
    prevYear: null,
    searchPolygon: null,
    selectedProjectId: "",
    showProjects: true,
    subtype: null,
    year: "50",
  });
  const updateMapState = (updates) => setMapState({ ...mapState, ...updates });

  return (
    <div id="app">
      <Header geocodeUrl={config.geocodeUrl} updateMapState={updateMapState} />
      <Layers {...{ services, mapState, setMapState }} />
      <Legend legends={config.legends} mapState={mapState} />
      <Toolbar />
      <Watermark>DRAFT</Watermark>
      <Map
        {...{
          projects,
          servicesUrl: config.servicesUrl,
          services,
          mapState,
          setMapState,
        }}
      />
      <Router>
        <Explore
          mapState={mapState}
          path="/:slideId?/:projectId?"
          projects={projects}
          projectFilters={projectFilters}
          projectTypeDescriptions={config.projectTypeDescriptions}
          projectTypes={config.projectTypes}
          setMapState={setMapState}
          setProjectFilters={setProjectFilters}
        />
      </Router>
    </div>
  );
};

export default App;
