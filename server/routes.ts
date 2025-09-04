import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { aiService } from "./services/ai-service";
import { ScreeningService } from "./services/screening";
import { CrisisService } from "./services/crisis";
import { 
  insertUserSchema, 
  insertScreeningAssessmentSchema,
  insertAppointmentSchema,
  insertForumPostSchema,
  insertForumReplySchema,
  insertMoodEntrySchema
} from "@shared/schema";
import { z } from "zod";

// WebSocket connection management
const wsConnections = new Map<string, WebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws' 
  });

  wss.on('connection', (ws: WebSocket, req) => {
    const userId = req.url?.split('userId=')[1];
    if (userId) {
      wsConnections.set(userId, ws);
      console.log(`WebSocket connected for user: ${userId}`);
    }

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'chat_message' && userId) {
          // Process chat message with AI
          const response = await aiService.generateResponse([
            ...data.chatHistory || [],
            { role: 'user', content: data.message, timestamp: new Date() }
          ], data.personality);

          // Check for crisis indicators
          await CrisisService.evaluateChatMessage(userId, data.message);

          // Send AI response back
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'chat_response',
              message: response.message,
              supportiveActions: response.supportiveActions,
              riskLevel: response.riskLevel,
              escalationRequired: response.escalationRequired
            }));
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (userId) {
        wsConnections.delete(userId);
        console.log(`WebSocket disconnected for user: ${userId}`);
      }
    });
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Screening routes
  app.get("/api/screening/questions/:type", async (req, res) => {
    try {
      const { type } = req.params;
      if (type !== "PHQ9" && type !== "GAD7") {
        return res.status(400).json({ message: "Invalid screening type" });
      }
      
      const questions = ScreeningService.getScreeningQuestions(type);
      const options = ScreeningService.getResponseOptions();
      
      res.json({ questions, options });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/screening/submit", async (req, res) => {
    try {
      const assessmentData = insertScreeningAssessmentSchema.parse(req.body);
      
      // Calculate score based on type
      let result;
      if (assessmentData.type === "PHQ9") {
        result = ScreeningService.calculatePHQ9Score(assessmentData.responses as number[]);
      } else if (assessmentData.type === "GAD7") {
        result = ScreeningService.calculateGAD7Score(assessmentData.responses as number[]);
      } else {
        return res.status(400).json({ message: "Invalid screening type" });
      }

      // Save assessment
      const assessment = await storage.createScreeningAssessment({
        ...assessmentData,
        totalScore: result.totalScore,
        riskLevel: result.riskLevel,
        isHighRisk: result.isHighRisk,
      });

      // Check for crisis intervention
      await CrisisService.evaluateScreeningResult(
        assessmentData.userId,
        assessmentData.type,
        result.totalScore,
        result.isHighRisk,
        result.isCrisis
      );

      res.json({ assessment, result });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/screening/history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { type } = req.query;
      
      const history = await storage.getUserScreeningHistory(userId, type as string);
      res.json(history);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Chat routes
  app.post("/api/chat/session", async (req, res) => {
    try {
      const { userId } = req.body;
      const session = await storage.createChatSession(userId);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/chat/session/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.getChatSession(id);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/chat/guided-exercise", async (req, res) => {
    try {
      const { type } = req.body;
      const steps = await aiService.generateGuidedExercise(type);
      res.json({ steps });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Custom AI Personality Routes
  app.post("/api/chat/custom-personality", async (req, res) => {
    try {
      const { userId, name, chatData, description } = req.body;
      
      // Process chat data to create personality
      const customPrompt = `Based on this chat conversation, adopt the personality and speech patterns shown:
      
${chatData}

Key traits to emulate:
- Speaking style and tone
- Common phrases and expressions  
- Response patterns and personality quirks
- Emotional expressions and reactions

Maintain the core therapeutic and supportive role while incorporating this personality style.`;

      const personality = {
        id: `custom_${Date.now()}`,
        name: name || "Custom AI",
        description: description || "AI trained on uploaded conversations",
        customPrompt,
        userId,
        createdAt: new Date()
      };

      // Save to storage (you might want to add this to your database schema)
      await storage.createCustomPersonality?.(personality) || 
            console.log("Custom personality created:", personality.id);
      
      res.json({ success: true, personality });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/chat/custom-personalities/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Get custom personalities for user (placeholder - implement based on your storage)
      const personalities = await storage.getUserCustomPersonalities?.(userId) || [];
      
      res.json(personalities);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Counselor and appointment routes
  app.get("/api/counselors", async (req, res) => {
    try {
      const counselors = await storage.getCounselors();
      res.json(counselors);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/appointments/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const appointments = await storage.getUserAppointments(userId);
      res.json(appointments);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Forum routes
  app.get("/api/forum/posts", async (req, res) => {
    try {
      const { category } = req.query;
      const posts = await storage.getForumPosts(category as string);
      res.json(posts);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/forum/posts", async (req, res) => {
    try {
      const postData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(postData);
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/forum/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.getForumPostWithReplies(id);
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/forum/posts/:id/replies", async (req, res) => {
    try {
      const { id } = req.params;
      const replyData = insertForumReplySchema.parse({
        ...req.body,
        postId: id
      });
      const reply = await storage.createForumReply(replyData);
      res.json(reply);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/forum/posts/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.likeForumPost(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Resources routes
  app.get("/api/resources", async (req, res) => {
    try {
      const { category, language } = req.query;
      const resources = await storage.getResources(category as string, language as string);
      res.json(resources);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const resource = await storage.getResourceById(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      res.json(resource);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/resources/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.likeResource(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Mood tracking routes
  app.post("/api/mood", async (req, res) => {
    try {
      const moodData = insertMoodEntrySchema.parse(req.body);
      const mood = await storage.createMoodEntry(moodData);
      res.json(mood);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/mood/history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { days } = req.query;
      const history = await storage.getUserMoodHistory(userId, days ? parseInt(days as string) : 7);
      res.json(history);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Crisis management routes
  app.get("/api/crisis/resources", async (req, res) => {
    try {
      const resources = await CrisisService.getCrisisResources();
      res.json(resources);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/crisis/alerts", async (req, res) => {
    try {
      const alerts = await storage.getActiveCrisisAlerts();
      res.json(alerts);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/crisis/alerts/:id/resolve", async (req, res) => {
    try {
      const { id } = req.params;
      const { resolvedBy, notes } = req.body;
      
      await CrisisService.resolveCrisisAlert(id, resolvedBy, notes);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Peer Calling Routes
  app.get("/api/peer-calling/available-peers/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Mock available peers with anxiety compatibility
      const mockPeers = [
        {
          id: "peer-1",
          firstName: "Anonymous",
          lastName: "Student",
          institution: "Delhi University",
          year: 2,
          anxietyLevel: "moderate",
          isOnline: true,
          matchScore: 92,
          languages: ["English", "Hindi"],
          interests: ["Study stress", "Social anxiety"],
          lastOnline: new Date().toISOString(),
        },
        {
          id: "peer-2", 
          firstName: "Anonymous",
          lastName: "Peer",
          institution: "IIT Mumbai",
          year: 3,
          anxietyLevel: "high",
          isOnline: true,
          matchScore: 87,
          languages: ["English", "Marathi"],
          interests: ["Exam stress", "Career anxiety"],
          lastOnline: new Date().toISOString(),
        },
        {
          id: "peer-3",
          firstName: "Anonymous",
          lastName: "Helper",
          institution: "Chennai College",
          year: 1,
          anxietyLevel: "mild",
          isOnline: true,
          matchScore: 78,
          languages: ["English", "Tamil"],
          interests: ["Social anxiety", "Family pressure"],
          lastOnline: new Date().toISOString(),
        }
      ];
      
      res.json(mockPeers);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/peer-calling/find-peer", async (req, res) => {
    try {
      const { userId, type, anxietyLevel } = req.body;
      
      // Simulate finding a peer
      setTimeout(() => {
        const mockSession = {
          sessionId: `session-${Date.now()}`,
          partnerId: `peer-${Math.floor(Math.random() * 1000)}`,
          partnerName: "Anonymous Student",
          type: type,
        };
        
        res.json(mockSession);
      }, 1000); // Simulate search time
      
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/peer-calling/end-call/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      // Mock ending call
      res.json({ 
        success: true, 
        message: "Call ended successfully",
        duration: Math.floor(Math.random() * 30) + 5 // 5-35 minutes
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/peer-calling/history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Mock call history
      const mockHistory = [
        {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
          duration: 15,
          type: "audio",
          partnerId: "anonymous",
        },
        {
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          duration: 22,
          type: "video", 
          partnerId: "anonymous",
        },
        {
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
          duration: 8,
          type: "audio",
          partnerId: "anonymous",
        }
      ];
      
      res.json(mockHistory);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Analytics routes (admin only)
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  return httpServer;
}
