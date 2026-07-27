export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: string; // "Full-time" | "Internship"
  summary: string;
  bullets: string[];
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  techStack: string[];
  category: 'Data Analytics' | 'Project Management' | 'Digital Marketing' | 'Cybersecurity';
  description: string;
  highlights: string[];
  metrics: { label: string; value: string; change?: string }[];
  codeSnippet?: { language: string; title: string; code: string };
  demoUrl?: string;
  featured: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  verifyUrl: string;
  category: 'Data & BI' | 'Google & Coursera' | 'Cybersecurity' | 'Management & Productivity';
  badgeColor?: string;
  skills: string[];
}

export interface SkillGroup {
  category: string;
  iconName: string;
  skills: { name: string; level: number; description: string }[];
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  score: string;
  courses: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied';
}

export interface ATSAnalysisResult {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  roleFitScore: number;
  recommendations: string[];
  summary: string;
}

export interface SQLDataset {
  name: string;
  description: string;
  defaultQuery: string;
  columns: string[];
  rows: Record<string, any>[];
}
