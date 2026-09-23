import { useEffect, useState } from 'react';
import { listPublicListings } from '@safety-net/shared';
import { MapPin } from '../components/Map';

export function usePublicListingPins(): { pins: MapPin[]; ready: boolean } {
	const [pins, setPins] = useState<MapPin[]>([]);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		listPublicListings()
			.then((listings: any[]) => {
				setPins(
					listings
						.filter(listing => listing.location && listing.location.lat != null && listing.location.lng != null)
						.map(listing => ({
							id: listing.id,
							lat: listing.location.lat,
							lng: listing.location.lng,
							title: listing.title,
						}))
				);
			})
			.catch(err => console.log(err))
			.finally(() => setReady(true));
	}, []);

	return { pins, ready };
}

export default function useListingPins(): MapPin[] {
	return usePublicListingPins().pins;
}
