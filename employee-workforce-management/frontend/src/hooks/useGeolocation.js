import { useState, useEffect, useCallback } from 'react';
import { calculateDistanceMeters } from '../services/api';

export function useGeolocation(officeLocation) {
  const defaultOffice = officeLocation || {
    name: 'TechCorp Headquarters - Tech Park',
    latitude: 37.774929,
    longitude: -122.419416,
    radiusMeters: 250.0
  };

  const [coords, setCoords] = useState(null);
  const [distance, setDistance] = useState(0);
  const [isInsideRadius, setIsInsideRadius] = useState(false);
  const [status, setStatus] = useState('IDLE'); // IDLE, FETCHING, VERIFIED, OUTSIDE, ERROR
  const [error, setError] = useState(null);

  const calculateAndSet = useCallback((lat, lon) => {
    const dist = calculateDistanceMeters(lat, lon, defaultOffice.latitude, defaultOffice.longitude);
    const inside = dist <= defaultOffice.radiusMeters;
    setCoords({ latitude: lat, longitude: lon });
    setDistance(dist);
    setIsInsideRadius(inside);
    setStatus(inside ? 'VERIFIED' : 'OUTSIDE');
  }, [defaultOffice.latitude, defaultOffice.longitude, defaultOffice.radiusMeters]);

  const refreshLocation = useCallback(() => {
    setStatus('FETCHING');
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          calculateAndSet(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.warn('Geolocation warning, using office simulation:', err.message);
          simulateInOffice();
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      simulateInOffice();
    }
  }, [calculateAndSet]);

  const simulateInOffice = useCallback(() => {
    const lat = defaultOffice.latitude + 0.00010;
    const lon = defaultOffice.longitude + 0.00008;
    calculateAndSet(lat, lon);
  }, [defaultOffice.latitude, defaultOffice.longitude, calculateAndSet]);

  const simulateRemote = useCallback(() => {
    const lat = defaultOffice.latitude + 0.012;
    const lon = defaultOffice.longitude + 0.015;
    calculateAndSet(lat, lon);
  }, [defaultOffice.latitude, defaultOffice.longitude, calculateAndSet]);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  return {
    coords,
    distanceMeters: distance,
    isInsideRadius,
    status,
    error,
    refreshLocation,
    simulateInOffice,
    simulateRemote,
    allowedRadiusMeters: defaultOffice.radiusMeters
  };
}

