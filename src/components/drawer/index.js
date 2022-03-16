import { h } from 'preact';
import { useState } from 'preact/hooks';
import style from './style.css';

const Drawer = (props) => {
    const [open, setOpen] = useState(props.open || false);
    const actionText = (open) ? "Close" : "Open";
    const toggleOpen = () => setOpen(!open);
    return (
        <div class={`${style.drawer} ${style[(open) ? "open": "closed"]}`}>
            <button class={style.handle}
                    onClick={toggleOpen}>
                <span class="sr-only">{actionText}</span> {props.title}
            </button>
            {(open) ? <div class={style.body}>{props.children}</div> : null}
        </div>
    );
};

export default Drawer;
