import { NextResponse } from 'next/server';
import { OpenAI } from 'openai'; // You can use axios if needed, but here OpenAI client is used directly

// Instantiate the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is correctly set in the .env.local file
});

// Main handler for POST request to generate feedback
export async function POST(req) {
  try {
    // Parse the request body from the incoming POST request
    const { question, transcribedAnswer } = await req.json(); // This will throw an error if the request body is not JSON

    // Ensure both question and transcribedAnswer are provided
    if (!question || !transcribedAnswer) {
      return NextResponse.json({ error: 'Question and transcribed answer are required' }, { status: 400 });
    }

    // Log the question and transcribed answer for debugging purposes
    console.log('Question:', question);
    console.log('Transcribed Answer:', transcribedAnswer);

    // Use OpenAI API to generate feedback based on the transcribed answer
    const openaiResponse = await openai.chat.completions.create({
      model: 'gpt-4-0613', // Use the GPT model you prefer
      messages: [
        {
          role: 'system',
          content: `You are an IELTS examiner. Provide feedback on the following speaking task.\n\nQuestion: "${question}"\n\nAnswer: "${transcribedAnswer}".\n\nEvaluate the clarity, vocabulary, grammar, pronunciation, and coherence. Also, assign band scores for the following categories: fluencyAndCoherence, lexicalResource, grammaticalRangeAndAccuracy, pronunciation, and provide an overallBandScore. Provide suggestions for improvement.`,
        },
        {
          role: 'user',
          content: transcribedAnswer, // User-provided answer
        },
        {
          role: 'system',
          content: `
            Respond in the following JSON format:
            {
              "feedback": "<feedback_text>",
              "scores": {
                "fluencyAndCoherence": <score>,
                "lexicalResource": <score>,
                "grammaticalRangeAndAccuracy": <score>,
                "pronunciation": <score>,
                "overallBandScore": <score>
              }
            }
          `,
        },
      ],
      max_tokens: 200, // Adjust token count as necessary
      temperature: 0.7,
    });

    // Extract the message content from OpenAI's response
    const responseContent = openaiResponse.choices[0].message.content.trim();
    console.log('OpenAI Response Content:', responseContent); 

    // Parse the JSON response from OpenAI
    let feedbackData;
    try {
      feedbackData = JSON.parse(responseContent); 
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      return NextResponse.json({ error: 'Invalid response format from OpenAI' }, { status: 500 });
    }

    // Check if the parsed response contains feedback and scores
    if (!feedbackData.feedback || !feedbackData.scores) {
      console.warn('Incomplete feedback or scores data received:', feedbackData);
      return NextResponse.json({ error: 'Incomplete feedback or scores data received' }, { status: 500 });
    }

    // Return the feedback and scores to the client as a JSON response
    return NextResponse.json(
      { feedback: feedbackData.feedback, scores: feedbackData.scores },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing request:', error.message);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
