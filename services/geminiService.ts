
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_TEXT } from '../constants';

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
let apiKeyConfigured = false;

if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
    apiKeyConfigured = true;
  } catch (error) {
    console.error("Error initializing GoogleGenAI:", error);
    apiKeyConfigured = false;
  }
} else {
  console.warn("API_KEY environment variable is not set. Gemini API calls will be disabled.");
  apiKeyConfigured = false;
}

export const isGeminiApiKeyConfigured = (): boolean => {
  return apiKeyConfigured;
};

export const generateCourseDescription = async (courseTitle: string): Promise<string> => {
  if (!ai) {
    return "Error: Gemini API client not initialized. This might be due to a missing or invalid API Key.";
  }
  if (!courseTitle.trim()) {
    return "Error: Course title cannot be empty.";
  }

  try {
    const prompt = `Generate a concise and engaging university course description for a course titled: "${courseTitle}". 
    The description should be 1-2 paragraphs long, suitable for a course catalog. 
    Highlight key topics, learning objectives, and potential prerequisites if applicable. 
    Avoid overly casual language.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating course description with Gemini:", error);
    if (error instanceof Error) {
        // Check for specific API key related errors if possible, though the SDK might abstract this
        if (error.message.toLowerCase().includes("api key not valid")) {
             return "Error from AI: The API key is invalid. Please check your configuration.";
        }
        return `Error from AI: ${error.message}`;
    }
    return "An unexpected error occurred while generating the description via AI.";
  }
};
