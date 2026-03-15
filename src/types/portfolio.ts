export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
  icon?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: 'frontend' | 'backend' | 'fullstack';
  github: string;
  demo: string;
  featured: boolean;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  period: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'contact' | 'quick_reply';
}

export interface QuickReply {
  id: string;
  text: string;
  action: string;
}

export interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  unreadCount: number;
}

export interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  budget: string;
  timeline: string;
}

export interface GeneratedQuote {
  id: string;
  clientName: string;
  clientEmail: string;
  projectType: string;
  description: string;
  estimatedHours: number;
  hourlyRate: number;
  totalAmount: number;
  timeline: string;
  features: string[];
  createdAt: Date;
}