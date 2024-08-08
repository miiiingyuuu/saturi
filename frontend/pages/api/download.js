// pages/api/download.js

import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  keyFilename: "src/lib/KEY_FOR_GOOGLE_STORAGE.json",
  projectId: "Saturi is seotul",
});

const bucketName = "saturi";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { filename } = req.body; // Expecting the filename in the request body

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    try {
      // Downloads the file into a buffer in memory
      const [contents] = await storage.bucket(bucketName).file(filename).download();

      res.setHeader('Content-Type', 'audio/wav'); // Set content type for WAV audio
      res.status(200).send(contents); // Send the buffer as the response
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).json({ error: 'Failed to download file' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
