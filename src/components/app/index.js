import { h } from "preact";
import style from "./style.css";
import { useContext } from "preact/hooks";
import { State } from "../../helpers/state";

import Header from "../header";
import Intro from "../intro";
import Map from "../map";
import Print from "../print";
import Slideshow from "../slideshow";
import Toolbar from "../toolbar";
import Watermark from "../watermark";

const App = () => {
  const state = useContext(State);
  // const baseUrl = window.location.href.replace(window.location.hash, "");
  // // Send initial analytics configuration.
  // useEffect(() => {
  //   gtag("js", new Date());
  //   gtag("config", "G-B9C4QG8HKV", {
  //     debug_mode: internal,
  //     send_page_view: false,
  //     traffic_type: internal ? "internal" : "external",
  //   });
  //   gtag("set", "page_location", `${baseUrl}#view=${mapState.view}`);
  //   gtag("set", "page_title", config.views[mapState.view].title);
  //   gtag("event", "page_view");
  // }, []);

  // // Generate an analytics page view when the view changes.
  // const updateMapState = (updates) => {
  //   if (updates.view && updates.view != mapState.view) {
  //     gtag("set", "page_location", `${baseUrl}#view=${updates.view}`);
  //     gtag("set", "page_title", config.views[updates.view].title);
  //     gtag("event", "page_view");
  //     if (updates.view === "slide-5") gtag("event", "tutorial_complete");
  //   }
  //   updateMapStateHash(updates);
  // };

  return (
    <div id="app" class={style.app}>
      <Header />
      <Toolbar />
      {state.printing.value ? null : <Watermark>DRAFT</Watermark>}
      <Print>
        <Map />
      </Print>
      <Intro />
      {state.printing.value ? null : <Slideshow />}
    </div>
  );
};

export default App;
