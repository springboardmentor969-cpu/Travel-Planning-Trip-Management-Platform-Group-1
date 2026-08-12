package com.tripnest.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReorderRequest {

    @NotNull(message = "New position is required")
    private Integer sortOrder;

    private Long targetDayId;

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public Long getTargetDayId() { return targetDayId; }
    public void setTargetDayId(Long targetDayId) { this.targetDayId = targetDayId; }
}