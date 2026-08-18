package com.tripnest.service;

import com.tripnest.dto.*;
import com.tripnest.entity.*;
import com.tripnest.exception.BadRequestException;
import com.tripnest.exception.ForbiddenException;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final ItineraryRepository itineraryRepository;
    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final TripMemberRepository tripMemberRepository;
    private final ActivityRepository activityRepository;

    public TripService(TripRepository tripRepository,
                       ItineraryRepository itineraryRepository,
                       BudgetRepository budgetRepository,
                       ExpenseRepository expenseRepository,
                       TripMemberRepository tripMemberRepository,
                       ActivityRepository activityRepository) {
        this.tripRepository = tripRepository;
        this.itineraryRepository = itineraryRepository;
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
        this.tripMemberRepository = tripMemberRepository;
        this.activityRepository = activityRepository;
    }

    @Transactional
    public TripDTO createTrip(TripDTO dto, User user) {
        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }

        Trip trip = new Trip();
        trip.setTitle(dto.getTitle().trim());
        trip.setDescription(dto.getDescription());
        trip.setDestination(dto.getDestination().trim());
        trip.setCoverImageUrl(dto.getCoverImageUrl());
        trip.setStartDate(dto.getStartDate());
        trip.setEndDate(dto.getEndDate());
        trip.setTotalBudget(dto.getTotalBudget() != null ? dto.getTotalBudget() : 0.0);
        trip.setStatus(dto.getStatus() != null ? dto.getStatus() : Trip.TripStatus.PLANNED);
        trip.setVisibility(dto.getVisibility() != null ? dto.getVisibility() : Trip.TripVisibility.PRIVATE);
        trip.setOwner(user);

        Trip savedTrip = tripRepository.save(trip);

        // 1. Initialize Budget
        Budget budget = new Budget(savedTrip, savedTrip.getTotalBudget());
        budget.setCurrency("USD");
        budgetRepository.save(budget);

        // 2. Initialize Day-wise Itineraries based on start and end dates
        long daysBetween = ChronoUnit.DAYS.between(savedTrip.getStartDate(), savedTrip.getEndDate()) + 1;
        for (int i = 1; i <= daysBetween; i++) {
            LocalDate dayDate = savedTrip.getStartDate().plusDays(i - 1);
            Itinerary itinerary = new Itinerary(
                    savedTrip,
                    i,
                    dayDate,
                    "Day " + i + " — " + savedTrip.getDestination(),
                    "Plan your activities and sightseeing for day " + i
            );
            itineraryRepository.save(itinerary);
        }

        // 3. Add owner as Group Admin Member
        TripMember ownerMember = new TripMember(
                savedTrip,
                user,
                TripMember.GroupRole.GROUP_ADMIN,
                TripMember.InviteStatus.ACCEPTED
        );
        tripMemberRepository.save(ownerMember);

        return getTripById(savedTrip.getId(), user);
    }

    @Transactional(readOnly = true)
    public List<TripDTO> getUserTrips(User user) {
        List<Trip> trips = tripRepository.findAllAccessibleByUser(user);
        return trips.stream()
                .map(t -> mapToDTO(t, false))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TripDTO getTripById(Long id, User user) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", id));

        // Check accessibility
        if (user != null && !isUserAuthorizedForTrip(trip, user)) {
            throw new ForbiddenException("You do not have access to view this trip");
        }

        return mapToDTO(trip, true);
    }

    @Transactional(readOnly = true)
    public TripDTO getTripByShareCode(String shareCode) {
        Trip trip = tripRepository.findByShareCode(shareCode)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with share code: " + shareCode));

        return mapToDTO(trip, true);
    }

    @Transactional
    public TripDTO updateTrip(Long id, TripDTO dto, User user) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", id));

        if (!trip.getOwner().getId().equals(user.getId()) && !isGroupAdmin(trip, user) && user.getRole() != Role.ROLE_ADMIN) {
            throw new ForbiddenException("Only trip owners, group admins, or platform admins can modify trip details");
        }

        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }

        trip.setTitle(dto.getTitle().trim());
        trip.setDescription(dto.getDescription());
        trip.setDestination(dto.getDestination().trim());
        if (dto.getCoverImageUrl() != null) trip.setCoverImageUrl(dto.getCoverImageUrl());
        trip.setStartDate(dto.getStartDate());
        trip.setEndDate(dto.getEndDate());
        if (dto.getTotalBudget() != null) {
            trip.setTotalBudget(dto.getTotalBudget());
            Budget budget = budgetRepository.findByTrip(trip).orElse(new Budget(trip, dto.getTotalBudget()));
            budget.setTotalAmount(dto.getTotalBudget());
            budgetRepository.save(budget);
        }
        if (dto.getStatus() != null) trip.setStatus(dto.getStatus());
        if (dto.getVisibility() != null) trip.setVisibility(dto.getVisibility());

        Trip saved = tripRepository.save(trip);
        return mapToDTO(saved, true);
    }

    @Transactional
    public void deleteTrip(Long id, User user) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", id));

        if (!trip.getOwner().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new ForbiddenException("Only the trip owner or a platform admin can delete a trip");
        }

        tripRepository.delete(trip);
    }

    public boolean isUserAuthorizedForTrip(Trip trip, User user) {
        if (trip.getOwner().getId().equals(user.getId()) || user.getRole() == Role.ROLE_ADMIN) {
            return true;
        }
        if (trip.getVisibility() == Trip.TripVisibility.PUBLIC) {
            return true;
        }
        return tripMemberRepository.existsByTripAndUser(trip, user);
    }

    public boolean isGroupAdmin(Trip trip, User user) {
        if (trip.getOwner().getId().equals(user.getId())) return true;
        return tripMemberRepository.findByTripAndUser(trip, user)
                .map(m -> m.getGroupRole() == TripMember.GroupRole.GROUP_ADMIN && m.getInviteStatus() == TripMember.InviteStatus.ACCEPTED)
                .orElse(false);
    }

    public TripDTO mapToDTO(Trip trip, boolean includeDetails) {
        TripDTO dto = new TripDTO();
        dto.setId(trip.getId());
        dto.setTitle(trip.getTitle());
        dto.setDescription(trip.getDescription());
        dto.setDestination(trip.getDestination());
        dto.setCoverImageUrl(trip.getCoverImageUrl());
        dto.setStartDate(trip.getStartDate());
        dto.setEndDate(trip.getEndDate());
        dto.setTotalBudget(trip.getTotalBudget());
        dto.setStatus(trip.getStatus());
        dto.setVisibility(trip.getVisibility());
        dto.setShareCode(trip.getShareCode());

        dto.setOwnerId(trip.getOwner().getId());
        dto.setOwnerName(trip.getOwner().getFullName());
        dto.setOwnerEmail(trip.getOwner().getEmail());

        Double totalExpenses = expenseRepository.sumAmountByTrip(trip);
        dto.setTotalExpenses(totalExpenses != null ? totalExpenses : 0.0);
        dto.setRemainingBudget(Math.max(0.0, trip.getTotalBudget() - dto.getTotalExpenses()));

        long days = ChronoUnit.DAYS.between(trip.getStartDate(), trip.getEndDate()) + 1;
        dto.setDaysCount((int) Math.max(1, days));

        List<TripMember> members = tripMemberRepository.findByTrip(trip);
        dto.setMemberCount(members.size());

        if (includeDetails) {
            List<Itinerary> itineraries = itineraryRepository.findByTripOrderByDayNumberAsc(trip);
            int activityTotal = 0;
            List<ItineraryDTO> itineraryDTOs = new ArrayList<>();

            for (Itinerary it : itineraries) {
                ItineraryDTO itDTO = new ItineraryDTO();
                itDTO.setId(it.getId());
                itDTO.setTripId(trip.getId());
                itDTO.setDayNumber(it.getDayNumber());
                itDTO.setDate(it.getDate());
                itDTO.setTitle(it.getTitle());
                itDTO.setNotes(it.getNotes());

                List<Activity> activities = activityRepository.findByItineraryOrderBySequenceOrderAscStartTimeAsc(it);
                activityTotal += activities.size();

                itDTO.setActivities(activities.stream().map(a -> {
                    ActivityDTO aDTO = new ActivityDTO();
                    aDTO.setId(a.getId());
                    aDTO.setItineraryId(it.getId());
                    aDTO.setTitle(a.getTitle());
                    aDTO.setActivityType(a.getActivityType());
                    aDTO.setStartTime(a.getStartTime());
                    aDTO.setEndTime(a.getEndTime());
                    aDTO.setDurationMinutes(a.getDurationMinutes());
                    aDTO.setLocationName(a.getLocationName());
                    aDTO.setAddress(a.getAddress());
                    aDTO.setLatitude(a.getLatitude());
                    aDTO.setLongitude(a.getLongitude());
                    aDTO.setEstimatedCost(a.getEstimatedCost());
                    aDTO.setActualCost(a.getActualCost());
                    aDTO.setNotes(a.getNotes());
                    aDTO.setSequenceOrder(a.getSequenceOrder());
                    aDTO.setReminderSet(a.isReminderSet());
                    return aDTO;
                }).collect(Collectors.toList()));

                itineraryDTOs.add(itDTO);
            }
            dto.setItineraries(itineraryDTOs);
            dto.setActivityCount(activityTotal);

            dto.setMembers(members.stream().map(m -> {
                TripMemberDTO mDTO = new TripMemberDTO();
                mDTO.setId(m.getId());
                mDTO.setTripId(trip.getId());
                mDTO.setUserId(m.getUser().getId());
                mDTO.setFullName(m.getUser().getFullName());
                mDTO.setEmail(m.getUser().getEmail());
                mDTO.setAvatarUrl(m.getUser().getAvatarUrl());
                mDTO.setGroupRole(m.getGroupRole());
                mDTO.setInviteStatus(m.getInviteStatus());
                mDTO.setJoinedAt(m.getJoinedAt());
                return mDTO;
            }).collect(Collectors.toList()));
        }

        dto.setCreatedAt(trip.getCreatedAt());
        dto.setUpdatedAt(trip.getUpdatedAt());
        return dto;
    }
}
