package com.jobportal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MyErrorResponse {
    private int status;
    private String message;
    private long timestamp;
}

