package com.jobportal.backend.service;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.repository.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public Job createJob(Job job)
    {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        User recruiter = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()->new RuntimeException("User not found"));
        job.setPostedBy(recruiter);

        return jobRepository.save(job);
    }

    public List<Job> searchJobs(String keyword){
        return jobRepository.findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrLocationContainingIgnoreCase(keyword,keyword,keyword);
    }

    public List<Job> getAllJobs(){
        return jobRepository.findAll();
    }

    public Job getJobById(Long id){
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job with ID " + id + "does not exist!"));
    }

    public Page<Job> getJobsPaginated(int page,int size){
        Pageable pageable = PageRequest.of(page,size);
        return jobRepository.findAll(pageable);
    }

    @Transactional
    public void deleteJobById(Long id) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getPostedBy().getEmail().equalsIgnoreCase(currentUserEmail)) {
            throw new RuntimeException("Unauthorized to delete this job listing");
        }

        jobApplicationRepository.deleteByJobId(id);

        jobRepository.delete(job);
    }

    public List<Job> getJobsByCurrentRecruiter() {
        String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return jobRepository.findByPostedByEmail(currentUserEmail);
    }

}