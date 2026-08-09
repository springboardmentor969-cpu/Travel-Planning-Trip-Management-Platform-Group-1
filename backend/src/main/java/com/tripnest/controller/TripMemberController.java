package com.tripnest.controller;

import com.tripnest.dto.AddTripMemberRequest;
import com.tripnest.dto.TripMemberDto;
import com.tripnest.dto.UpdateTripMemberRequest;
import com.tripnest.service.TripMemberService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trips/{tripId}/members")
public class TripMemberController {
    private final TripMemberService memberService;
    public TripMemberController(TripMemberService memberService) { this.memberService = memberService; }
    @GetMapping public List<TripMemberDto> list(@PathVariable Long tripId) { return memberService.list(tripId); }
    @PostMapping public ResponseEntity<TripMemberDto> add(@PathVariable Long tripId, @Valid @RequestBody AddTripMemberRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(memberService.add(tripId, request)); }
    @PutMapping("/{userId}") public TripMemberDto update(@PathVariable Long tripId, @PathVariable Long userId, @Valid @RequestBody UpdateTripMemberRequest request) { return memberService.update(tripId, userId, request); }
    @DeleteMapping("/{userId}") public ResponseEntity<Void> remove(@PathVariable Long tripId, @PathVariable Long userId) { memberService.remove(tripId, userId); return ResponseEntity.noContent().build(); }
}
