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
      <span class="sr-only">{hasTarget ? target.props.view.title : null}</span>
      {content}
    </button>
  );
}

const SlideNavigation = ({
  currentIdx,
  drawerOpen,
  navigationType,
  setCurrentIdx,
  setDrawerOpen,
  slides,
}) => {
  const navContent = [];
  const currentSlide = slides[currentIdx];
  if (navigationType === "arrows") {
    const next = currentIdx + 1;
    const prev = currentIdx - 1;
    navContent.push(
      <span class={style.current}>{currentSlide.props.view.title}</span>,
      arrow(
        prev,
        slides,
        setCurrentIdx,
        style.prev,
        <ion-icon name="chevron-back-outline" />
      ),
      arrow(
        next,
        slides,
        setCurrentIdx,
        style.next,
        <ion-icon name="chevron-forward-outline" />
      )
    );
  } else {
    const navItems = slides.map((slide, i) => (
      <li
        key={slide.props.id}
        class={`${currentIdx == i ? style.active : style.inactive} ${
          style[slide.props.tabClass] || "default"
        }`}
      >
        <button onClick={() => setCurrentIdx(i)}>
          {slide.props.icon ? <ion-icon name={slide.props.icon} /> : null}
          <span class={style.inner}>{slide.props.view.title}</span>
        </button>
      </li>
    ));
    navContent.push(<ul>{navItems}</ul>);
  }

  return (
    <nav
      class={`${style["slide-navigation"]} ${
        style["nav-type-" + navigationType]
      } ${
        style["nav-active-tab-" + (currentSlide.props.tabClass || "default")]
      }`}
    >
      {navContent}
      <button class={style.handle} onClick={() => setDrawerOpen(!drawerOpen)}>
        <ion-icon
          class={style["icon-lg"]}
          name={`chevron-${drawerOpen ? "down" : "up"}-outline`}
        />
        <ion-icon class={style["icon-md"]} src="/assets/buttons/legend.svg" />
        <span class="sr-only">{drawerOpen ? "Close" : "Open"}</span>
      </button>
    </nav>
  );
};

export default SlideNavigation;
