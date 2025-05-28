/**
 * AI service client - calls our Next.js API route instead of directly calling external APIs
 */

import { z } from 'zod';

// Define schema for AI input validation
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
 * Get AI design suggestions by calling our Next.js API route
 * This ensures the API call happens on the server side
 * @param request The request containing text and image count
 * @returns AI design suggestions
 */
export async function getAIDesignSuggestions(request: AIDesignRequest): Promise<AIDesignResponse> {
  try {
    // Validate input
    const validatedInput = aiInputSchema.parse(request);
    
    // Call our Next.js API route
    const response = await fetch('/api/ai-suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedInput),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API call failed: ${response.status} ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    return result as AIDesignResponse;

  } catch (error) {
    console.error('Failed to get AI design suggestions:', error);
    
    // Return fallback response if API call fails
    return generateFallbackResponse(request);
  }
}

/**
 * Generate fallback response when API calls fail
 */
function generateFallbackResponse({ text, imageCount }: AIDesignRequest): AIDesignResponse {
  const fontOptions = [
    'Arial', 'Times New Roman', 'Courier New', 'Impact', 'Comic Sans MS',
    'Georgia', 'Verdana', 'Helvetica', 'Tahoma', 'Trebuchet MS'
  ];

  // Choose 3 random fonts
  const fonts = [];
  const shuffledFonts = [...fontOptions];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * shuffledFonts.length);
    fonts.push(shuffledFonts[randomIndex]);
    shuffledFonts.splice(randomIndex, 1);
  }
  
  // Generate contextual suggestions
  let suggestions = '';
  if (text.length <= 3) {
    suggestions = "For short text, arrange images in a dense pattern to clearly define the letter shapes. Vary image sizes for visual interest.";
  } else {
    suggestions = "Images should be evenly distributed throughout the text shape for balanced visual impact.";
  }
  
  // Generate layout advice based on image count
  let layoutAdvice = '';
  if (imageCount < 5) {
    layoutAdvice = "With fewer images, use a bold font and larger image sizes to fill the text shape effectively.";
  } else if (imageCount > 15) {
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