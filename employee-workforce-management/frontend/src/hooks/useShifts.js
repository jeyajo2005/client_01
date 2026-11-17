import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useShifts(companyId = 1) {
  const [shifts, setShifts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchShifts = useCallback(async () => {
    setLoading(true);
    try {
      const s = await api.getShifts(companyId);
      setShifts(s || []);
      const r = await api.getShiftRequests(companyId);
      setRequests(r || []);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  return {
    shifts,
    requests,
    loading,
    refreshShifts: fetchShifts
  };
}

