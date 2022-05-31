import { h } from "preact";
import { useState } from "preact/hooks";

import * as config from "./config";
import {
  useHashState,
  useLayers,
  useProjects,
  useSearchIndex,
  useServices,
} from "./hooks";

import Explore from "../explore";
import Header from "../header";
import Legend from "../legend";
import Map from "../map";
import Toolbar from "../toolbar";
import Watermark from "../watermark";

const App = () => {
  const projects = useProjects(config.projectListUrl);
  const searchIndex = useSearchIndex(projects);
  const services = useServices(config.servicesUrl);
  const layers = useLayers(services);
  const [selection, setSelection] = useState({});
  const [mapState, updateMapState] = useHashState(
    {
      environment: "S08",
      layer: "Land Change",
      plan: "G500",
      politicalBoundary: null,
      prevYear: null,
      subtype: null,
      year: "50",
    },
    ["prevYear"]
  );

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
          updateMapState,
        }}
      />
      <Explore
        path="/:slideId?"
        projects={projects}
        projectTypeDescriptions={config.projectTypeDescriptions}
        projectTypes={config.projectTypes}
        selection={selection}
        mapState={mapState}
        layers={layers}
        updateMapState={updateMapState}
      />
    </div>
  );
};

export default App;
