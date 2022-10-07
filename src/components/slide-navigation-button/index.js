import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../../helpers/state";
import { views } from "../../helpers/config";

const SlideNavigationButton = ({
  action = null,
  children,
  cssClass,
  label,
  targetSlide,
}) => {
  const { viewName } = useContext(State);
  const handleClick = action
    ? action
    : () => (viewName.value = targetSlide.props.viewName);
  return (
    <button
      aria-label={label || views[targetSlide.props.viewName].title}
      class={cssClass}
      disabled={!targetSlide && !action}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default SlideNavigationButton;
