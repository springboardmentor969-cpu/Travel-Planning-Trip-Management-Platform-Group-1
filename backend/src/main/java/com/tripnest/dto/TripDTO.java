package com.tripnest.dto;

import com.tripnest.entity.Trip;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class TripDTO {
    private Long id;

    @NotBlank(message = "Trip title is required")
    private String title;

    private String description;

    @NotBlank(message = "Destination is required")
    private String destination;

    private String coverImageUrl;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private Double totalBudget = 0.0;
    private Trip.TripStatus status = Trip.TripStatus.PLANNED;
    private Trip.TripVisibility visibility = Trip.TripVisibility.PRIVATE;
    private String shareCode;

    private Long ownerId;
    private String ownerName;
    private String ownerEmail;

    private Double totalExpenses = 0.0;
    private Double remainingBudget = 0.0;
    private Integer memberCount = 1;
    private Integer activityCount = 0;
    private Integer daysCount = 0;

    private List<ItineraryDTO> itineraries;
    private BudgetDTO budget;
    private List<TripMemberDTO> members;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TripDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Double getTotalBudget() { return totalBudget; }
    public void setTotalBudget(Double totalBudget) { this.totalBudget = totalBudget; }

    public Trip.TripStatus getStatus() { return status; }
    public void setStatus(Trip.TripStatus status) { this.status = status; }

    public Trip.TripVisibility getVisibility() { return visibility; }
    public void setVisibility(Trip.TripVisibility visibility) { this.visibility = visibility; }

    public String getShareCode() { return shareCode; }
    public void setShareCode(String shareCode) { this.shareCode = shareCode; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }

    public Double getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(Double totalExpenses) { this.totalExpenses = totalExpenses; }

    public Double getRemainingBudget() { return remainingBudget; }
    public void setRemainingBudget(Double remainingBudget) { this.remainingBudget = remainingBudget; }

    public Integer getMemberCount() { return memberCount; }
    public void setMemberCount(Integer memberCount) { this.memberCount = memberCount; }

    public Integer getActivityCount() { return activityCount; }
    public void setActivityCount(Integer activityCount) { this.activityCount = activityCount; }

    public Integer getDaysCount() { return daysCount; }
    public void setDaysCount(Integer daysCount) { this.daysCount = daysCount; }

    public List<ItineraryDTO> getItineraries() { return itineraries; }
    public void setItineraries(List<ItineraryDTO> itineraries) { this.itineraries = itineraries; }

    public BudgetDTO getBudget() { return budget; }
    public void setBudget(BudgetDTO budget) { this.budget = budget; }

    public List<TripMemberDTO> getMembers() { return members; }
    public void setMembers(List<TripMemberDTO> members) { this.members = members; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
