import { h } from 'preact';
import style from './style.css';


function getLink(path, id, hash="") {
    let link = path.split(":slideId")[0] + id;
    if (!id.includes("#")) link += hash;
    return link;
}

const SlideNavigation = (props) => {
    const currentStr = (props.currentIdx + 1).toString().padStart(2, "0");
    const totalStr = props.count.toString().padStart(2, "0");
    const hasPrev = props.prev !== undefined;
    const hasNext = props.next !== undefined;
    const prevLink = (hasPrev && props.currentIdx > 1) ?
        getLink(props.path, props.prev.props.id) :
        getLink(props.path, "");
    const nextLink = (hasNext) ?
        getLink(props.path, props.next.props.id) :
        window.location.pathname;
    return (
        <div class={style["slide-navigation"]}>
            <a class={`${style.bubble} ${(hasPrev) ? style.enabled : style.disabled}`}
                    href={prevLink}>
                &#171;
                <span class="sr-only">
                    {(hasPrev) ? props.prev.props.title : null}
                </span>
            </a>
            <span class={style.bubble}>
                <span class="sr-only">Slide</span>
                {currentStr}/{totalStr}
            </span>
            <a class={`${style.bubble} ${(hasNext) ? style.enabled : style.disabled}`}
                    href={nextLink}>
                <span class="sr-only">
                    {(hasNext) ? props.next.props.title : null}
                </span>
                &#187;
            </a>
        </div>
    );
};

export default SlideNavigation;