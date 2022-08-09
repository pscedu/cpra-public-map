import { h } from "preact";
import style from "./style.css";

function arrow(targetIdx, slides, setCurrentIdx, cssClass, content) {
  const target = slides[targetIdx];
  const hasTarget = target !== undefined;

  return (
    <button
      class={`${style.arrow} ${cssClass} ${
        hasTarget ? style.enabled : style.disabled
      }`}
      onClick={hasTarget ? () => setCurrentIdx(targetIdx) : null}
    >
      <span class="sr-only">{hasTarget ? target.props.title : null}</span>
      {content}
    </button>
  );
}

const SlideNavigation = ({
  currentIdx,
  navigationType,
  setCurrentIdx,
  slides,
}) => {
  const navContent = [];
  if (navigationType === "arrows") {
    const next = currentIdx + 1;
    const prev = currentIdx - 1;
    navContent.push(
      arrow(prev, slides, setCurrentIdx, style.prev, <span>&#8249;</span>)
    );
    navContent.push(
      arrow(next, slides, setCurrentIdx, style.next, <span>&#8250;</span>)
    );
  } else {
    const navItems = slides.map((slide, i) => (
      <li
        key={slide.props.id}
        class={currentIdx == i ? style.active : style.inactive}
      >
        <button onClick={() => setCurrentIdx(i)}>
          {slide.props.icon ? <ion-icon name={slide.props.icon} /> : null}
          <span class={style.inner}>
            {slide.props.tabTitle || slide.props.title}
          </span>
        </button>
      </li>
    ));
    navContent.push(
      <nav>
        <ul>{navItems}</ul>
      </nav>
    );
  }

  return (
    <div
      class={`${style["slide-navigation"]} ${
        style["nav-type-" + navigationType]
      }`}
    >
      {navContent}
    </div>
  );
};

export default SlideNavigation;
