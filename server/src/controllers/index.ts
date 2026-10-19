import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { run, get } from '../models/database.js';
import {
  getAllProducts, getProductBySlug, getProductById, createProduct, updateProduct, deleteProduct,
  getAllWaterTypes, getWaterTypeById, createWaterType, updateWaterType, deleteWaterType,
  getAllCertificates, getCertificateById, createCertificate, updateCertificate, deleteCertificate,
  getAllHistory, getHistoryById, createHistory, updateHistory, deleteHistory,
  getCompanyContent, getAllCompanyContent, upsertCompanyContent,
  getAllFaqs, getFaqById, createFaq, updateFaq, deleteFaq,
  getAllContactMessages, getContactMessageById, createContactMessage, markContactMessageRead, deleteContactMessage, getUnreadContactCount,
  getHeroContent, getAllSettings, setSetting,
} from '../utils/queries.js';
import { upload } from '../middleware/upload.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Public Controllers
export async function getPublicProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 12, category, search, sortBy = 'displayOrder', sortOrder = 'asc', inStock } = req.query;
    const result = getAllProducts({
      page: Number(page),
      limit: Number(limit),
      category: category as string,
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
      inStock: inStock !== undefined ? inStock === 'true' : undefined,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getPublicProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = getProductBySlug(req.params.slug);
    if (!product) throw new AppError('Product not found', 404);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function getPublicWaterTypes(req: Request, res: Response, next: NextFunction) {
  try {
    const waterTypes = getAllWaterTypes();
    res.json(waterTypes);
  } catch (error) {
    next(error);
  }
}

export async function getPublicCertificates(req: Request, res: Response, next: NextFunction) {
  try {
    const certificates = getAllCertificates();
    res.json(certificates);
  } catch (error) {
    next(error);
  }
}

export async function getPublicHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const history = getAllHistory();
    res.json(history);
  } catch (error) {
    next(error);
  }
}

export async function getPublicCompanyContent(req: Request, res: Response, next: NextFunction) {
  try {
    const content = getAllCompanyContent() as Array<{ section_key: string; [key: string]: unknown }>;
    const result: Record<string, unknown> = {};
    for (const item of content) {
      result[item.section_key] = item;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getPublicFaqs(req: Request, res: Response, next: NextFunction) {
  try {
    const faqs = getAllFaqs();
    res.json(faqs);
  } catch (error) {
    next(error);
  }
}

export async function getPublicHero(req: Request, res: Response, next: NextFunction) {
  try {
    const hero = getHeroContent();
    res.json(hero);
  } catch (error) {
    next(error);
  }
}

export async function getPublicSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = getAllSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
}

export async function postContactMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, phone, subject, message } = req.body;
    createContactMessage({ name, email, phone, subject, message });
    
    // TODO: Send email notification if SMTP configured
    
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    next(error);
  }
}

// Auth Controllers
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = get('SELECT * FROM users WHERE email = ?', [email]) as { id: number; email: string; password_hash: string; role: string } | undefined;
    
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as SignOptions
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
  });
  res.json({ message: 'Logged out successfully' });
}

export async function getMe(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user: req.user });
}

export async function changePassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = get('SELECT * FROM users WHERE id = ?', [req.user!.id]) as { password_hash: string } | undefined;
    
    if (!user || !await bcrypt.compare(currentPassword, user.password_hash)) {
      throw new AppError('Current password is incorrect', 400);
    }

    const hash = await bcrypt.hash(newPassword, 12);
    run('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [hash, req.user!.id]);
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
}

// Admin Product Controllers
export async function adminGetProducts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20, category, search, sortBy = 'displayOrder', sortOrder = 'asc' } = req.query;
    const result = getAllProducts({
      page: Number(page),
      limit: Number(limit),
      category: category as string,
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function adminGetProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const product = getProductById(Number(req.params.id));
    if (!product) throw new AppError('Product not found', 404);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function adminCreateProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const images = req.files ? (req.files as Express.Multer.File[]).map(f => `/uploads/${f.filename}`) : [];
    const product = createProduct({
      ...req.body,
      features: req.body.features ? JSON.parse(req.body.features) : [],
      price: req.body.price ? Number(req.body.price) : null,
      contactForPrice: req.body.contactForPrice === 'true',
      inStock: req.body.inStock !== 'false',
      displayOrder: Number(req.body.displayOrder) || 0,
      images,
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const existing = getProductById(id);
    if (!existing) throw new AppError('Product not found', 404);

    let images = existing.images;
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      images = (req.files as Express.Multer.File[]).map(f => `/uploads/${f.filename}`);
    }

    const product = updateProduct(id, {
      ...req.body,
      features: req.body.features ? JSON.parse(req.body.features) : undefined,
      price: req.body.price !== undefined ? (req.body.price ? Number(req.body.price) : null) : undefined,
      contactForPrice: req.body.contactForPrice === 'true',
      inStock: req.body.inStock !== 'false',
      displayOrder: req.body.displayOrder !== undefined ? Number(req.body.displayOrder) : undefined,
      images,
    });
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    deleteProduct(Number(req.params.id));
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
}

// Admin Water Types Controllers
export async function adminGetWaterTypes(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json(getAllWaterTypes(false));
  } catch (error) {
    next(error);
  }
}

export async function adminCreateWaterType(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const waterType = createWaterType({
      ...req.body,
      phMin: req.body.phMin ? Number(req.body.phMin) : null,
      phMax: req.body.phMax ? Number(req.body.phMax) : null,
      uses: req.body.uses ? JSON.parse(req.body.uses) : [],
      displayOrder: Number(req.body.displayOrder) || 0,
      isActive: req.body.isActive !== 'false',
    });
    res.status(201).json(waterType);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateWaterType(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const waterType = updateWaterType(Number(req.params.id), {
      ...req.body,
      phMin: req.body.phMin !== undefined ? (req.body.phMin ? Number(req.body.phMin) : null) : undefined,
      phMax: req.body.phMax !== undefined ? (req.body.phMax ? Number(req.body.phMax) : null) : undefined,
      uses: req.body.uses ? JSON.parse(req.body.uses) : undefined,
      displayOrder: req.body.displayOrder !== undefined ? Number(req.body.displayOrder) : undefined,
      isActive: req.body.isActive !== 'false',
    });
    res.json(waterType);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteWaterType(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    deleteWaterType(Number(req.params.id));
    res.json({ message: 'Water type deleted' });
  } catch (error) {
    next(error);
  }
}

// Admin Certificates Controllers
export async function adminGetCertificates(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json(getAllCertificates(false));
  } catch (error) {
    next(error);
  }
}

export async function adminCreateCertificate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    let fileUrl = req.body.fileUrl;
    let fileType = req.body.fileType || 'image';
    
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
    }

    const certificate = createCertificate({
      ...req.body,
      year: req.body.year ? Number(req.body.year) : null,
      fileUrl,
      fileType,
      displayOrder: Number(req.body.displayOrder) || 0,
      isActive: req.body.isActive !== 'false',
    });
    res.status(201).json(certificate);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateCertificate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const existing = getCertificateById(id);
    if (!existing) throw new AppError('Certificate not found', 404);

    let fileUrl = existing.file_url;
    let fileType = existing.file_type;

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
    }

    const certificate = updateCertificate(id, {
      ...req.body,
      year: req.body.year !== undefined ? (req.body.year ? Number(req.body.year) : null) : undefined,
      fileUrl,
      fileType,
      displayOrder: req.body.displayOrder !== undefined ? Number(req.body.displayOrder) : undefined,
      isActive: req.body.isActive !== 'false',
    });
    res.json(certificate);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteCertificate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    deleteCertificate(Number(req.params.id));
    res.json({ message: 'Certificate deleted' });
  } catch (error) {
    next(error);
  }
}

// Admin History Controllers
export async function adminGetHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json(getAllHistory(false));
  } catch (error) {
    next(error);
  }
}

export async function adminCreateHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const history = createHistory({
      ...req.body,
      year: Number(req.body.year),
      imageUrl,
      displayOrder: Number(req.body.displayOrder) || 0,
      isActive: req.body.isActive !== 'false',
    });
    res.status(201).json(history);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const existing = getHistoryById(id);
    if (!existing) throw new AppError('History entry not found', 404);

    let imageUrl = existing.image_url;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const history = updateHistory(id, {
      ...req.body,
      year: req.body.year !== undefined ? Number(req.body.year) : undefined,
      imageUrl,
      displayOrder: req.body.displayOrder !== undefined ? Number(req.body.displayOrder) : undefined,
      isActive: req.body.isActive !== 'false',
    });
    res.json(history);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    deleteHistory(Number(req.params.id));
    res.json({ message: 'History entry deleted' });
  } catch (error) {
    next(error);
  }
}

// Admin Company Content Controllers
export async function adminGetCompanyContent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json(getAllCompanyContent());
  } catch (error) {
    next(error);
  }
}

export async function adminUpsertCompanyContent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const content = upsertCompanyContent({
      sectionKey: req.body.sectionKey,
      title: req.body.title,
      content: req.body.content,
      imageUrl,
      metaData: req.body.metaData ? JSON.parse(req.body.metaData) : {},
    });
    res.json(content);
  } catch (error) {
    next(error);
  }
}

// Admin FAQ Controllers
export async function adminGetFaqs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json(getAllFaqs(false));
  } catch (error) {
    next(error);
  }
}

export async function adminCreateFaq(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const faq = createFaq({
      ...req.body,
      displayOrder: Number(req.body.displayOrder) || 0,
      isActive: req.body.isActive !== 'false',
    });
    res.status(201).json(faq);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateFaq(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const faq = updateFaq(Number(req.params.id), {
      ...req.body,
      displayOrder: req.body.displayOrder !== undefined ? Number(req.body.displayOrder) : undefined,
      isActive: req.body.isActive !== 'false',
    });
    res.json(faq);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteFaq(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    deleteFaq(Number(req.params.id));
    res.json({ message: 'FAQ deleted' });
  } catch (error) {
    next(error);
  }
}

// Admin Contact Messages Controllers
export async function adminGetContactMessages(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const result = getAllContactMessages({
      page: Number(page),
      limit: Number(limit),
      unreadOnly: unreadOnly === 'true',
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function adminMarkContactRead(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    markContactMessageRead(Number(req.params.id));
    res.json({ message: 'Marked as read' });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteContactMessage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    deleteContactMessage(Number(req.params.id));
    res.json({ message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
}

// Admin Settings Controllers
export async function adminGetSettings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json(getAllSettings());
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateSettings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const settings = req.body as Record<string, string>;
    for (const [key, value] of Object.entries(settings)) {
      setSetting(key, value);
    }
    res.json({ message: 'Settings updated', settings: getAllSettings() });
  } catch (error) {
    next(error);
  }
}

// Admin Hero Content Controllers
export async function adminGetHero(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json(getHeroContent());
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateHero(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    let backgroundImageUrl = req.body.backgroundImageUrl;
    if (req.file) {
      backgroundImageUrl = `/uploads/${req.file.filename}`;
    }

    run(`
      UPDATE hero_content SET 
        headline = ?, subheadline = ?, cta_text = ?, cta_link = ?, 
        background_image_url = ?, background_video_url = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = (SELECT id FROM hero_content WHERE is_active = 1 LIMIT 1)
    `, [
      req.body.headline, req.body.subheadline, req.body.ctaText, req.body.ctaLink,
      backgroundImageUrl, req.body.backgroundVideoUrl, req.body.isActive !== 'false' ? 1 : 0
    ]);

    res.json(getHeroContent());
  } catch (error) {
    next(error);
  }
}

// Dashboard Stats
export async function adminGetDashboardStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const stats = {
      products: get('SELECT COUNT(*) as count FROM products') as { count: number },
      certificates: get('SELECT COUNT(*) as count FROM certificates') as { count: number },
      unreadMessages: getUnreadContactCount(),
      waterTypes: get('SELECT COUNT(*) as count FROM water_types WHERE is_active = 1') as { count: number },
      faqs: get('SELECT COUNT(*) as count FROM faqs WHERE is_active = 1') as { count: number },
    };
    res.json(stats);
  } catch (error) {
    next(error);
  }
}