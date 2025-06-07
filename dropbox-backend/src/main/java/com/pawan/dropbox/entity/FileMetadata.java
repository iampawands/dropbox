package com.pawan.dropbox.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "file_metadata")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FileMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String contentType;
    private long size;
    private String path;
    private LocalDateTime uploadedAt;
}
