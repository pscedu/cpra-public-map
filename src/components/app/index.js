import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Router } from "preact-router";

import * as config from "./config";
import { useProjects, useSearchIndex, useServices } from "./hooks";

import Header from "../header";
import Layers from "../layers";
import Legend from "../legend";
import Map from "../map";
import Toolbar from "../toolbar";
import Watermark from "../watermark";
import Explore from "../../routes/explore";

const App = () => {
  const projects = useProjects(config.projectListUrl);
  const searchIndex = useSearchIndex(projects);
  const services = useServices(config.servicesUrl);
  const [selection, setSelection] = useState({});
  const [mapState, setMapState] = useState({
    modelLayer: null,
    politicalBoundary: null,
    prevYear: null,
    showProjects: true,
    subtype: null,
    year: "50",
  });

  useEffect(() => {
    window.addEventListener("mapUpdateState", (e) =>
      setMapState({ ...mapState, ...e.detail.updates })
    );
  }, []);

  return (
    <div id="app">
      <Header
        geocodeUrl={config.geocodeUrl}
        setSelection={setSelection}
        searchIndex={searchIndex}
      />
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
        />
      </Router>
    </div>
  );
};

export default App;
