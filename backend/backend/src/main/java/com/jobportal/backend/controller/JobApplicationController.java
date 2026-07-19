package com.jobportal.backend.controller;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.repository.JobApplicationRepository;
import com.jobportal.backend.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private  final JobApplicationService jobApplicationService;
    private final JobApplicationRepository jobApplicationRepository;

    @PostMapping("/apply/{jobId}")
    public String apply(@PathVariable Long jobId,@RequestBody String resumeUrl){
        return jobApplicationService.applyForJob(jobId,resumeUrl);
    }

    @GetMapping("/recruiter/all")
    public List<Application> getMyApplicants(){
        return jobApplicationService.getApplicationForRecruiter();
    }

    @PutMapping("/status/{id}")
    public String updateStatus(@PathVariable Long id,@RequestParam String status){
        return jobApplicationService.updateApplicationStatus(id,status);
    }



    @GetMapping("/my-applications")
    public List<Application> getMyApplication(){
        return jobApplicationService.getApplications();
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Map<String, Object>>> getApplicationsByJob(@PathVariable Long jobId) {
        List<Application> apps = jobApplicationRepository.findByJobId(jobId);

        List<Map<String, Object>> response = apps.stream().map(app -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", app.getId());
            map.put("candidateEmail", app.getApplicant() != null ? app.getApplicant().getEmail() : "Anonymous");
            map.put("resumeUrl", app.getResumeUrl());
            map.put("appliedAt", app.getAppliedAt() != null ? app.getAppliedAt().toString() : "Just now");
            return map;
        }).collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
