package com.algovault.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;

/** One-time, short-lived states for the extension OAuth callback. */
@Service
@lombok.RequiredArgsConstructor
public class OAuthStateService {
    private static final String PREFIX = "oauth:github:state:";
    private final RedisTemplate<String, Object> redisTemplate;
    private final SecureRandom secureRandom = new SecureRandom();

    public String issue() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        String state = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        redisTemplate.opsForValue().set(PREFIX + state, Boolean.TRUE, Duration.ofMinutes(10));
        return state;
    }

    public boolean consume(String state) {
        if (state == null || !state.matches("^[A-Za-z0-9_-]{43}$")) return false;
        Object value = redisTemplate.opsForValue().getAndDelete(PREFIX + state);
        return Boolean.TRUE.equals(value);
    }
}
