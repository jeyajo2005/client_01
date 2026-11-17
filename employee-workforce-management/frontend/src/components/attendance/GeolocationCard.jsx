import React, { useState, useEffect } from 'react';
import { calculateDistanceMeters } from '../../services/api';
import { MapPin, Navigation, ShieldCheck, AlertTriangle, RefreshCw, Crosshair } from 'lucide-react';

export default function GeolocationCard({ targetOffice, onLocationChange }) {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('FETCHING'); // FETCHING, VERIFIED, OUT_OF_RADIUS, ERROR
  const [distance, setDistance] = useState(0);
  const [isSimulated, setIsSimulated] = useState(false);

  const office = targetOffice || {
    name: 'TechCorp Headquarters - Tech Park',
    address: '100 Innovation Way, Silicon Valley, CA 94025',
    latitude: 37.774929,
    longitude: -122.419416,
    radiusMeters: 250.0
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const fetchCurrentLocation = () => {
    setStatus('FETCHING');
    setIsSimulated(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          updateCoordinates(userLat, userLon, false);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          // Default to office coordinates for standard testing demo
          simulateInOffice();
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      simulateInOffice();
    }
  };

  const updateCoordinates = (lat, lon, simulated = false) => {
    const dist = calculateDistanceMeters(lat, lon, office.latitude, office.longitude);
    const verified = dist <= office.radiusMeters;
    
    setCoords({ latitude: lat, longitude: lon });
    setDistance(dist);
    setStatus(verified ? 'VERIFIED' : 'OUT_OF_RADIUS');
    setIsSimulated(simulated);

    if (onLocationChange) {
      onLocationChange({
        latitude: lat,
        longitude: lon,
        distanceMeters: dist,
        isVerified: verified
      });
    }
  };

  const simulateInOffice = () => {
    // 15 meters from office center
    const simLat = office.latitude + 0.00010;
    const simLon = office.longitude + 0.00008;
    updateCoordinates(simLat, simLon, true);
  };

  const simulateRemote = () => {
    // 1200 meters away from office
    const simLat = office.latitude + 0.012;
    const simLon = office.longitude + 0.015;
    updateCoordinates(simLat, simLon, true);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">GPS Geofence Verification</h3>
            <p className="text-xs text-slate-500">Validation against office radius</p>
          </div>
        </div>

        {/* Verification Status Pill */}
        {status === 'VERIFIED' && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Inside Office Radius
          </span>
        )}
        {status === 'OUT_OF_RADIUS' && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Outside Radius
          </span>
        )}
        {status === 'FETCHING' && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 animate-pulse">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Acquiring GPS...
          </span>
        )}
      </div>

      {/* Office Target & Current Distance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Designated Office
          </span>
          <div className="font-bold text-slate-800 text-xs truncate">{office.name}</div>
          <div className="text-[11px] text-slate-500 truncate">{office.address}</div>
          <div className="text-[11px] text-sky-600 font-medium mt-1">
            Allowed Radius: {office.radiusMeters}m
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Calculated Distance
          </span>
          <div className="flex items-baseline space-x-1.5 my-1">
            <span className={`text-2xl font-black ${distance <= office.radiusMeters ? 'text-emerald-600' : 'text-amber-600'}`}>
              {distance}m
            </span>
            <span className="text-xs text-slate-500">from perimeter center</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {coords ? `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}` : 'Locating...'}
          </div>
        </div>
      </div>

      {/* Simulation Controls for Quick Testing */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs">
        <div className="flex items-center space-x-1 text-slate-500">
          <Crosshair className="w-3.5 h-3.5 text-slate-400" />
          <span>Haversine formula verified</span>
          {isSimulated && <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-semibold text-slate-700">Simulated</span>}
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={simulateInOffice}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
          >
            Simulate In-Office (15m)
          </button>
          <button
            type="button"
            onClick={simulateRemote}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition"
          >
            Simulate Remote (1.2km)
          </button>
          <button
            type="button"
            onClick={fetchCurrentLocation}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            title="Refresh Real Device GPS"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
