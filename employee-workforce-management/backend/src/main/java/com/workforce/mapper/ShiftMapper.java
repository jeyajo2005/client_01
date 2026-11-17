package com.workforce.mapper;

import com.workforce.entity.Shift;
import com.workforce.entity.ShiftChangeRequest;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ShiftMapper {

    public Map<String, Object> toDto(Shift shift) {
        if (shift == null) return null;

        Map<String, Object> map = new HashMap<>();
        map.put("id", shift.getId());
        map.put("companyId", shift.getCompany() != null ? shift.getCompany().getId() : null);
        map.put("name", shift.getName());
        map.put("shiftType", shift.getShiftType());
        map.put("startTime", shift.getStartTime() != null ? shift.getStartTime().toString() : null);
        map.put("endTime", shift.getEndTime() != null ? shift.getEndTime().toString() : null);
        map.put("gracePeriodMinutes", shift.getGracePeriodMinutes());
        map.put("colorCode", shift.getColorCode());
        map.put("isActive", shift.getIsActive());

        return map;
    }

    public Map<String, Object> toRequestDto(ShiftChangeRequest req) {
        if (req == null) return null;

        Map<String, Object> map = new HashMap<>();
        map.put("id", req.getId());
        map.put("companyId", req.getCompany() != null ? req.getCompany().getId() : null);
        map.put("employeeId", req.getEmployee() != null ? req.getEmployee().getId() : null);
        map.put("employeeName", req.getEmployee() != null && req.getEmployee().getUser() != null
                ? req.getEmployee().getUser().getFullName() : null);
        map.put("currentShift", req.getCurrentShift() != null ? req.getCurrentShift().getName() : null);
        map.put("requestedShift", req.getRequestedShift() != null ? req.getRequestedShift().getName() : null);
        map.put("effectiveDate", req.getEffectiveDate() != null ? req.getEffectiveDate().toString() : null);
        map.put("reason", req.getReason());
        map.put("status", req.getStatus());

        return map;
    }
}

