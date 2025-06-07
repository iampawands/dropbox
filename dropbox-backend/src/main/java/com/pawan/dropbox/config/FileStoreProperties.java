package com.pawan.dropbox.config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "file")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FileStoreProperties {
    private String uploadDir;
    private List<String> allowedExtensions;
}
