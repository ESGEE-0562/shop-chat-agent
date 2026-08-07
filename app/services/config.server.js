export const AppConfig = {
  api: {
    defaultModel: process.env.OPENAI_MODEL || 'gpt-5.6-terra',
    maxTokens: 2000,
    defaultPromptType: 'standardAssistant',
  },
  errorMessages: {
    missingMessage: "Message is required",
    apiUnsupported: "This endpoint only supports server-sent events (SSE) requests or history requests.",
    authFailed: "Authentication failed with OpenAI API",
    apiKeyError: "Please check your API key in environment variables",
    rateLimitExceeded: "Rate limit exceeded",
    rateLimitDetails: "Please try again later",
    genericError: "Failed to get response from OpenAI"
  },
  tools: {
    productSearchName: "search_shop_catalog",
    maxProductsToDisplay: 3
  }
};

export default AppConfig;
