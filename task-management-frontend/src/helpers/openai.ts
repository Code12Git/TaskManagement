// Importing the Google Generative AI SDK to interact with Gemini models
import { GoogleGenerativeAI } from '@google/generative-ai';

// Importing 'p-limit' to restrict the number of concurrent asynchronous calls
import pLimit from 'p-limit';

const limit = pLimit(3);

const api = process.env.NEXT_GEMINI_KEY;

// Throwing an error if the API key is missing to prevent accidental misconfiguration
if (!api) {
  throw new Error('Missing GOOGLE_GEMINI_API_KEY in environment variables');
}

// Initializing the Generative AI client with the fetched API key
const genAI = new GoogleGenerativeAI(api);

// Exporting an asynchronous function that generates a professional email body based on a given subject
export const generateDescription = async (title: string) => {
  // Using the limiter to ensure no more than 3 email generations happen at once
  return limit(async () => {
      try {
      // Creating a prompt to guide the AI in generating a relevant email body
      const prompt = `Generate a  description for the task  which has title:${title}`;

      // Getting a generative model instance (using the "gemini-2.0-flash" model for fast response)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Sending the prompt to the model to generate content
      const result = await model.generateContent(prompt);

      // Extracting plain text from the generated response
      const generatedText = await result.response.text();
      // Returning the final generated email body text
      return generatedText;
    } catch (error) {
      // Logging and rethrowing any errors to be handled by the calling function
      console.error('Error generating body of email:', error);
      throw error;
    }
  });
};


export const generatePriority = async (title: string) => {
    // Using the limiter to ensure no more than 3 email generations happen at once
    return limit(async () => {
        try {
         // Creating a prompt to guide the AI in generating a relevant email body
        const prompt = `Based on the task title: "${title}", assign a priority level. The priority must be exactly one of the following: "high", "medium", or "low". Do not return anything else.`;
  
        // Getting a generative model instance (using the "gemini-2.0-flash" model for fast response)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
        // Sending the prompt to the model to generate content
        const result = await model.generateContent(prompt);
  
        // Extracting plain text from the generated response
        const generatedText = await result.response.text();
         // Returning the final generated email body text
        return generatedText;
      } catch (error) {
        // Logging and rethrowing any errors to be handled by the calling function
        console.error('Error generating body of email:', error);
        throw error;
      }
    });
  };