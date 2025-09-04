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
      console.warn("Config file not found, using defaults");
      this.config = {
        ai_provider: "gemini",
        openai_api_key: process.env.OPENAI_API_KEY || "your-openai-key-here",
        gemini_api_key: process.env.GEMINI_API_KEY || "your-gemini-key-here",
        current_model: "gemini-2.5-flash",
        fallback_model: "gpt-4",
        max_tokens: 2000,
        temperature: 0.7
      };
    }
  }

  private initializeProviders() {
    try {
      if (this.config.ai_provider === "openai" && this.config.openai_api_key && this.config.openai_api_key !== "your-openai-key-here") {
        this.openai = new OpenAI({ 
          apiKey: this.config.openai_api_key 
        });
      }
      
      if (this.config.ai_provider === "gemini" && this.config.gemini_api_key && this.config.gemini_api_key !== "your-gemini-key-here") {
        this.gemini = new GoogleGenAI({ 
          apiKey: this.config.gemini_api_key 
        });
      }
    } catch (error) {
      console.warn("AI providers not initialized, using fallback responses");
    }
  }

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

  async generateResponse(messages: ChatMessage[], personality?: any): Promise<PsychologicalResponse> {
    try {
      let personalityPrompt = this.systemPrompt;
      
      if (personality && personality.customPrompt) {
        personalityPrompt += `\n\nAdditional personality instructions: ${personality.customPrompt}`;
      }

      if (this.config.ai_provider === "gemini" && this.gemini) {
        return await this.generateGeminiResponse(messages, personalityPrompt);
      } else if (this.config.ai_provider === "openai" && this.openai) {
        return await this.generateOpenAIResponse(messages, personalityPrompt);
      } else {
        throw new Error("No AI provider configured");
      }
    } catch (error) {
      console.error("AI API error:", error);
      return this.getFallbackResponse(personality);
    }
  }

  private async generateGeminiResponse(messages: ChatMessage[], systemPrompt: string): Promise<PsychologicalResponse> {
    const conversationText = messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    const prompt = `${systemPrompt}\n\nConversation:\n${conversationText}\n\nPlease respond in JSON format as specified.`;

    const response = await this.gemini!.models.generateContent({
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

    const result = JSON.parse(response.text || "{}");
    
    return {
      message: result.message || "I'm here to support you. Could you tell me more about how you're feeling?",
      supportiveActions: result.supportiveActions || [
        "Take 5 deep breaths slowly",
        "Talk to a trusted friend or counselor",
        "Practice a grounding exercise"
      ],
      riskLevel: result.riskLevel || "low",
      escalationRequired: result.escalationRequired || false,
    };
  }

  private async generateOpenAIResponse(messages: ChatMessage[], systemPrompt: string): Promise<PsychologicalResponse> {
    const response = await this.openai!.chat.completions.create({
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

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      message: result.message || "I'm here to support you. Could you tell me more about how you're feeling?",
      supportiveActions: result.supportiveActions || [
        "Take 5 deep breaths slowly",
        "Talk to a trusted friend or counselor",
        "Practice a grounding exercise"
      ],
      riskLevel: result.riskLevel || "low",
      escalationRequired: result.escalationRequired || false,
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