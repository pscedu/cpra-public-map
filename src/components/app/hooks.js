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
			return {
				id: row[0].toLowerCase().replace(/\./g, ""),
				name: row[1],
				type: row[2],
				xmin: parseFloat(row[3]),
				ymin: parseFloat(row[4]),
				xmax: parseFloat(row[5]),
				ymax: parseFloat(row[6])
			};
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
