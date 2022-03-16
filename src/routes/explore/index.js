import { h } from 'preact';
import style from './style.css';

import Drawer from '../../components/drawer';
import Slide from '../../components/slide';
import Slides from '../../components/slides';

const Explore = (props) => (
    <Drawer title="Introduction" open={true}>
        <Slides slideId={props.slideId} path={props.path}>
            <Slide id="planning" title="Planning for the Future">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus varius felis sed sodales sodales. Vestibulum fermentum malesuada gravida. Vestibulum porta neque ac est blandit suscipit. Suspendisse porttitor at risus et iaculis. Maecenas felis nunc, lobortis quis fringilla vel, auctor in nibh. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Ut ut nunc tortor. Duis vel tincidunt lorem. Sed condimentum elit sed turpis euismod euismod. Aliquam quis pretium lorem. 
                </p>
            </Slide>
            <Slide id="protecting" title="Protecting the Gulf">
                <p>
                Pellentesque dapibus odio ut posuere facilisis. Vivamus ac egestas ipsum. Fusce maximus accumsan purus, id sagittis sem sagittis ut. Nulla iaculis ante eu lorem porta blandit sed ac metus. Phasellus nec tellus nec dui faucibus iaculis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus vehicula tincidunt ultrices. Cras iaculis lacus eget magna cursus malesuada. In consectetur scelerisque mi, at sagittis odio ullamcorper at. Nulla suscipit gravida suscipit. Aenean quis accumsan justo, non consectetur nisl. 
                </p>
            </Slide>
        </Slides>
    </Drawer>
);

export default Explore;
