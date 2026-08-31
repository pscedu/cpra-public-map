import { render } from "preact";
import "./style/index.css";
import ContextWrapper from "./components/context-wrapper";

render(<ContextWrapper />, document.getElementById("app"));
