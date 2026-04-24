package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Dto.Request.LoginRequest;
import com.SmartCampus.SmartCampus.Dto.Request.GoogleLoginRequest;
import com.SmartCampus.SmartCampus.Dto.Request.SignupRequest;
import com.SmartCampus.SmartCampus.Dto.Response.AuthResponse;

public interface AuthService {

    AuthResponse signup(SignupRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse loginWithGoogle(GoogleLoginRequest request);
}
