import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default groq;

// Export model name for consistency
export const DEFAULT_MODEL = "llama-3.1-70b-versatile";
