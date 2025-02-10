// pages/api/process-video.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import axios from 'axios'; // For making HTTP requests to the external API
import FormData from 'form-data'; // Import form-data package

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing to handle file uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const chunks: Buffer[] = [];

    // Collect data chunks from the request stream
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    // When the request stream ends, process the video
    req.on('end', async () => {
      const buffer = Buffer.concat(chunks);

      // Define the file path where the video will be temporarily saved
      const filePath = path.join(process.cwd(), 'public', 'uploads', 'video.mp4');

      try {
        // Write the video file to the uploads directory (temporary storage)
        fs.writeFileSync(filePath, buffer);

        // Define the external API URL
        const externalApiUrl = 'https://your-external-api.com/process-video'; // Replace with your actual API URL

        // Prepare the video file for sending to the external API
        const formData = new FormData();
        formData.append('video', fs.createReadStream(filePath));

        // Send the video to the external API
        const response = await axios.post(externalApiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Delete the temporary video file after processing
        fs.unlinkSync(filePath);

        // Forward the external API's response to the client
        res.status(200).json({ message: 'Video processed successfully', data: response.data });
      } catch (error) {
        console.error('Error processing video:', error);

        // Delete the temporary video file in case of an error
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: 'Failed to process video', error: errorMessage });
      }
    });

    // Handle errors in the request stream
    req.on('error', (error: Error) => {
      console.error('Request stream error:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
  } else {
    // Handle non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}