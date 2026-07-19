package com.jobportal.backend.controller;

import com.jobportal.backend.dto.AuthRequest;
import com.jobportal.backend.dto.UserRegistrationDTO;
import com.jobportal.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody UserRegistrationDTO dto){
        return authService.registerUser(dto);
    }

    @PostMapping("/login")
    public String login(@RequestBody AuthRequest dto){
        return authService.login(dto);
    }
}
