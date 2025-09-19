import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const getOpenAIApiKey = () => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!apiKey && isProduction) {
    console.error("Critical production error: OpenAI API key not found in environment variables");
    return null;
  }
  
  return apiKey || "your-api-key-here";
};

const apiKey = getOpenAIApiKey();
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

export interface PsychologicalResponse {
  message: string;
  supportiveActions: string[];
  riskLevel: "low" | "moderate" | "high";
  escalationRequired: boolean;
}

export class OpenAIService {
  private systemPrompt = `You are a compassionate AI assistant providing psychological first aid for Indian college students. Your role is to:

1. Listen empathetically and validate feelings
2. Provide evidence-based coping strategies
3. Guide users through breathing exercises, mindfulness, and relaxation techniques
4. Offer study stress management and academic pressure support
5. Encourage professional help when needed
6. Detect crisis situations and recommend immediate intervention

Guidelines:
- Be warm, culturally sensitive, and non-judgmental
- Use simple, supportive language
- Provide practical, actionable advice
- Always emphasize that you're not a replacement for professional care
- If you detect high-risk language (self-harm, suicide ideation), immediately recommend crisis resources
- Be aware of Indian cultural contexts and academic pressures

Response format: Always respond with JSON containing:
- message: Your supportive response
- supportiveActions: Array of 2-3 specific actions the user can take
- riskLevel: "low", "moderate", or "high"
- escalationRequired: boolean (true if immediate professional help needed)`;

  async generateResponse(messages: ChatMessage[]): Promise<PsychologicalResponse> {
    if (!openai) {
      return this.getFallbackResponse();
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: this.systemPrompt },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1000,
      });

      let result = {};
      try {
        result = JSON.parse(response.choices[0].message.content || "{}");
      } catch (parseError) {
        console.error("Failed to parse OpenAI response JSON:", parseError);
        result = {};
      }
      
      return {
        message: (result as any).message || "I'm here to support you. Could you tell me more about how you're feeling?",
        supportiveActions: (result as any).supportiveActions || [
          "Take 5 deep breaths slowly",
          "Talk to a trusted friend or counselor",
          "Practice a grounding exercise"
        ],
        riskLevel: (result as any).riskLevel || "low",
        escalationRequired: (result as any).escalationRequired || false,
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      
      // Fallback response for API failures
      return {
        message: "I'm here to listen and support you. While I'm having technical difficulties right now, please know that your feelings are valid and help is available.",
        supportiveActions: [
          "Contact campus counseling services",
          "Call the crisis helpline: +91-9876543210",
          "Reach out to a trusted friend or family member"
        ],
        riskLevel: "moderate",
        escalationRequired: false,
      };
    }
  }

  async analyzeForCrisis(message: string): Promise<{ isHighRisk: boolean; severity: "high" | "critical" }> {
    if (!openai) {
      // Default to high risk if OpenAI is not available
      return { isHighRisk: true, severity: "high" };
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `Analyze this message for crisis indicators. Look for:
            - Suicide ideation or self-harm mentions
            - Feelings of hopelessness or worthlessness
            - Substance abuse references
            - Social isolation or withdrawal
            - Academic failure leading to despair
            
            Respond with JSON: { "isHighRisk": boolean, "severity": "high" | "critical" }`
          },
          { role: "user", content: message }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      let result = {};
      try {
        result = JSON.parse(response.choices[0].message.content || "{}");
      } catch (parseError) {
        console.error("Failed to parse crisis analysis JSON:", parseError);
        result = {};
      }
      return {
        isHighRisk: (result as any).isHighRisk || false,
        severity: (result as any).severity || "high",
      };
    } catch (error) {
      console.error("Crisis analysis error:", error);
      // Err on the side of caution
      return { isHighRisk: true, severity: "high" };
    }
  }

  async generateGuidedExercise(type: "breathing" | "relaxation" | "mindfulness"): Promise<string[]> {
    if (!openai) {
      return ["Take a moment to breathe slowly", "Focus on the present moment", "Remember that this feeling will pass"];
    }
    
    try {
      const prompts = {
        breathing: "Generate step-by-step instructions for the 4-7-8 breathing technique for exam stress",
        relaxation: "Create a progressive muscle relaxation guide for college students",
        mindfulness: "Provide a 5-minute mindfulness exercise for academic anxiety"
      };

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `You are a mindfulness instructor. Provide clear, step-by-step instructions in JSON format: { "steps": ["step1", "step2", ...] }`
          },
          { role: "user", content: prompts[type] }
        ],
        response_format: { type: "json_object" },
      });

      let result = {};
      try {
        result = JSON.parse(response.choices[0].message.content || "{}");
      } catch (parseError) {
        console.error("Failed to parse exercise JSON:", parseError);
        result = {};
      }
      return (result as any).steps || ["Focus on your breathing", "Take slow, deep breaths", "Notice how you feel"];
    } catch (error) {
      console.error("Exercise generation error:", error);
      return ["Take a moment to breathe slowly", "Focus on the present moment", "Remember that this feeling will pass"];
    }
  }

  private getFallbackResponse(): PsychologicalResponse {
    return {
      message: "I'm here to listen and support you. While I'm having technical difficulties right now, please know that your feelings are valid and help is available.",
      supportiveActions: [
        "Contact campus counseling services",
        "Call the crisis helpline: +91-9876543210",
        "Reach out to a trusted friend or family member"
      ],
      riskLevel: "moderate",
      escalationRequired: false,
    };
  }
}

export const openaiService = new OpenAIService();
