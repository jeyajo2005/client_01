package com.workforce.service;

import com.workforce.entity.Company;
import com.workforce.entity.Location;
import com.workforce.exception.ResourceNotFoundException;
import com.workforce.repository.CompanyRepository;
import com.workforce.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public List<Location> getCompanyLocations(Long companyId) {
        return locationRepository.findByCompanyId(companyId);
    }

    public Location getLocationById(Long id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Office location not found with id: " + id));
    }

    @Transactional
    public Location createLocation(Long companyId, Location location) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));
        location.setCompany(company);
        return locationRepository.save(location);
    }

    @Transactional
    public Location updateLocation(Long id, Location updated) {
        Location existing = getLocationById(id);
        existing.setName(updated.getName());
        existing.setAddress(updated.getAddress());
        existing.setLatitude(updated.getLatitude());
        existing.setLongitude(updated.getLongitude());
        existing.setRadiusMeters(updated.getRadiusMeters());
        existing.setIsActive(updated.getIsActive());
        return locationRepository.save(existing);
    }
}
