package com.pawan.dropbox.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ErrorResponse  {
    private LocalDateTime timestamp;
    private String message;
    private String path;
}
