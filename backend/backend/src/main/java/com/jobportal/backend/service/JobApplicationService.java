package com.jobportal.backend.service;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.JobApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public String applyForJob(Long jobId, String resumeUrl) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        System.out.println("==========================================================");
        System.out.println("▶▶▶ DYNAMIC ROUTE ACTIVE FOR EMAIL: [" + email + "]");
        System.out.println("==========================================================");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User record not found for email: " + email));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (jobApplicationRepository.existsByJobIdAndApplicantId(jobId, user.getId())) {
            return "You have already applied for this job";
        }

        Application application = new Application();
        application.setJob(job);
        application.setApplicant(user);
        application.setResumeUrl(resumeUrl);
        application.setStatus("PENDING");
        application.setAppliedAt(LocalDateTime.now());
        jobApplicationRepository.save(application);

        return "Application submitted successfully!";
    }

    public String updateApplicationStatus(Long applicationId, String status) {
        Application application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(status.toUpperCase());

        jobApplicationRepository.save(application);

        return "Application " + applicationId + " is now " + status;
    }

    public List<Application> getApplicationForRecruiter() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return jobApplicationRepository.findByJob_PostedBy_Email(email);
    }

    public List<Application> getApplications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("▶▶▶ FETCHING APPLICATIONS FOR TRACKING SYSTEM: [" + email + "]");
        return jobApplicationRepository.findByApplicantEmail(email);
    }
}