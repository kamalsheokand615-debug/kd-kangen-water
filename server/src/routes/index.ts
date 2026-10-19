import { Router } from 'express';
import { validate } from '../middleware/validation.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { uploadSingle, uploadArray, uploadFields } from '../middleware/upload.js';
import { loginLimiter, apiLimiter, contactLimiter } from '../middleware/rateLimiter.js';
import * as ctrl from '../controllers/index.js';
import { loginSchema, changePasswordSchema, contactSchema } from '../utils/validationSchemas.js';

const router = Router();

// Apply API rate limiter to all routes
router.use(apiLimiter);

// Public Routes
router.get('/products', ctrl.getPublicProducts);
router.get('/products/:slug', ctrl.getPublicProduct);
router.get('/water-types', ctrl.getPublicWaterTypes);
router.get('/certificates', ctrl.getPublicCertificates);
router.get('/history', ctrl.getPublicHistory);
router.get('/company-content', ctrl.getPublicCompanyContent);
router.get('/faqs', ctrl.getPublicFaqs);
router.get('/hero', ctrl.getPublicHero);
router.get('/settings', ctrl.getPublicSettings);
router.post('/contact', contactLimiter, validate(contactSchema), ctrl.postContactMessage);

// Auth Routes
router.post('/auth/login', loginLimiter, validate(loginSchema), ctrl.login);
router.post('/auth/logout', ctrl.logout);
router.get('/auth/me', authMiddleware, ctrl.getMe);
router.post('/auth/change-password', authMiddleware, validate(changePasswordSchema), ctrl.changePassword);

// Admin Routes (all protected)
router.use('/admin', authMiddleware);

// Dashboard
router.get('/admin/dashboard/stats', ctrl.adminGetDashboardStats);

// Products
router.get('/admin/products', ctrl.adminGetProducts);
router.get('/admin/products/:id', ctrl.adminGetProduct);
router.post('/admin/products', uploadArray('images', 10), ctrl.adminCreateProduct);
router.put('/admin/products/:id', uploadArray('images', 10), ctrl.adminUpdateProduct);
router.delete('/admin/products/:id', ctrl.adminDeleteProduct);

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

// Contact Messages
router.get('/admin/contact-messages', ctrl.adminGetContactMessages);
router.put('/admin/contact-messages/:id/read', ctrl.adminMarkContactRead);
router.delete('/admin/contact-messages/:id', ctrl.adminDeleteContactMessage);

// Settings
router.get('/admin/settings', ctrl.adminGetSettings);
router.put('/admin/settings', ctrl.adminUpdateSettings);

// Hero Content
router.get('/admin/hero', ctrl.adminGetHero);
router.put('/admin/hero', uploadSingle('backgroundImage'), ctrl.adminUpdateHero);

export default router;