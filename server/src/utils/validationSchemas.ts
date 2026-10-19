import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Product schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  price: z.number().int().nonnegative().optional().nullable(),
  contactForPrice: z.boolean().optional(),
  category: z.string().optional(),
  inStock: z.boolean().optional(),
  displayOrder: z.number().int().nonnegative().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
});

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'price', 'displayOrder', 'createdAt']).default('displayOrder'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  inStock: z.coerce.boolean().optional(),
});

// Water Type schemas
export const waterTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  phMin: z.number().min(0).max(14).optional().nullable(),
  phMax: z.number().min(0).max(14).optional().nullable(),
  description: z.string().optional(),
  uses: z.array(z.string()).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color').optional(),
  displayOrder: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

// Certificate schemas
export const certificateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  issuingBody: z.string().optional(),
  year: z.number().int().min(1900).max(2100).optional().nullable(),
  description: z.string().optional(),
  displayOrder: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

// History Timeline schemas
export const historySchema = z.object({
  year: z.number().int().min(1900).max(2100),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  displayOrder: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

// Company Content schemas
export const companyContentSchema = z.object({
  sectionKey: z.string().min(1, 'Section key is required').max(100),
  title: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  metaData: z.record(z.unknown()).optional(),
});

// FAQ schemas
export const faqSchema = z.object({
  question: z.string().min(1, 'Question is required').max(500),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().optional(),
  displayOrder: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

// Contact Message schema
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, 'Message is required').max(5000),
});

// Site Settings schema
export const siteSettingSchema = z.object({
  settingKey: z.string().min(1, 'Setting key is required').max(100),
  settingValue: z.string().optional(),
  settingType: z.enum(['text', 'number', 'boolean', 'json', 'image']).default('text'),
  description: z.string().optional(),
});

// Hero Content schema
export const heroContentSchema = z.object({
  headline: z.string().max(200).optional(),
  subheadline: z.string().max(500).optional(),
  ctaText: z.string().max(50).optional(),
  ctaLink: z.string().max(200).optional(),
  backgroundImageUrl: z.string().url().optional().nullable(),
  backgroundVideoUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().optional(),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});