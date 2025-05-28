/**
 * AI service, used to interact with the OpenRouter API, call DeepSeek model
 */

import { z } from 'zod';

const OPENROUTER_API_KEY = "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";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const MODEL = "deepseek/deepseek-chat-v3-0324:free";

// Define schema for AI input
const aiInputSchema = z.object({
  text: z.string().min(1).max(30),
  imageCount: z.number().int().positive(),
});

// Define response type for AI suggestions
export interface AIDesignResponse {
  suggestions?: string;
  layoutAdvice?: string;
  fontRecommendations?: string[];
}

export interface AIDesignRequest {
  text: string;
  imageCount: number;
}

/**
 * Get AI design suggestions based on text and image count
 * @param request The request containing text and image count
 * @returns AI design suggestions
 */
export async function getAIDesignSuggestions(request: AIDesignRequest): Promise<AIDesignResponse> {
  // Simulate AI design suggestions
  // In a real app, this would make an API call to a model like DeepSeek
  
  const { text, imageCount } = request;
  
  // Simple suggestion logic
  let suggestions = `For your text "${text}" with ${imageCount} images, `;
  suggestions += `consider arranging the images in a grid pattern that follows the text outline.`;
  
  const layoutAdvice = imageCount < 5 
    ? "With fewer images, use larger image sizes to fill the text shape effectively."
    : "With many images, use smaller image sizes for a more detailed text shape.";
  
  const fontRecommendations = [
    "Arial Bold",
    "Impact",
    "Times New Roman Bold"
  ];
  
  // Simulate a delay like a real API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    suggestions,
    layoutAdvice,
    fontRecommendations
  };
}

/**
 * Mock AI response for demonstration
 * In a real application, this would be replaced with actual AI API calls
 */
function mockAIResponse(prompt: z.infer<typeof aiInputSchema>): AIDesignResponse {
  // Generate suggestions based on text
  let suggestions = '';
  let layoutAdvice = '';
  const fontOptions = [
    'Arial', 'Times New Roman', 'Courier New', 'Impact', 'Comic Sans MS',
    'Georgia', 'Verdana', 'Helvetica', 'Tahoma', 'Trebuchet MS'
  ];

  // Choose 3 random fonts
  const fonts = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * fontOptions.length);
    fonts.push(fontOptions[randomIndex]);
    fontOptions.splice(randomIndex, 1);
  }
  
  // Generate contextual suggestions
  if (prompt.text.length <= 3) {
    suggestions = "For short text, arrange images in a dense pattern to clearly define the letter shapes. Vary image sizes for visual interest.";
  } else {
    suggestions = "Images should be evenly distributed throughout the text shape for balanced visual impact.";
  }
  
  // Generate layout advice based on image count
  if (prompt.imageCount < 5) {
    layoutAdvice = "With fewer images, use a bold font and larger image sizes to fill the text shape effectively.";
  } else if (prompt.imageCount > 15) {
    layoutAdvice = "With many images, use a clean font and smaller image sizes for a more detailed text shape.";
  } else {
    layoutAdvice = "Recommend using a bold font with the text centered in the composition.";
  }

  return {
    suggestions,
    layoutAdvice,
    fontRecommendations: fonts
  };
} 