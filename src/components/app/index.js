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

const App = () => {
  const { printing } = useContext(State);

  return (
    <div id="app" class={style.app}>
      <div class={style.row}>
        <div class={style.main}>
          <Header />
          <Print>
            <Map />
          </Print>
          {printing.value ? null : <Slideshow />}
        </div>
        <Toolbar />
      </div>
      <Intro />
    </div>
  );
};

export default App;
