import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Instantiate the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is correctly set in the .env.local file
});

// Function to read JSON file containing questions
const getQuestions = () => {
  try {
    // Resolve the path to the JSON file
    const filePath = path.resolve(process.cwd(), 'src/data/questionswritingtask1.json');
    
    // Read and parse the JSON file
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents); // Parse the contents of the JSON file and return the questions
  } catch (error) {
    // Log an error if there's an issue reading or parsing the file
    console.error('Failed to read questions file:', error);
    return []; // Return an empty array if there's an error
  }
};

// Main handler for POST request
export async function POST(req) {
  try {
    // Read the questions from the JSON file using the helper function
    const questions = getQuestions();
    if (questions.length === 0) {
      // If no questions are found, return an error response
      return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
    }

    // Parse the request body from the incoming POST request
    const requestBody = await req.json(); // This will throw an error if the request body is not JSON

    // Check if the request body contains the required data
    const { answer, questionId } = requestBody; // Destructure the 'answer' and 'questionId' fields from the request body
    if (!answer || !questionId) {
      // If either 'answer' or 'questionId' is missing, return a bad request error
      return NextResponse.json({ error: 'Answer and question ID are required' }, { status: 400 });
    }

    // Find the specific question by its ID from the imported JSON file
    const question = questions.find((q) => q.id === questionId);
    if (!question) {
      // If the question is not found, return a 404 Not Found error
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Log the matched question for debugging purposes
    console.log('Matched Question:', question);

    // Use OpenAI API to generate feedback based on the user's answer
    const openaiResponse = await openai.chat.completions.create({
      model: 'gpt-4-0613', // Use the GPT-4 model (you can adjust this if needed)
      messages: [
        {
          role: 'system',
          content: `Please evaluate the following response for the question: "${question.question}". Provide detailed feedback limited to 150 words, focusing on:
          Grammar: Assess the accuracy and variety of sentence structures, noting any frequent errors.
          Coherence and Cohesion: Evaluate the logical flow of ideas, clarity of transitions, and use of linking words. If the response is incoherent, only state one sentence: 'The response is incoherent. Please rewrite the answer.'
          Task Achievement: Judge how well the response addresses all parts of the question, the appropriateness of the content, and its relevance to the prompt.
          Finally, assign an overall band score (1-9) according to the IELTS Writing Task criteria. Be Strict`,
        },
        { role: 'user', content: answer }, // Provide the user's answer for evaluation
        {
          role: 'system',
          content:
            'Respond in the following JSON format: {"score": <band_score>, "feedback": "<feedback_text>"}',
        },
      ],
      max_tokens: 200, // Limit the number of tokens to control the length of the response
      temperature: 0.7, // Adjust the temperature to control randomness in the response
    });

    // Log the full response from OpenAI for debugging purposes
    console.log('OpenAI API full response:', openaiResponse);

    // Extract the message content from OpenAI's response
    const responseContent = openaiResponse.choices[0].message.content.trim();
    console.log('OpenAI Response Content:', responseContent); // Log the content returned by OpenAI

    // Parse the JSON response from OpenAI
    let feedbackData;
    try {
      feedbackData = JSON.parse(responseContent); // Parse the JSON content returned by OpenAI
    } catch (parseError) {
      // If JSON parsing fails, log the error and return a server error response
      console.error('Failed to parse JSON response:', parseError);
      return NextResponse.json({ error: 'Invalid response format from OpenAI' }, { status: 500 });
    }

    // Check if the parsed response contains both score and feedback
    if (typeof feedbackData.score !== 'number' || !feedbackData.feedback) {
      // If the score is not a number or the feedback is missing, return an error response
      console.warn('Incomplete feedback data received:', feedbackData);
      return NextResponse.json({ error: 'Incomplete feedback data received' }, { status: 500 });
    }

    // Return the feedback and band score to the client as a JSON response
    return NextResponse.json(
      { feedback: feedbackData.feedback, score: feedbackData.score },
      { status: 200 } // Return a success status code (200 OK)
    );
  } catch (error) {
    // Log any errors that occur during the request processing
    console.error('Error processing request:', error.message);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 }); // Return a generic server error response
  }
}
