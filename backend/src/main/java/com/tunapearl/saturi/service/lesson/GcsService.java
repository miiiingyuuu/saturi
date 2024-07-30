package com.tunapearl.saturi.service.lesson;

import com.google.cloud.storage.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class GcsService {

    private final Storage storage = StorageOptions.getDefaultInstance().getService();

    public String uploadFile(String bucketName, String fileName, MultipartFile file) throws IOException {
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();
        Blob blob = storage.create(blobInfo, file.getInputStream());
        return blob.getMediaLink();
    }

    public byte[] downloadFile(String bucketName, String fileName) {
        BlobId blobId = BlobId.of(bucketName, fileName);
        Blob blob = storage.get(blobId);
        if (blob == null) {
            throw new RuntimeException("No Such Object");
        }
        return blob.getContent();
    }
}
