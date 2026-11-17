package com.workforce.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryResponse {

    private long totalEmployees;
    private long presentToday;
    private long absentToday;
    private long lateEmployees;
    private long employeesOnBreak;
    private long activeShifts;
    private double attendancePercentage;
    private List<Map<String, Object>> recentCheckIns;
    private List<Map<String, Object>> departmentStats;
    private Map<String, Object> todayDressCode;

    public DashboardSummaryResponse() {}

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getPresentToday() { return presentToday; }
    public void setPresentToday(long presentToday) { this.presentToday = presentToday; }

    public long getAbsentToday() { return absentToday; }
    public void setAbsentToday(long absentToday) { this.absentToday = absentToday; }

    public long getLateEmployees() { return lateEmployees; }
    public void setLateEmployees(long lateEmployees) { this.lateEmployees = lateEmployees; }

    public long getEmployeesOnBreak() { return employeesOnBreak; }
    public void setEmployeesOnBreak(long employeesOnBreak) { this.employeesOnBreak = employeesOnBreak; }

    public long getActiveShifts() { return activeShifts; }
    public void setActiveShifts(long activeShifts) { this.activeShifts = activeShifts; }

    public double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(double attendancePercentage) { this.attendancePercentage = attendancePercentage; }

    public List<Map<String, Object>> getRecentCheckIns() { return recentCheckIns; }
    public void setRecentCheckIns(List<Map<String, Object>> recentCheckIns) { this.recentCheckIns = recentCheckIns; }

    public List<Map<String, Object>> getDepartmentStats() { return departmentStats; }
    public void setDepartmentStats(List<Map<String, Object>> departmentStats) { this.departmentStats = departmentStats; }

    public Map<String, Object> getTodayDressCode() { return todayDressCode; }
    public void setTodayDressCode(Map<String, Object> todayDressCode) { this.todayDressCode = todayDressCode; }
}
