package com.jobportal.backend.controller;

import com.jobportal.backend.entity.Job;
import com.jobportal.backend.service.JobService;
import com.jobportal.backend.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {
    private final JobService jobService;
    private final AiService aiService;

    @PostMapping("/post")
    public Job postJob(@RequestBody Job job){
        return jobService.createJob(job);
    }


    @GetMapping("/all")
    public Page<Job> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ){
        return jobService.getJobsPaginated(page, size);
    }

    @GetMapping("/search")
    public List<Job> search(@RequestParam String keyword){
        return jobService.searchJobs(keyword);
    }

    @GetMapping("/{id}")
    public Job getJob(@PathVariable Long id){
        return jobService.getJobById(id);
    }


    @GetMapping("/{id}/interview-prep")
    public String getInterviewPrep(@PathVariable Long id) {
        Job job = jobService.getJobById(id);
        return aiService.generateInterviewQuestions(job.getTitle(), job.getDescription());
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id) {
        jobService.deleteJobById(id);
        return ResponseEntity.ok("Job deleted successfully");
    }

    @GetMapping("/my-postings")
    public List<Job> getMyPostings() {
        return jobService.getJobsByCurrentRecruiter();
    }
}