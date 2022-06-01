import { h } from "preact";
import style from "./style.css";

function arrow(targetIdx, slides, setCurrentIdx, cssClass, content) {
  const target = slides[targetIdx];
  const hasTarget = target !== undefined;

  return (
    <button
      class={`${style.arrow} ${cssClass} ${style.bubble} ${
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
  arrows,
  currentIdx,
  navigationType,
  setCurrentIdx,
  slides,
}) => {
  const arrowButtons = [];
  if (arrows) {
    const next = currentIdx + 1;
    const prev = currentIdx - 1;
    arrowButtons.push(
      arrow(prev, slides, setCurrentIdx, style.prev, <span>&#171;</span>)
    );
    arrowButtons.push(
      arrow(next, slides, setCurrentIdx, style.next, <span>&#187;</span>)
    );
  }

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

  return (
    <div
      class={`${style["slide-navigation"]} ${
        style["nav-type-" + navigationType]
      }`}
    >
      {arrowButtons}
      <nav>
        <ul>{navItems}</ul>
      </nav>
    </div>
  );
};

export default SlideNavigation;
