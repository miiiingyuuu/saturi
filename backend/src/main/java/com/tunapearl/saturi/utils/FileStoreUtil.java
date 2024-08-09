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
    
    @Value("${file.dir}")
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

    public UploadFile storeFile(MultipartFile multipartFile) throws IOException {
        if(multipartFile.isEmpty()) return null;
        String originFileName = multipartFile.getOriginalFilename(); // 원본 파일 이름
        String storeFileName = createStoreFileName(originFileName); // 저장되는 파일 이름
        File file = new File(getFullPath(storeFileName)); // 저장할 경로를 지정해서 파일 객체 생성
        multipartFile.transferTo(file); // 로컬 폴더에 파일 임시로 저장

        BlobId blobId = BlobId.of("saturi", storeFileName); // 버킷과 저장되는 파일이름으로 블롭 아이디 생성
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(multipartFile.getContentType()).build(); // 블롭 아이디로 블롭인포 생성
        Blob blob = storage.create(blobInfo, Files.readAllBytes(file.toPath())); // 블롭인포와 파일 객체로 스토리지 버킷에 저장

        file.delete(); // 로컬 폴더에 임시로 저장된 파일을 지움

        return new UploadFile(originFileName, storeFileName);
    }

    public String getFullPath(String fileName) {
        return fileDir + fileName;
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
