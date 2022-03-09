import { useEffect, useState } from 'preact/hooks';


export function useServices(servicesUrl) {
    const [services, setServices] = useState(null);
	useEffect(async () => {
		let services = await fetch(servicesUrl);
        setServices(await services.json());
	}, []);
	return services;
}
