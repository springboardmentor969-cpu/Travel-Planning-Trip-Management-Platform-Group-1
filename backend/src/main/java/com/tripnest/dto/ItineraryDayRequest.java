package com.tripnest.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ItineraryDayRequest {

    @NotNull(message = "Day number is required")
    private Integer dayNumber;

    @NotNull(message = "Date is required")
    private LocalDate date;

    public Integer getDayNumber() { return dayNumber; }
    public void setDayNumber(Integer dayNumber) { this.dayNumber = dayNumber; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}