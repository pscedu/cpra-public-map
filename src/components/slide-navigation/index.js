import { h } from "preact";
import style from "./style.css";

function arrow(path, target, defaultLink, next) {
  const hasTarget = target !== undefined;
  const cssClass = next ? style.next : style.prev;
  const content = next ? <span>&#187;</span> : <span>&#171;</span>;
  return (
    <a
      class={`${style.arrow} ${cssClass} ${style.bubble} ${
        hasTarget ? style.enabled : style.disabled
      }`}
      href={hasTarget ? getLink(path, target.props.id) : defaultLink}
    >
      <span class="sr-only">{hasTarget ? target.props.title : null}</span>
      {content}
    </a>
  );
}

function getLink(path, id, hash = "") {
  let link = path.split(":slideId")[0] + id;
  if (!id.includes("#")) link += hash;
  return link;
}

const SlideNavigation = ({
  arrows,
  currentIdx,
  navigationType,
  path,
  slides,
}) => {
  const arrowLinks = [];
  if (arrows) {
    const next = slides[currentIdx + 1];
    const prev = slides[currentIdx - 1];
    arrowLinks.push(arrow(path, prev, getLink(path, "")));
    arrowLinks.push(arrow(path, next, window.location.pathname, true));
  }

  const navItems = slides.map((slide, i) => (
    <li
      key={slide.props.id}
      class={currentIdx == i ? style.active : style.inactive}
    >
      <a href={getLink(path, slide.props.id)}>
        {slide.props.icon ? <ion-icon name={slide.props.icon} /> : null}
        <span class="inner">{slide.props.tabTitle || slide.props.title}</span>
      </a>
    </li>
  ));

  return (
    <div
      class={`${style["slide-navigation"]} ${
        style["nav-type-" + navigationType]
      }`}
    >
      {arrowLinks}
      <nav>
        <ul>{navItems}</ul>
      </nav>
    </div>
  );
};

export default SlideNavigation;
