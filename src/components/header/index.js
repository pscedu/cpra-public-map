import { h } from "preact";
import style from "./style.css";

import Search from "../search";

const Header = ({ geocodeUrl, searchIndex, updateMapState }) => (
  <header class={style.header}>
    <a href="https://coastal.la.gov/" class={style.logo}>
      <img src="/assets/images/logo.png" alt="CPRA" />
    </a>
    <h1>
      <span class={style.title}>Louisiana's Coastal</span>
      <span class={style.title}>Master Plan 2023</span>
      {/* <span class={style.subtitle}>
        DataViewer <span class={style.preview}>Preview</span>
      </span> */}
    </h1>
    <nav>
      <a class={style.active} href="/">
        Explore
      </a>
    </nav>
    <Search
      geocodeUrl={geocodeUrl}
      searchIndex={searchIndex}
      updateMapState={updateMapState}
    />
  </header>
);

export default Header;
