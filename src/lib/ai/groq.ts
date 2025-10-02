import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default groq;

// Use the current model - llama-3.1-70b-versatile is deprecated
export const DEFAULT_MODEL = "llama-3.3-70b-versatile";
