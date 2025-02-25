import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateCode(prompt: string): Promise<string> {
  try {
    // Format the prompt for better code generation
    const formattedPrompt = `
You are an expert programmer. Generate code for the following task:
${prompt}

Requirements:
- Write complete, working code
- Include necessary imports
- Add comments explaining the code
- Follow best practices
- Return ONLY the code, no explanations

Code:`;

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content
    const result = await model.generateContent(formattedPrompt);
    const response = await result.response;
    let generatedCode = response.text();

    // Clean up the generated code
    if (generatedCode.startsWith('```')) {
      const matches = generatedCode.match(/```(?:\w+)?\n([\s\S]+?)```/);
      generatedCode = matches ? matches[1].trim() : generatedCode;
    }

    // If no code was generated, throw an error
    if (!generatedCode) {
      throw new Error('No code was generated. Please try a different prompt.');
    }

    return generatedCode;
  } catch (error) {
    console.error('Error generating code:', error);
    
    if (error instanceof Error) {
      // Handle specific Gemini API errors
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your Gemini API key configuration.');
      }
      if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      }
      throw new Error(`Failed to generate code: ${error.message}`);
    }
    
    throw new Error('Failed to generate code. Please try again with a more specific prompt.');
  }
}