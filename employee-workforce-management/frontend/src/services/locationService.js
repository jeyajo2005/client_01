import { api, calculateDistanceMeters } from './api';

export const locationService = {
  async getLocations(companyId = 1) {
    return api.getLocations(companyId);
  },

  async createLocation(payload) {
    return api.createLocation(payload);
  },

  calculateDistance(lat1, lon1, lat2, lon2) {
    return calculateDistanceMeters(lat1, lon1, lat2, lon2);
  },

  isInsideGeofence(userLat, userLng, officeLat, officeLng, radiusMeters = 250) {
    const dist = calculateDistanceMeters(userLat, userLng, officeLat, officeLng);
    return dist <= radiusMeters;
  }
};

export default locationService;

