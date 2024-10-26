import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

// Disable automatic body parsing in Next.js to allow handling of file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    // Extract form data from the request using req.formData()
    const formData = await req.formData();
    
    // Retrieve the audio file from the form data
    const file = formData.get('audio'); // The key must match the client-side form key

    if (!file || !(file instanceof Blob)) {
      console.error('No audio file provided or invalid file type.');
      return NextResponse.json({ error: 'No audio file provided or invalid file type' }, { status: 400 });
    }

    // Convert the Blob to an ArrayBuffer, then to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    // Create a FormData object for the axios request
    const data = new FormData();
    data.append('file', audioBuffer, 'audiofile.wav'); // Assuming it's a .wav file
    data.append('model', 'whisper-1');                 // Set model
    data.append('language', 'en');                     // Specify language (optional)

    // Send the audio file to the OpenAI Whisper API using axios
    const transcriptionResponse = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      data,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // API Key from env
          ...data.getHeaders() // Necessary headers for form-data
        },
      }
    );

    // Return the transcription text to the client
    return NextResponse.json({ transcription: transcriptionResponse.data.text });
  } catch (error) {
    console.error('Error transcribing audio:', error.message);
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}
