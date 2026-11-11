import { Router } from 'express';
import { validate } from '../middleware/validation.js';
import { authMiddleware } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';
import { loginLimiter, apiLimiter } from '../middleware/rateLimiter.js';
import * as ctrl from '../controllers/index.js';
import { loginSchema, changePasswordSchema } from '../utils/validationSchemas.js';
import productRoutes from './products.js';
import contactRoutes from './contact.js';

const router = Router();

// Apply API rate limiter to all routes
router.use(apiLimiter);

// Public Routes
router.use('/products', productRoutes);
router.get('/water-types', ctrl.getPublicWaterTypes);
router.get('/certificates', ctrl.getPublicCertificates);
router.get('/history', ctrl.getPublicHistory);
router.get('/company-content', ctrl.getPublicCompanyContent);
router.get('/faqs', ctrl.getPublicFaqs);
router.get('/hero', ctrl.getPublicHero);
router.get('/settings', ctrl.getPublicSettings);
router.post('/chat', ctrl.postChat);

// Contact routes
router.use('/contact', contactRoutes);

// Auth Routes
router.post('/auth/login', loginLimiter, validate(loginSchema), ctrl.login);
router.post('/auth/logout', ctrl.logout);
router.get('/auth/me', authMiddleware, ctrl.getMe);
router.post('/auth/change-password', authMiddleware, validate(changePasswordSchema), ctrl.changePassword);

// Admin Routes (all protected)
router.use('/admin', authMiddleware);

// Dashboard
router.get('/admin/dashboard/stats', ctrl.adminGetDashboardStats);

// Water Types
router.get('/admin/water-types', ctrl.adminGetWaterTypes);
router.post('/admin/water-types', ctrl.adminCreateWaterType);
router.put('/admin/water-types/:id', ctrl.adminUpdateWaterType);
router.delete('/admin/water-types/:id', ctrl.adminDeleteWaterType);

// Certificates
router.get('/admin/certificates', ctrl.adminGetCertificates);
router.post('/admin/certificates', uploadSingle('file'), ctrl.adminCreateCertificate);
router.put('/admin/certificates/:id', uploadSingle('file'), ctrl.adminUpdateCertificate);
router.delete('/admin/certificates/:id', ctrl.adminDeleteCertificate);

// History Timeline
router.get('/admin/history', ctrl.adminGetHistory);
router.post('/admin/history', uploadSingle('image'), ctrl.adminCreateHistory);
router.put('/admin/history/:id', uploadSingle('image'), ctrl.adminUpdateHistory);
router.delete('/admin/history/:id', ctrl.adminDeleteHistory);

// Company Content
router.get('/admin/company-content', ctrl.adminGetCompanyContent);
router.post('/admin/company-content', uploadSingle('image'), ctrl.adminUpsertCompanyContent);

// FAQs
router.get('/admin/faqs', ctrl.adminGetFaqs);
router.post('/admin/faqs', ctrl.adminCreateFaq);
router.put('/admin/faqs/:id', ctrl.adminUpdateFaq);
router.delete('/admin/faqs/:id', ctrl.adminDeleteFaq);

// Settings
router.get('/admin/settings', ctrl.adminGetSettings);
router.put('/admin/settings', ctrl.adminUpdateSettings);

// Hero Content
router.get('/admin/hero', ctrl.adminGetHero);
router.put('/admin/hero', uploadSingle('backgroundImage'), ctrl.adminUpdateHero);

export default router;