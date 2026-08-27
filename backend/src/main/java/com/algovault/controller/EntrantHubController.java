package com.algovault.controller;

import com.algovault.service.EntrantHubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

@RestController
@RequestMapping("/api/entranthub")
@RequiredArgsConstructor
@Validated
public class EntrantHubController {
    private final EntrantHubService entrantHubService;

    @GetMapping("/history")
    public ResponseEntity<String> getHistory(
            @RequestParam @jakarta.validation.constraints.Pattern(regexp = "^[A-Za-z0-9_-]{1,100}$") String username,
            @RequestParam(defaultValue = "US") @jakarta.validation.constraints.Pattern(regexp = "^[A-Za-z]{2,8}$") String region) {
        String json = entrantHubService.fetchHistory(username, region);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(json);
    }


    @GetMapping("/upcoming")
    public ResponseEntity<String> getUpcoming() {
        String json = entrantHubService.fetchUpcoming();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(json);
    }
}
