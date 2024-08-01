package com.tunapearl.saturi.utils;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import com.tunapearl.saturi.dto.admin.lesson.UploadFile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileStoreUtil {
    
    @Value("${file.dir}") //FIXME 경로 수정
    private String fileDir;
    private final Storage storage = StorageOptions.getDefaultInstance().getService();
//    private Storage storage;
//    {
//        try {
//            storage = StorageOptions.newBuilder().setCredentials(GoogleCredentials
//                    .fromStream(new FileInputStream(System.getenv("GOOGLE_APPLICATION_CREDENTIALS"))))
//                    .build().getService();
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//    }

    public String getFullPath(String fileName) {
        return fileDir + fileName;
    }

    public UploadFile storeFile(MultipartFile multipartFile) throws IOException {
        if(multipartFile.isEmpty()) return null;
        log.info("key info {}, {}", storage.getOptions().getProjectId(), storage.getOptions().getCredentials());
        String originFileName = multipartFile.getOriginalFilename();
        String storeFileName = createStoreFileName(originFileName);
        File file = new File(getFullPath(storeFileName));
        multipartFile.transferTo(file);

        BlobId blobId = BlobId.of("saturi", storeFileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(multipartFile.getContentType()).build();
        Blob blob = storage.create(blobInfo, Files.readAllBytes(file.toPath()));

        file.delete();

        return new UploadFile(originFileName, blob.getMediaLink());
    }

    private String createStoreFileName(String originFileName) {
        String ext = extractExt(originFileName);
        String uuid = UUID.randomUUID().toString();
        return uuid + "." + ext;
    }

    private String extractExt(String originFileName) {
        int pos = originFileName.lastIndexOf(".");
        return originFileName.substring(pos + 1);
    }
}
