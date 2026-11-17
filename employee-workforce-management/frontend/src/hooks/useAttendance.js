import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useAttendance(employeeId, companyId = 1) {
  const [history, setHistory] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAttendance = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    setError(null);
    try {
      const list = await api.getEmployeeAttendance(employeeId);
      setHistory(list || []);
      const todayStr = new Date().toISOString().split('T')[0];
      const today = list?.find(a => a.attendanceDate === todayStr);
      setTodayRecord(today || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const punchCheckIn = async (payload) => {
    const record = await api.checkIn(payload);
    setTodayRecord(record);
    fetchAttendance();
    return record;
  };

  const punchCheckOut = async (payload) => {
    const record = await api.checkOut(payload);
    setTodayRecord(record);
    fetchAttendance();
    return record;
  };

  return {
    history,
    todayRecord,
    loading,
    error,
    fetchAttendance,
    punchCheckIn,
    punchCheckOut
  };
}

