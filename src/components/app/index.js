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

  return (
    <div id="app" class={style.app}>
      <div class={style.row}>
        <div class={style.main}>
          <Header />
          <Print>
            <Map />
          </Print>
          {state.printing.value ? null : <Slideshow />}
          {state.printing.value ? null : <Watermark>DRAFT</Watermark>}
        </div>
        <Toolbar />
      </div>
      <Intro />
    </div>
  );
};

export default App;
