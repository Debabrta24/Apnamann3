import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

interface AIConfig {
  ai_provider: "openai" | "gemini";
  openai_api_key: string;
  gemini_api_key: string;
  current_model: string;
  fallback_model: string;
  max_tokens: number;
  temperature: number;
}

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

export class AIService {
  private config!: AIConfig;
  private openai?: OpenAI;
  private gemini?: GoogleGenAI;

  constructor() {
    this.loadConfig();
    this.initializeProviders();
  }

  private loadConfig() {
    try {
      const configPath = path.join(process.cwd(), 'config', 'api-config.json');
      const configData = fs.readFileSync(configPath, 'utf8');
      this.config = JSON.parse(configData);
    } catch (error) {
      // In production, we should have proper environment variables or config files
      const isProduction = process.env.NODE_ENV === 'production';
      
      this.config = {
        ai_provider: "gemini",
        openai_api_key: process.env.OPENAI_API_KEY || "",
        gemini_api_key: process.env.GEMINI_API_KEY || "",
        current_model: "gemini-2.5-flash",
        fallback_model: "gpt-4",
        max_tokens: 2000,
        temperature: 0.7
      };
      
      // Log warning in development, but error in production
      if (isProduction) {
        console.error("Production configuration issue: Config file not found and environment variables may be missing");
        if (!this.config.openai_api_key && !this.config.gemini_api_key) {
          throw new Error("At least one AI provider API key must be configured in production");
        }
      } else {
        console.warn("Config file not found, using development defaults. AI features may be limited without API keys.");
      }
    }
  }

  private initializeProviders() {
    const isProduction = process.env.NODE_ENV === 'production';
    
    try {
      if (this.config.ai_provider === "openai") {
        if (this.config.openai_api_key && this.config.openai_api_key !== "your-openai-key-here") {
          this.openai = new OpenAI({ 
            apiKey: this.config.openai_api_key 
          });
        } else if (isProduction) {
          console.error("Production error: OpenAI provider selected but no valid API key found");
        }
      }
      
      if (this.config.ai_provider === "gemini") {
        if (this.config.gemini_api_key && this.config.gemini_api_key !== "your-gemini-key-here") {
          this.gemini = new GoogleGenAI({ 
            apiKey: this.config.gemini_api_key 
          });
        } else if (isProduction) {
          console.error("Production error: Gemini provider selected but no valid API key found");
        }
      }
      
      // Check if any provider was successfully initialized
      if (isProduction && !this.openai && !this.gemini) {
        console.error("Critical production error: No AI providers could be initialized. Check API key configuration.");
      }
    } catch (error) {
      if (isProduction) {
        console.error("Failed to initialize AI providers:", error);
      } else {
        console.warn("AI providers not initialized, using fallback responses");
      }
    }
  }

  private getContextAwareSystemPrompt(messages: ChatMessage[]) {
    const basePrompt = `You are a compassionate AI assistant providing psychological first aid and basic medical guidance for Indian college students. Your role is to:

PSYCHOLOGICAL SUPPORT:
1. Listen empathetically and validate feelings
2. Provide evidence-based coping strategies for anxiety, depression, and stress
3. Guide users through breathing exercises, mindfulness, and relaxation techniques
4. Offer study stress management and academic pressure support
5. Detect crisis situations and recommend immediate intervention

MEDICAL GUIDANCE:
6. Provide basic health information and wellness tips
7. Recognize symptoms that require medical attention
8. Offer preventive health measures and lifestyle advice
9. Guide users to appropriate medical resources when needed
10. Support mental-physical health connection awareness

CULTURAL CONSIDERATIONS:
- Be aware of Indian cultural contexts, family pressures, and social stigmas
- Understand academic competition and career pressure in Indian education system
- Respect traditional healing practices while promoting evidence-based care
- Be sensitive to economic constraints in accessing healthcare

SAFETY GUIDELINES:
- Always emphasize that you're not a replacement for professional medical or psychological care
- For serious medical symptoms, immediately recommend consulting a doctor
- If you detect high-risk language (self-harm, suicide ideation), immediately recommend crisis resources
- Recognize emergency situations requiring immediate medical attention

CONVERSATION CONTEXT:
- Review the entire conversation history to understand the user's ongoing concerns
- Avoid repeating the same advice or information you've already given
- Build upon previous conversations and show continuity
- Acknowledge progress or changes since your last interaction
- Ask follow-up questions about previously discussed topics when appropriate
- Remember specific details the user has shared (symptoms, situations, feelings)

COMMUNICATION STYLE:
- Use warm, supportive, and non-judgmental language
- Provide practical, actionable advice
- Explain medical concepts in simple, understandable terms
- Offer both immediate relief strategies and long-term wellness plans
- Vary your responses to avoid repetitive language
- Show genuine engagement with the user's unique situation

Response format: Always respond with JSON containing:
- message: Your supportive response with medical/psychological guidance (tailored to conversation context)
- supportiveActions: Array of 2-3 specific actions the user can take (building on previous suggestions)
- riskLevel: "low", "moderate", or "high" (considering both psychological and physical health risks)
- escalationRequired: boolean (true if immediate professional help needed)`;

    // Add conversation context analysis
    if (messages.length > 2) {
      const recentTopics = this.analyzeConversationContext(messages);
      return basePrompt + `\n\nCONVERSATION CONTEXT ANALYSIS:\n${recentTopics}`;
    }

    return basePrompt;
  }

  private analyzeConversationContext(messages: ChatMessage[]): string {
    const userMessages = messages.filter(m => m.role === 'user').slice(-3);
    const assistantMessages = messages.filter(m => m.role === 'assistant').slice(-2);
    
    let context = '';
    
    if (userMessages.length > 0) {
      context += `Recent user concerns: ${userMessages.map(m => m.content.substring(0, 100)).join('; ')}\n`;
    }
    
    if (assistantMessages.length > 0) {
      context += `Previous advice given: Avoid repeating these exact suggestions - ${assistantMessages.map(m => {
        try {
          const parsed = JSON.parse(m.content);
          return parsed.supportiveActions?.join(', ') || '';
        } catch {
          return m.content.substring(0, 100);
        }
      }).join('; ')}\n`;
    }
    
    context += `Remember to acknowledge any progress and build upon the ongoing conversation.`;
    
    return context;
  }

  async generateResponse(messages: ChatMessage[], personality?: any): Promise<PsychologicalResponse> {
    try {
      let personalityPrompt = this.getContextAwareSystemPrompt(messages);
      
      if (personality && personality.customPrompt) {
        personalityPrompt += `\n\nAdditional personality instructions: ${personality.customPrompt}`;
      }

      // Check if we have a functioning AI provider
      if (this.config.ai_provider === "gemini" && this.gemini) {
        return await this.generateGeminiResponse(messages, personalityPrompt);
      } else if (this.config.ai_provider === "openai" && this.openai) {
        return await this.generateOpenAIResponse(messages, personalityPrompt);
      } else {
        // No valid provider available, use fallback
        console.warn("No AI provider available, using fallback response");
        return this.getFallbackResponse(personality);
      }
    } catch (error) {
      console.error("AI API error:", error);
      return this.getFallbackResponse(personality);
    }
  }

  private async generateGeminiResponse(messages: ChatMessage[], systemPrompt: string): Promise<PsychologicalResponse> {
    if (!this.gemini) {
      throw new Error("Gemini provider not initialized");
    }
    
    const conversationText = messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    const prompt = `${systemPrompt}\n\nConversation:\n${conversationText}\n\nPlease respond in JSON format as specified.`;

    const response = await this.gemini.models.generateContent({
      model: this.config.current_model,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            message: { type: "string" },
            supportiveActions: { 
              type: "array",
              items: { type: "string" }
            },
            riskLevel: { 
              type: "string",
              enum: ["low", "moderate", "high"]
            },
            escalationRequired: { type: "boolean" }
          },
          required: ["message", "supportiveActions", "riskLevel", "escalationRequired"]
        }
      },
      contents: prompt
    });

    let result: any = {};
    try {
      result = JSON.parse(response.text || "{}");
    } catch (parseError) {
      console.error("Failed to parse Gemini response JSON:", parseError);
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
  }

  private async generateOpenAIResponse(messages: ChatMessage[], systemPrompt: string): Promise<PsychologicalResponse> {
    if (!this.openai) {
      throw new Error("OpenAI provider not initialized");
    }
    
    const response = await this.openai.chat.completions.create({
      model: this.config.current_model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      response_format: { type: "json_object" },
      temperature: this.config.temperature,
      max_tokens: this.config.max_tokens,
    });

    let result: any = {};
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
  }

  private getFallbackResponse(personality?: any): PsychologicalResponse {
    let message = "I'm here to listen and support you. Sometimes our systems need a moment to respond, but I want you to know that your feelings are valid and you're not alone. Can you tell me a bit about what's on your mind today?";
    
    if (personality?.name && personality.customPrompt) {
      message = `Hey there! I'm ${personality.name}, your personalized AI companion. I'm still learning from the conversations you shared with me, but I'm here to support you. What's on your mind today?`;
    }

    return {
      message,
      supportiveActions: [
        "Take a few deep, calming breaths",
        "Consider talking to someone you trust",
        "Try some light physical activity or stretching"
      ],
      riskLevel: "low",
      escalationRequired: false,
    };
  }

  async generateGuidedExercise(type: string): Promise<string[]> {
    const exercisePrompts = {
      breathing: [
        "Find a comfortable seated position and close your eyes",
        "Breathe in slowly through your nose for 4 counts",
        "Hold your breath gently for 4 counts",
        "Exhale slowly through your mouth for 6 counts",
        "Repeat this cycle 5 more times, focusing only on your breath"
      ],
      relaxation: [
        "Lie down comfortably and close your eyes",
        "Starting with your toes, tense the muscles for 5 seconds",
        "Release the tension and feel the relaxation",
        "Move up to your calves, thighs, abdomen, and so on",
        "Continue until you've relaxed your entire body"
      ],
      journal: [
        "Find a quiet space and get a pen and paper",
        "Write about how you're feeling right now",
        "Don't worry about grammar or structure",
        "Include what triggered these feelings",
        "End with one positive thing you can do for yourself today"
      ]
    };

    return exercisePrompts[type as keyof typeof exercisePrompts] || exercisePrompts.breathing;
  }

  // Method to reload config without restarting server
  reloadConfig() {
    this.loadConfig();
    this.initializeProviders();
  }
}

export const aiService = new AIService();