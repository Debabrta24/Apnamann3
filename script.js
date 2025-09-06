// Global State
let currentUser = null;
let selectedPersonality = null;
let chatMessages = [];
let isLoggedIn = false;

// Personality data
const personalities = {
    therapist: {
        id: 'therapist',
        name: 'Dr. Sarah',
        role: 'Cognitive Therapist',
        description: 'Specializes in CBT and helps with anxiety, depression, and negative thought patterns',
        avatar: '👩‍⚕️',
        className: 'therapist',
        responses: [
            "I understand this is difficult for you. Let's explore these feelings together.",
            "What thoughts are going through your mind when you feel this way?",
            "It's completely normal to feel overwhelmed sometimes. You're taking a positive step by reaching out.",
            "Let's try to identify any patterns in your thinking that might be contributing to these feelings.",
            "Remember, healing is a process, and you're doing great by being here."
        ]
    },
    coach: {
        id: 'coach',
        name: 'Alex',
        role: 'Life Coach',
        description: 'Motivational support for goal-setting, productivity, and personal growth',
        avatar: '💪',
        className: 'coach',
        responses: [
            "You've got this! What's one small step you can take today toward your goal?",
            "Every challenge is an opportunity to grow stronger. How can we turn this into a win?",
            "I believe in your potential. Let's create a plan to unlock it!",
            "Progress isn't always linear, but you're moving forward. That's what matters!",
            "What would success look like for you in this situation?"
        ]
    },
    mindfulness: {
        id: 'mindfulness',
        name: 'Zen',
        role: 'Mindfulness Guide',
        description: 'Meditation teacher focused on present-moment awareness and stress reduction',
        avatar: '🧘',
        className: 'mindfulness',
        responses: [
            "Take a deep breath with me. Notice how your body feels in this moment.",
            "Let's pause and observe these thoughts without judgment. They're just thoughts.",
            "In this present moment, you are safe. You are enough.",
            "Like clouds passing in the sky, these feelings will come and go.",
            "What do you notice when you bring your attention to your breath?"
        ]
    }
};

// Quick action responses
const quickActionResponses = {
    breathing: "Let's do a simple breathing exercise together. Find a comfortable position and breathe in slowly for 4 counts... hold for 4... and breathe out for 6. Let's repeat this 5 times. Feel free to share how you're feeling after.",
    journal: "Journaling is a wonderful way to process emotions. What's on your mind today? Feel free to share any thoughts, feelings, or experiences you'd like to explore.",
    relaxation: "Let's try progressive muscle relaxation. Start by tensing and then relaxing each muscle group: Begin with your toes, then your calves, thighs, abdomen, hands, arms, shoulders, and finally your face. Hold the tension for 5 seconds, then release. How does your body feel?",
    emergency: "I hear that you need immediate support. Please know that you're not alone. Here are some resources that can help:\n\n🚨 Campus Crisis Helpline: 1800-123-4567\n🚨 National Mental Health Helpline: 1800-891-4416\n\nIf you're in immediate danger, please call emergency services or go to your nearest emergency room. Is there anything I can help you with while you decide on next steps?"
};

// Initialize Lucide icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeLucideIcons();
    setupEventListeners();
    showLoginScreen();
});

// Setup event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Navigation buttons
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            navigateTo(page);
        });
    });

    // Personality selection
    const personalityCards = document.querySelectorAll('.personality-card');
    personalityCards.forEach(card => {
        card.addEventListener('click', () => {
            const personalityId = card.dataset.personality;
            selectPersonality(personalityId);
        });
    });

    // Chat input
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('input', autoResize);
    }
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate login
    currentUser = {
        id: 'user-123',
        firstName: email.split('@')[0],
        email: email,
        institution: 'University of Excellence',
        course: 'Computer Science',
        year: '3rd Year'
    };
    
    isLoggedIn = true;
    showMainApp();
}

function logout() {
    currentUser = null;
    isLoggedIn = false;
    selectedPersonality = null;
    chatMessages = [];
    showLoginScreen();
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('password-toggle-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.setAttribute('data-lucide', 'eye-off');
    } else {
        passwordInput.type = 'password';
        toggleIcon.setAttribute('data-lucide', 'eye');
    }
    
    initializeLucideIcons();
}

// UI State Management
function showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
}

function showMainApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    
    // Update user name in welcome section
    const userNameSpan = document.getElementById('user-name');
    if (userNameSpan && currentUser) {
        userNameSpan.textContent = currentUser.firstName;
    }
    
    // Update profile page
    updateProfilePage();
    
    // Navigate to dashboard
    navigateTo('dashboard');
}

function updateProfilePage() {
    if (!currentUser) return;
    
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    
    if (profileName) profileName.textContent = `${currentUser.firstName} ${currentUser.lastName || ''}`;
    if (profileEmail) profileEmail.textContent = currentUser.email;
}

// Navigation
function navigateTo(page) {
    // Update navigation buttons
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === page) {
            btn.classList.add('active');
        }
    });
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Special handling for chat page
    if (page === 'chat') {
        showPersonalitySelection();
    }
}

// Personality Selection
function showPersonalitySelection() {
    const personalitySection = document.getElementById('personality-selection');
    const chatInterface = document.getElementById('chat-interface');
    
    if (personalitySection && chatInterface) {
        personalitySection.classList.remove('hidden');
        chatInterface.classList.add('hidden');
    }
}

function selectPersonality(personalityId) {
    selectedPersonality = personalities[personalityId];
    if (!selectedPersonality) return;
    
    // Hide personality selection and show chat
    const personalitySection = document.getElementById('personality-selection');
    const chatInterface = document.getElementById('chat-interface');
    
    if (personalitySection && chatInterface) {
        personalitySection.classList.add('hidden');
        chatInterface.classList.remove('hidden');
    }
    
    // Update current AI display
    updateCurrentAIDisplay();
    
    // Clear previous messages and add welcome message
    clearChat();
    addWelcomeMessage();
}

function startChatWithDefault() {
    selectPersonality('therapist');
}

function changePersonality() {
    showPersonalitySelection();
}

function updateCurrentAIDisplay() {
    if (!selectedPersonality) return;
    
    // Update main chat header
    const currentAIName = document.getElementById('current-ai-name');
    const currentAIRole = document.getElementById('current-ai-role');
    const currentAIAvatar = document.getElementById('current-ai-avatar');
    
    if (currentAIName) currentAIName.textContent = selectedPersonality.name;
    if (currentAIRole) currentAIRole.textContent = selectedPersonality.role;
    if (currentAIAvatar) {
        currentAIAvatar.textContent = selectedPersonality.avatar;
        currentAIAvatar.className = `avatar-bg ${selectedPersonality.className}`;
    }
    
    // Update sidebar AI info
    const sidebarAIName = document.getElementById('sidebar-ai-name');
    const sidebarAIRole = document.getElementById('sidebar-ai-role');
    const sidebarAIDescription = document.getElementById('sidebar-ai-description');
    const sidebarAIAvatar = document.getElementById('sidebar-ai-avatar');
    
    if (sidebarAIName) sidebarAIName.textContent = selectedPersonality.name;
    if (sidebarAIRole) sidebarAIRole.textContent = selectedPersonality.role;
    if (sidebarAIDescription) sidebarAIDescription.textContent = selectedPersonality.description;
    if (sidebarAIAvatar) {
        sidebarAIAvatar.textContent = selectedPersonality.avatar;
        sidebarAIAvatar.className = `avatar-bg ${selectedPersonality.className}`;
    }
}

// Chat Functionality
function addWelcomeMessage() {
    if (!selectedPersonality) return;
    
    const welcomeMessages = {
        therapist: `Hello! I'm Dr. Sarah, your cognitive therapist. I'm here to provide you with professional, empathetic support using evidence-based approaches. How can I help you today?`,
        coach: `Hey there! I'm Alex, your life coach. I'm excited to help you set goals, overcome challenges, and unlock your full potential. What would you like to work on today?`,
        mindfulness: `Greetings. I'm Zen, your mindfulness guide. Let's create a space of peace and awareness together. Take a moment to breathe deeply. What brings you here today?`
    };
    
    const message = welcomeMessages[selectedPersonality.id] || welcomeMessages.therapist;
    addMessage('assistant', message);
}

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage('user', message);
    
    // Clear input
    chatInput.value = '';
    autoResize();
    
    // Simulate AI response after a delay
    setTimeout(() => {
        generateAIResponse(message);
    }, 1000 + Math.random() * 2000); // 1-3 second delay
}

function addMessage(role, content) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${role}`;
    
    if (role === 'assistant') {
        messageElement.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-bg ${selectedPersonality ? selectedPersonality.className : 'therapist'}">
                    ${selectedPersonality ? selectedPersonality.avatar : '👩‍⚕️'}
                </div>
            </div>
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
    } else {
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    if (!selectedPersonality) return;
    
    // Simple keyword-based responses
    const lowerMessage = userMessage.toLowerCase();
    let response;
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
        response = selectedPersonality.id === 'therapist' 
            ? "I hear that you're feeling anxious. Anxiety is a very common experience, especially among students. Can you tell me more about what specific situations or thoughts trigger these feelings for you?"
            : selectedPersonality.id === 'mindfulness'
            ? "Anxiety can feel overwhelming, but remember that this feeling is temporary. Let's try a grounding technique: name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste."
            : "I understand anxiety can be challenging. Let's focus on what you can control right now. What's one small action you could take today that might help you feel more empowered?";
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
        response = selectedPersonality.id === 'therapist'
            ? "Thank you for sharing that you're feeling down. It takes courage to acknowledge these feelings. Depression can make everything feel more difficult. What has your experience been like lately?"
            : selectedPersonality.id === 'coach'
            ? "I hear you're going through a tough time. Even small steps forward count as progress. What's one thing that used to bring you joy that we could explore together?"
            : "When we feel heavy with sadness, it's important to be gentle with ourselves. Your feelings are valid. What would self-compassion look like for you right now?";
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
        response = selectedPersonality.id === 'coach'
            ? "Feeling overwhelmed is a sign that you care deeply about your responsibilities. Let's break things down into manageable pieces. What's the most important thing on your plate right now?"
            : selectedPersonality.id === 'mindfulness'
            ? "When we feel overwhelmed, our minds often jump between past and future. Let's return to the present moment. Take three deep breaths with me and notice how your body feels right now."
            : "Stress and feeling overwhelmed are very common experiences in college. It sounds like you're carrying a lot. What support systems do you currently have in place?";
    } else if (lowerMessage.includes('exam') || lowerMessage.includes('study') || lowerMessage.includes('test')) {
        response = selectedPersonality.id === 'coach'
            ? "Academic pressure is real! Let's create a study strategy that works for you. What's your biggest challenge with studying right now - time management, focus, or something else?"
            : selectedPersonality.id === 'therapist'
            ? "Academic stress can trigger a lot of difficult emotions. Many students struggle with perfectionism and fear of failure. What thoughts go through your mind when you think about your exams?"
            : "Studying can be stressful, but remember to balance effort with self-care. Have you been taking breaks and getting enough rest? Your wellbeing matters as much as your grades.";
    } else {
        // Use random response from personality
        const responses = selectedPersonality.responses;
        response = responses[Math.floor(Math.random() * responses.length)];
    }
    
    addMessage('assistant', response);
}

function clearChat() {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
    }
}

function triggerQuickAction(action) {
    const response = quickActionResponses[action];
    if (response) {
        addMessage('assistant', response);
    }
}

// Chat input auto-resize
function autoResize() {
    const textarea = document.getElementById('chat-input');
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 96) + 'px';
}

function handleChatKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Screening functionality
function startScreening(type) {
    let message = '';
    
    if (type === 'phq9') {
        message = "I'll guide you through the PHQ-9 depression screening. This questionnaire asks about your feelings and experiences over the past two weeks. Please answer honestly - this information is confidential and will help us understand how you've been feeling.\n\nOver the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?\n\n1. Not at all\n2. Several days  \n3. More than half the days\n4. Nearly every day\n\nPlease respond with a number 1-4.";
    } else if (type === 'gad7') {
        message = "Let's begin the GAD-7 anxiety screening. This will help assess any anxiety symptoms you may be experiencing. Remember, this is confidential and designed to help you.\n\nOver the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?\n\n1. Not at all\n2. Several days\n3. More than half the days  \n4. Nearly every day\n\nPlease respond with a number 1-4.";
    }
    
    navigateTo('chat');
    
    // Wait for chat to load, then start screening
    setTimeout(() => {
        if (!selectedPersonality) {
            selectPersonality('therapist');
        }
        setTimeout(() => {
            addMessage('assistant', message);
        }, 500);
    }, 100);
}

// Dashboard interactions
function showMoodTracker() {
    navigateTo('chat');
    setTimeout(() => {
        if (!selectedPersonality) {
            selectPersonality('mindfulness');
        }
        setTimeout(() => {
            addMessage('assistant', "Let's check in with your mood today. On a scale of 1-10, how would you rate your overall emotional state right now? 1 being very low/difficult, and 10 being very positive/energetic. Also feel free to share any specific emotions you're experiencing.");
        }, 500);
    }, 100);
}

function showCommunity() {
    alert('Community features are coming soon! This will include anonymous peer support groups, discussion forums, and shared experiences from other students.');
}

// Utility functions
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'};
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e);
});

// Prevent form submission if enter is pressed (except in chat)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.id !== 'chat-input') {
        const form = e.target.closest('form');
        if (form && form.id !== 'login-form') {
            e.preventDefault();
        }
    }
});

// Initialize icons after any dynamic content changes
function refreshIcons() {
    setTimeout(() => {
        initializeLucideIcons();
    }, 100);
}