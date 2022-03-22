import { h } from 'preact';
import style from './style.css';

const ProjectDetail = (props) => {
    const project = props.project;
    const zoomToProject = () =>
        props.setProjectBbox([project.xmin, project.ymin, project.xmax, project.ymax]);
    return (
        <div class={style["project-detail"]}>
            <h3>Type of Project</h3>
            <p>{props.projectTypes[project.type]}</p>
            <button onClick={zoomToProject}>View on the Map</button>
        </div>
    );
};

export default ProjectDetail;
