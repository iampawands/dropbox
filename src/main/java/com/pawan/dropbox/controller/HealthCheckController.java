package com.pawan.dropbox.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Health Check Controller")
public class HealthCheckController {

    @GetMapping("/health")
    @Operation(description = "Check Service Health")
    public ResponseEntity<String> health(){
        return ResponseEntity.ok("Dropbox servcie is up");
    }

}
