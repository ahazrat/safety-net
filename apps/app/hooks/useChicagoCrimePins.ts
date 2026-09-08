import { useEffect, useState } from 'react';
import { fetchChicagoCrimeAreas } from '@safety-net/shared';
import { MapPin } from '../components/Map';

export default function useChicagoCrimePins(): MapPin[] {
	const [pins, setPins] = useState<MapPin[]>([]);

	useEffect(() => {
		fetchChicagoCrimeAreas()
			.then(setPins)
			.catch(err => console.log(err));
	}, []);

	return pins;
}
