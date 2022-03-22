import { useEffect, useState } from 'preact/hooks';

export function useProjectList(projectListUrl) {
    const [projectList, setProjectList] = useState([]);
	useEffect(async () => {
		let res = await fetch(projectListUrl);
		let rows = (await res.text()).split("\n")
			.filter((row) => row.length)
			.map((row) => row.split(","));
		let headers = rows.shift();

		let projectList = rows.map((row) => {
			let project = {};
			for (let i in headers) project[headers[i]] = row[i];
			return project;
		});
		
        setProjectList(projectList);
	}, []);
	return projectList;
}


export function useServices(servicesUrl) {
    const [services, setServices] = useState(null);
	useEffect(async () => {
		let services = await fetch(servicesUrl);
        setServices(await services.json());
	}, []);
	return services;
}
