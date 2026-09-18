import { useMemo } from 'react';
import * as shared from '@safety-net/shared';
import { MapPin } from '../components/Map';

export function usePoliceStationPins(): MapPin[] {
	return useMemo(() => (typeof shared.policeStationPins === 'function' ? shared.policeStationPins() : []), []);
}

export function useFireStationPins(): MapPin[] {
	return useMemo(() => (typeof shared.fireStationPins === 'function' ? shared.fireStationPins() : []), []);
}
