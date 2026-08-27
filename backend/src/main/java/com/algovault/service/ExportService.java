package com.algovault.service;

import com.algovault.repository.ContestResultRepository;
import com.algovault.repository.SubmissionRepository;
import com.algovault.repository.VaultEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@org.springframework.transaction.annotation.Transactional
@RequiredArgsConstructor
public class ExportService {
    private final SubmissionRepository submissionRepository;
    private final ContestResultRepository contestResultRepository;
    private final VaultEntryRepository vaultEntryRepository;

    public Map<String, Object> exportAllUserData(Long userId) {
        Map<String, Object> export = new HashMap<>();
        List<Map<String, Object>> mappedSubmissions = submissionRepository.findByUserId(userId).stream().map(sub -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", sub.getId());
            map.put("verdict", sub.getVerdict());
            map.put("language", sub.getLanguage());
            map.put("runtimeMs", sub.getRuntimeMs());
            map.put("memoryKb", sub.getMemoryKb());
            map.put("submittedAt", sub.getSubmittedAt());
            if (sub.getProblem() != null) {
                map.put("problemTitle", sub.getProblem().getTitle());
                map.put("titleSlug", sub.getProblem().getTitleSlug());
                map.put("difficulty", sub.getProblem().getDifficulty());
                map.put("actualRating", sub.getProblem().getActualRating());
            }
            return map;
        }).collect(java.util.stream.Collectors.toList());

        export.put("submissions", mappedSubmissions);
        export.put("contests", contestResultRepository.findByUserIdOrderByContestDateDesc(userId));
        export.put("vault", vaultEntryRepository.findByUserIdOrderByUpdatedAtDesc(userId));
        return export;
    }
}
