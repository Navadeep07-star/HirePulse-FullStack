package com.jobportal.backend.repository;

import com.jobportal.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<Application,Long>
{
    boolean existsByJobIdAndApplicantId(Long jobId,Long applicantId);
    List<Application> findByJob_PostedBy_Email(String email);
    List<Application> findByApplicantEmail(String email);

    List<Application> findByJobId(Long jobId);
    void deleteByJobId(Long jobId);
}