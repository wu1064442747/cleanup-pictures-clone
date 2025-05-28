import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define input validation schema
const aiRequestSchema = z.object({
  text: z.string().min(1).max(30),
  imageCount: z.number().int().positive(),
});

// Define response type
interface AIDesignResponse {
  suggestions?: string;
  layoutAdvice?: string;
  fontRecommendations?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = aiRequestSchema.parse(body);
    const { text, imageCount } = validatedData;

    // Get environment variables
    const apiKey = process.env.OPENROUTER_API_KEY;
    const baseUrl = process.env.OPENROUTER_BASE_URL;
    const model = process.env.OPENROUTER_MODEL;

    if (!apiKey || !baseUrl || !model) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Prepare the prompt for AI
    const prompt = `You are a design expert helping users create text-shaped image layouts. 
    The user wants to arrange ${imageCount} images to form the text "${text}".
    
    Please provide:
    1. Design suggestions for the layout
    2. Layout advice based on the number of images
    3. Three font recommendations that would work well
    
    Respond in JSON format with keys: suggestions, layoutAdvice, fontRecommendations`;

    try {
      // Call OpenRouter API
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
          'X-Title': 'Text-Shaped Image Merge App',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const aiResponse = await response.json();
      const aiContent = aiResponse.choices?.[0]?.message?.content;

      if (!aiContent) {
        throw new Error('No content in AI response');
      }

      // Try to parse AI response as JSON, fallback to mock response
      let aiDesignResponse: AIDesignResponse;
      try {
        aiDesignResponse = JSON.parse(aiContent);
      } catch {
        // Fallback to mock response if AI doesn't return valid JSON
        aiDesignResponse = generateMockResponse({ text, imageCount });
      }

      return NextResponse.json(aiDesignResponse);

    } catch (aiError) {
      console.error('AI API call failed:', aiError);
      
      // Return mock response as fallback
      const mockResponse = generateMockResponse({ text, imageCount });
      return NextResponse.json(mockResponse);
    }

  } catch (error) {
    console.error('API route error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generate mock response for fallback
 */
function generateMockResponse({ text, imageCount }: { text: string; imageCount: number }): AIDesignResponse {
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