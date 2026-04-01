package com.SmartCampus.SmartCampus.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @GetMapping("/hello")
    public String helloWorld() {
        return "Hello World! Booking module is initialized and ready for development.";
    }
}
