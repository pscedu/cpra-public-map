import { h } from 'preact';
import { useState } from 'preact/hooks';
import style from './style.css';


import SlideNavigation from '../slide-navigation';

const Slides = (props) => {
    const slides = props.children.filter(child =>
        child.type && child.type.name == "Slide");
    let currentSlide = slides[0];
    let currentIdx = 0;
    if (props.slideId) for (let slideIdx in slides) {
        let slide = slides[slideIdx];
        if (slide.props.id == props.slideId) {
            currentSlide = slide;
            currentIdx = parseInt(slideIdx);
            break;
        }
    }
    return (
        <div class={style.slides}>
            {currentSlide}
            {(slides.length > 1) ?
                <SlideNavigation
                    path={props.path}
                    current={currentSlide}
                    currentIdx={currentIdx}
                    prev={slides[currentIdx - 1]}
                    next={slides[currentIdx + 1]}
                    count={slides.length} /> : null}
        </div>
    );
};

export default Slides;
