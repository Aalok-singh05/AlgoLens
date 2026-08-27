package com.algovault.controller;
import com.algovault.dto.SyncLeetcodeRequest;
import com.algovault.model.User;
import com.algovault.service.SyncService;
import com.algovault.service.UserContextService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/sync")
@RequiredArgsConstructor
public class SyncController {
    private final SyncService syncService;
    private final UserContextService userContextService;

    @PostMapping("/leetcode")
    public ResponseEntity<?> syncLeetcode(HttpServletRequest servletRequest, @RequestBody @jakarta.validation.Valid SyncLeetcodeRequest request) {
        try {
            User user = userContextService.resolveUser(servletRequest);
            syncService.syncLeetcode(user.getId(), request);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Data synchronized successfully"));
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(SyncController.class).error("Sync failed for user", e);
            // Do not expose upstream, database, or parsing details to callers.
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error", "message", "Data synchronization failed. Please retry from LeetCode."));
        }
    }
}
