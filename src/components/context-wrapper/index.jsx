import { createState, State } from "../../helpers/state";

import App from "../app";

const ContextWrapper = () => (
  <State.Provider value={createState()}>
    <App />
  </State.Provider>
);

export default ContextWrapper;
