import { GetRefugiosLocationsUseCase } from '@features/map/application/use-cases/GetRefugiosLocationsUseCase';
import { SupabaseMapRepository } from '@features/map/infrastructure/repositories/SupabaseMapRepository';
import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

const repo        = new SupabaseMapRepository();
const getUseCase  = new GetRefugiosLocationsUseCase(repo);

export interface UserLocation {
  lat: number;
  lng: number;
}

export function useMap() {
  const [userLocation, setUserLocation]     = useState<UserLocation | null>(null);
  const [locationError, setLocationError]   = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const { data: refugios = [], isLoading: refugiosLoading } = useQuery({
    queryKey: ['refugios-map'],
    queryFn:  () => getUseCase.execute(),
  });

  useEffect(() => {
    async function getUserLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permiso de ubicación denegado');
          setLocationLoading(false);
          return;
        }
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      } catch (e: any) {
        setLocationError(e.message);
      } finally {
        setLocationLoading(false);
      }
    }

    getUserLocation();
  }, []);

  return {
    refugios,
    userLocation,
    locationError,
    isLoading: refugiosLoading || locationLoading,
  };
}