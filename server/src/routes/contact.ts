import { Router } from 'express';
import { validate } from '../middleware/validation.js';
import { authMiddleware } from '../middleware/auth.js';
import { contactSchema } from '../utils/validationSchemas.js';
import * as ctrl from '../controllers/index.js';

const router = Router();

// Public contact route
router.post('/', validate(contactSchema), ctrl.postContactMessage);

// Admin contact routes (protected)
router.use('/admin', authMiddleware);
router.get('/admin', ctrl.adminGetContactMessages);
router.put('/admin/:id/read', ctrl.adminMarkContactRead);
router.delete('/admin/:id', ctrl.adminDeleteContactMessage);

export default router;