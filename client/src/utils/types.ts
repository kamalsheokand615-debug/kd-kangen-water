export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  features: string[];
  price: number | null;
  contactForPrice: boolean;
  category: string | null;
  images: string[];
  inStock: boolean;
  displayOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WaterType {
  id: number;
  name: string;
  phMin: number | null;
  phMax: number | null;
  description: string | null;
  uses: string[];
  color: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: number;
  title: string;
  issuingBody: string | null;
  year: number | null;
  description: string | null;
  fileUrl: string | null;
  fileType: 'image' | 'pdf';
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEntry {
  id: number;
  year: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyContent {
  id: number;
  sectionKey: string;
  title: string | null;
  content: string | null;
  imageUrl: string | null;
  metaData: Record<string, unknown> | null;
  updatedAt: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface HeroContent {
  id: number;
  headline: string | null;
  subheadline: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  backgroundImageUrl: string | null;
  backgroundVideoUrl: string | null;
  isActive: boolean;
  updatedAt: string;
}

export interface SiteSettings {
  [key: string]: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface DashboardStats {
  products: { count: number };
  certificates: { count: number };
  unreadMessages: { count: number };
  waterTypes: { count: number };
  faqs: { count: number };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  inStock?: boolean;
}