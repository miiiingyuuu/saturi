// pages/api/upload.js

import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  keyFilename: "src/lib/KEY_FOR_GOOGLE_STORAGE.json",
  projectId: "Saturi is seotul",
});

const bucketName = "saturi";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { audioData } = req.body; // 클라이언트에서 받은 오디오 데이터 (base64)
      
      // base64 데이터를 Buffer로 변환
      const buffer = Buffer.from(audioData, 'base64');
      const filename = `${uuidv4()}.wav`;

      // Google Cloud Storage에 저장
      await storage.bucket(bucketName).file(filename).save(buffer);

      res.status(200).json({ message: 'File uploaded successfully', filename });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '3mb', // 최대 2MB 크기 제한 설정
    },
  },
};
