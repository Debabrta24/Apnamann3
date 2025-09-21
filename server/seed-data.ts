import { InsertSearchDoc } from '@shared/schema';

// Curated mental health resources for Indian college students
export const mentalHealthSeedData: InsertSearchDoc[] = [
  // Crisis Resources - India-specific
  {
    title: "Crisis Support - Indian Helplines",
    content: "If you are in immediate danger or having thoughts of self-harm, please reach out immediately. India Crisis Helplines: Kiran Mental Health Helpline: 1800-599-0019 (24/7, free, multilingual). iCall Psychosocial Helpline: 9152987821 (Mon-Sat, 8am-10pm). AASRA: 9820466726 (24/7). Emergency: 112. Campus Counseling Center: Contact your college's student support services. You are not alone and help is available.",
    source: "curated",
    tags: ["crisis", "emergency", "suicide prevention", "India", "helplines"]
  },
  
  // Academic Stress - Common in Indian education system
  {
    title: "Managing Academic Pressure and Exam Stress",
    content: "Academic pressure is intense in Indian colleges. Break large syllabi into smaller daily targets. Use active recall techniques instead of just reading. Practice previous years' papers. Take regular breaks using the Pomodoro Technique (25 min study, 5 min break). Don't compare your progress with others. Seek help from professors during doubt sessions. Remember that grades don't define your worth. Consider seeking counseling if stress becomes overwhelming.",
    source: "curated",
    tags: ["academic stress", "exam anxiety", "study techniques", "pressure", "college life"]
  },

  // Breathing Techniques
  {
    title: "प्राणायाम और Breathing Exercises for Anxiety",
    content: "Traditional pranayama and modern breathing techniques for anxiety relief. Anulom Vilom (Alternate Nostril Breathing): Close right nostril, inhale left for 4 counts, close left, exhale right for 4. Repeat 5-10 times. 4-7-8 Technique: Inhale for 4, hold for 7, exhale for 8. Box Breathing: Inhale 4, hold 4, exhale 4, hold 4. Practice these daily, especially before exams or stressful situations.",
    source: "curated",
    tags: ["anxiety", "breathing", "pranayama", "stress relief", "mindfulness", "Hindi"]
  },

  // Depression Awareness
  {
    title: "Understanding Depression in Indian College Students",
    content: "Depression among Indian students often goes unrecognized due to stigma. Symptoms include persistent sadness, loss of interest in studies/hobbies, changes in appetite or sleep, difficulty concentrating, feelings of guilt or worthlessness. It's not 'weakness' or 'western concept' - it's a real medical condition. Professional help through college counselors, psychiatrists, or online therapy is effective. Family support is important but professional help is crucial. Recovery is possible.",
    source: "curated",
    tags: ["depression", "mental health awareness", "stigma", "college students", "India"]
  },

  // Sleep and College Life
  {
    title: "Sleep Hygiene for Hostelers and Day Students",
    content: "Good sleep is crucial for mental health and academic performance. For hostel students: Use earplugs/eye mask for noisy environments. Establish consistent sleep schedule despite roommate schedules. Avoid screens 1 hour before sleep. Keep hostel room cool and dark. For day scholars: Maintain regular sleep despite travel time. Avoid late-night studying - early morning revision is more effective. Power naps (20-30 min) can help if sleep-deprived.",
    source: "curated",
    tags: ["sleep", "hostel life", "day scholar", "sleep hygiene", "academic performance"]
  },

  // Mindfulness and Meditation
  {
    title: "ध्यान (Dhyana) and Mindfulness for Students",
    content: "Meditation and mindfulness practices rooted in Indian tradition for modern student stress. Start with 5-10 minutes daily. Simple Dhyana: Sit comfortably, focus on breath, when mind wanders, gently return to breath. Walking meditation: Pay attention to each step while walking to class. Body scan: Mentally scan from head to toe, noticing tension. Apps: Headspace, Calm, or free guided meditations in Hindi on YouTube. Best times: Early morning or before sleep.",
    source: "curated",
    tags: ["meditation", "mindfulness", "dhyana", "stress relief", "focus", "Hindi", "tradition"]
  },

  // Family and Social Pressure
  {
    title: "Dealing with Family Expectations and Social Pressure",
    content: "Family pressure about career, marriage, comparisons with cousins/friends is common. Remember: Your life path doesn't have to match family expectations exactly. Communicate openly but respectfully with family about your feelings. Set boundaries on comparisons and criticism. Seek support from friends who understand similar pressures. Consider family counseling if communication breaks down. Your mental health matters as much as family honor.",
    source: "curated",
    tags: ["family pressure", "social expectations", "boundaries", "communication", "Indian families"]
  },

  // LGBTQ+ Support
  {
    title: "LGBTQ+ Mental Health Support in India",
    content: "Being LGBTQ+ in India can be challenging due to social stigma. You are valid and deserving of love and support. Resources: The Humsafar Trust, Nazariya (QPOC support), Sangama (Karnataka), Sappho for Equality (Kolkata). Online communities: Indian LGBTQ+ groups on Reddit, Facebook. Section 377 was struck down in 2018. Some colleges have LGBTQ+ support groups. If family isn't supportive, find chosen family in community. Professional counselors with LGBTQ+ training are available in major cities.",
    source: "curated",
    tags: ["LGBTQ+", "support", "community", "India", "discrimination", "chosen family"]
  },

  // Substance Use Awareness
  {
    title: "Substance Use and Mental Health Awareness",
    content: "College can involve peer pressure around alcohol, cigarettes, or other substances. Substance use often masks underlying anxiety or depression but makes mental health worse long-term. It's okay to say no to peer pressure. Alternative stress relief: Exercise, music, art, talking to friends. If you're using substances to cope with emotions, consider counseling. Alcohol in hostels is often prohibited and can lead to serious consequences. Focus on healthy coping mechanisms.",
    source: "curated",
    tags: ["substance use", "peer pressure", "alcohol", "coping mechanisms", "mental health"]
  },

  // Financial Stress
  {
    title: "Managing Financial Stress and Education Loans",
    content: "Financial worries are common among students with education loans or limited family income. Create a simple budget for essentials vs wants. Look into scholarships, merit-based aid, part-time work opportunities. Many colleges have financial aid counselors. Don't let financial stress overshadow your education - seek help early. Consider talking to family about realistic expectations. Remember that financial situation doesn't determine your worth or potential.",
    source: "curated",
    tags: ["financial stress", "education loans", "budget", "scholarships", "part-time work"]
  },

  // Relationship and Social Skills
  {
    title: "Building Healthy Relationships and Social Connections",
    content: "College relationships (friendships, romantic) are important for mental health. Healthy relationships involve mutual respect, trust, and communication. Red flags: Controlling behavior, isolation from friends, emotional manipulation. It's okay to end toxic relationships. Join clubs, societies, or hobby groups to meet like-minded people. Introverts: Quality over quantity in friendships is fine. Dating: Go slow, communicate boundaries, practice consent. Seek counseling for relationship issues.",
    source: "curated",
    tags: ["relationships", "friendships", "dating", "social skills", "toxic relationships", "consent"]
  },

  // Career Anxiety
  {
    title: "Career Anxiety and Future Planning",
    content: "Uncertainty about career after graduation is normal. Explore internships, talk to seniors in different fields, attend career fairs. It's okay if your interests change during college. Don't follow a career path just because of family pressure or peer choices. Consider your interests, values, and market realities. Career counseling services can help with aptitude tests and planning. Remember: Career paths are rarely linear, and many successful people changed directions multiple times.",
    source: "curated",
    tags: ["career anxiety", "career planning", "internships", "future planning", "aptitude"]
  }
];