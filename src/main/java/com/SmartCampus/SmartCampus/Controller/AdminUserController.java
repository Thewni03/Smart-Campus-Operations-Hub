package com.SmartCampus.SmartCampus.Controller;

import com.SmartCampus.SmartCampus.Dto.Response.ApiResponse;
import com.SmartCampus.SmartCampus.Dto.Response.UserSummaryResponse;
import com.SmartCampus.SmartCampus.Entity.UserAccount;
import com.SmartCampus.SmartCampus.Repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminUserController {

    private final UserAccountRepository userAccountRepository;

    @GetMapping("/users/students")
    public ResponseEntity<ApiResponse<List<UserSummaryResponse>>> getStudents() {
        List<UserSummaryResponse> students = userAccountRepository.findByRoleIgnoreCase("STUDENT")
                .stream()
                .map(this::toSummary)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", students));
    }

    @GetMapping("/users/technicians")
    public ResponseEntity<ApiResponse<List<UserSummaryResponse>>> getTechnicians() {
        List<UserSummaryResponse> technicians = userAccountRepository.findByRoleIgnoreCase("TECHNICIAN")
                .stream()
                .map(this::toSummary)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Technicians retrieved successfully", technicians));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String userId) {
        if (!userAccountRepository.existsById(userId)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("User not found"));
        }
        userAccountRepository.deleteById(userId);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    private UserSummaryResponse toSummary(UserAccount user) {
        return new UserSummaryResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getOauthProvider(),
                user.getCreatedAt()
        );
    }
}
