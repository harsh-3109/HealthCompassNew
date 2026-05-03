const config = {
  // Use VITE_API_URL if defined, otherwise fallback to localhost for development
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  // If Python AI service is separate, you could configure it here
  AI_SERVICE_URL: import.meta.env.VITE_AI_SERVICE_URL || "http://localhost:8000"
};

export default config;
