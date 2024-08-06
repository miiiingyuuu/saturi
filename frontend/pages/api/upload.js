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
      const { audioData } = req.body; // 클라이언트에서 받은 오디오 데이터
      const buffer = Buffer.from(audioData, 'base64');
      const filename = `${uuidv4()}.wav`;

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
