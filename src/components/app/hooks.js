import { useEffect, useState } from 'preact/hooks';


export function useLayers(servicesUrl) {
    const [layers, setLayers] = useState({});
	useEffect(async () => {
		let result = {"Projects": {
			name: "Candidate Projects",
			type: "projects",
			years: {}
		}};
		let services = await fetch(servicesUrl);
        (await services.json()).sort((a, b) => a.name < b.name).forEach((service) => {
			if (service.name.indexOf("Base Map") != -1) return;
			let [name, year] = service.name.split(' - ');
			if (!(name in result)) {
				result[name] = {
					name: name,
					type: "model",
					years: {}
				};
			}
			result[name].years[year] = service.url;
		});
		setLayers(result);
	}, []);
	return layers;
}
