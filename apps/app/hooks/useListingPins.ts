import { useEffect, useState } from 'react';
import { listPublicListings } from '@safety-net/shared';
import { MapPin } from '../components/Map';

export default function useListingPins(): MapPin[] {
	const [pins, setPins] = useState<MapPin[]>([]);

	useEffect(() => {
		listPublicListings()
			.then((listings: any[]) => {
				setPins(
					listings
						.filter(listing => listing.location && listing.location.lat != null && listing.location.lng != null)
						.map(listing => ({
							lat: listing.location.lat,
							lng: listing.location.lng,
							title: listing.title,
						}))
				);
			})
			.catch(err => console.log(err));
	}, []);

	return pins;
}
