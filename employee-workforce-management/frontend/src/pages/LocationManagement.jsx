import React, { useState, useEffect } from 'react';
import { api, calculateDistanceMeters } from '../../src/services/api';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Plus,
  Navigation,
  ShieldCheck,
  Edit2,
  X,
  Crosshair,
  Building2,
  CheckCircle2
} from 'lucide-react';

export default function LocationManagement() {
  const { user, isEmployee } = useAuth();
  const [locations, setLocations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: 37.774929,
    longitude: -122.419416,
    radiusMeters: 200.0
  });

  // Simulator
  const [testLat, setTestLat] = useState(37.775010);
  const [testLon, setTestLon] = useState(-122.419350);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    loadLocations();
  }, [user]);

  const loadLocations = async () => {
    const list = await api.getLocations(user?.companyId || 1);
    setLocations(list || []);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createLocation(user?.companyId || 1, formData);
      setLocations([...locations, created]);
      setShowAddModal(false);
      setNotification({ type: 'success', text: `Office geofence '${formData.name}' created with ${formData.radiusMeters}m radius` });
    } catch (err) {
      setNotification({ type: 'error', text: err.message });
    }
  };

  const handleTestDistance = (loc) => {
    const dist = calculateDistanceMeters(testLat, testLon, loc.latitude, loc.longitude);
    setTestResult({
      officeName: loc.name,
      distance: dist,
      isVerified: dist <= loc.radiusMeters,
      allowedRadius: loc.radiusMeters
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Office Geofences & GPS Perimeters</h1>
          <p className="text-xs text-slate-500">Configure approved office physical locations and allowed attendance radii</p>
        </div>

        {!isEmployee && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primaryLight text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Office Geofence</span>
          </button>
        )}
      </div>

      {notification && (
        <div className="p-4 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between">
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)} className="underline ml-4">Close</button>
        </div>
      )}

      {/* OFFICE LOCATIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card hover:shadow-card-hover transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                  <Building2 className="w-5 h-5" />
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Active Geofence
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900">{loc.name}</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4 flex items-start">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0 mt-0.5" />
                <span>{loc.address}</span>
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500">Center Coordinates:</span>
                  <span className="font-mono font-bold text-slate-900">{Number(loc.latitude).toFixed(6)}, {Number(loc.longitude).toFixed(6)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500">Allowed Perimeter:</span>
                  <span className="font-bold text-sky-600">{loc.radiusMeters} meters</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleTestDistance(loc)}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center space-x-1"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Test Radius Calculation</span>
              </button>
              <span className="text-[11px] text-slate-400">Haversine</span>
            </div>
          </div>
        ))}
      </div>

      {/* GEOFENCE RADIUS SIMULATOR */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
        <div className="flex items-center space-x-2.5 mb-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Interactive Geofence Simulator</h3>
            <p className="text-xs text-slate-500">Verify the exact distance and verification logic for any GPS coordinate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Test Latitude</label>
            <input
              type="number"
              step="0.000001"
              value={testLat}
              onChange={(e) => setTestLat(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Test Longitude</label>
            <input
              type="number"
              step="0.000001"
              value={testLon}
              onChange={(e) => setTestLon(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => locations[0] && handleTestDistance(locations[0])}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Compute Haversine Distance
            </button>
          </div>
        </div>

        {testResult && (
          <div className={`p-4 rounded-xl text-xs border flex items-center justify-between ${
            testResult.isVerified
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}>
            <div>
              <span className="font-bold block text-sm">
                Distance to {testResult.officeName}: {testResult.distance} meters
              </span>
              <span className="text-slate-600 text-xs">
                Allowed radius threshold is {testResult.allowedRadius} meters.
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              testResult.isVerified ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
            }`}>
              {testResult.isVerified ? 'Within Radius (Valid)' : 'Outside Radius (Blocked)'}
            </span>
          </div>
        )}
      </div>

      {/* ADD OFFICE GEOFENCE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Add Office Geofence</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Office Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Austin Engineering Campus"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Physical Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 500 Congress Avenue, Austin, TX"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Radius (Meters)</label>
                <input
                  type="number"
                  min="50"
                  max="5000"
                  required
                  value={formData.radiusMeters}
                  onChange={(e) => setFormData({ ...formData, radiusMeters: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-brand-primary hover:bg-brand-primaryLight rounded-xl shadow"
                >
                  Save Geofence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
