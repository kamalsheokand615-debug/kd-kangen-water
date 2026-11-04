import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { run, get } from '../models/database.js';
import {
  getAllProducts, getProductBySlug, getProductById, createProduct, updateProduct, deleteProduct,
  getAllWaterTypes, createWaterType, updateWaterType, deleteWaterType,
  getAllCertificates, getCertificateById, createCertificate, updateCertificate, deleteCertificate,
  getAllHistory, getHistoryById, createHistory, updateHistory, deleteHistory,
  getAllCompanyContent, upsertCompanyContent,
  getAllFaqs, createFaq, updateFaq, deleteFaq,
  getAllContactMessages, createContactMessage, markContactMessageRead, deleteContactMessage, getUnreadContactCount,
  getHeroContent, getAllSettings, setSetting,
} from '../utils/queries.js';

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string');
      }
    } catch {
      return [];
    }
  }

  return [];
}

function parseJsonObject(value: unknown): Record<string, unknown> {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

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

export async function postChat(req: Request, res: Response, next: NextFunction) {
  try {
    const rawMsg = (req.body as { message?: unknown })?.message;
    const message = String(rawMsg == null ? '' : rawMsg as string).trim().toLowerCase();
    if (!message) {
      res.status(400).json({ error: 'Message required' });
      return;
    }
    const faqs = getAllFaqs();
    let answer: string | null = null;
    for (const f of faqs as Array<{ question?: unknown; answer?: unknown }>) {
      const q = String(f.question == null ? '' : f.question as string).toLowerCase();
      const a = String(f.answer == null ? '' : f.answer as string);
      const words = message.split(/\s+/).filter(w => w.length > 2);
      if (words.some(w => q.includes(w))) {
        answer = a;
        break;
      }
    }
    if (!answer) {
      const result = getAllProducts({ limit: 50 });
      const products = result.data as Array<Record<string, unknown>>;
      const found = products.find((p) => message.includes(String(p.name == null ? '' : p.name as string).toLowerCase()));
      if (found) {
        answer = `${String(found.name == null ? '' : found.name as string)}: ${String(found.description == null ? '' : found.description as string)}`.trim();
      }
    }
    if (!answer) {
      answer = 'Main sirf K.D Kangen Water website aur products ke baare mein madad kar sakta hoon. Aap koi specific sawal pooch sakte hain!';
    }
    res.json({ reply: answer });
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
    const body = req.body as Record<string, unknown>;
    const name = typeof body.name === 'string' ? body.name : '';
    const email = typeof body.email === 'string' ? body.email : '';
    const phone = typeof body.phone === 'string' ? body.phone : undefined;
    const subject = typeof body.subject === 'string' ? body.subject : undefined;
    const message = typeof body.message === 'string' ? body.message : '';
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
    const body = req.body as Record<string, unknown>;
    const email = typeof body.email === 'string' ? body.email : '';
    const password = typeof body.password === 'string' ? body.password : '';
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
    const body = req.body as Record<string, unknown>;
    const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';
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
    const body = req.body as Record<string, unknown>;
    const images = req.files ? (req.files as Express.Multer.File[]).map(f => `/uploads/${f.filename}`) : [];
    const product = createProduct({
      slug: typeof body.slug === 'string' ? body.slug : '',
      name: typeof body.name === 'string' ? body.name : '',
      description: typeof body.description === 'string' ? body.description : undefined,
      features: parseStringArray(body.features),
      price: body.price === undefined || body.price === null || body.price === '' ? null : Number(body.price),
      contactForPrice: body.contactForPrice === 'true' || body.contactForPrice === true,
      category: typeof body.category === 'string' ? body.category : undefined,
      images,
      inStock: body.inStock !== 'false' && body.inStock !== false,
      displayOrder: typeof body.displayOrder === 'string' || typeof body.displayOrder === 'number' ? Number(body.displayOrder) || 0 : 0,
      metaTitle: typeof body.metaTitle === 'string' ? body.metaTitle : undefined,
      metaDescription: typeof body.metaDescription === 'string' ? body.metaDescription : undefined,
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const body = req.body as Record<string, unknown>;
    const id = Number(req.params.id);
    const existing = getProductById(id);
    if (!existing) throw new AppError('Product not found', 404);

    let images = existing.images;
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      images = (req.files as Express.Multer.File[]).map(f => `/uploads/${f.filename}`);
    }

    const product = updateProduct(id, {
      slug: typeof body.slug === 'string' ? body.slug : undefined,
      name: typeof body.name === 'string' ? body.name : undefined,
      description: typeof body.description === 'string' ? body.description : undefined,
      features: body.features === undefined ? undefined : parseStringArray(body.features),
      price: body.price === undefined ? undefined : body.price === null || body.price === '' ? null : Number(body.price),
      contactForPrice: body.contactForPrice === undefined ? undefined : body.contactForPrice === 'true' || body.contactForPrice === true,
      category: typeof body.category === 'string' ? body.category : undefined,
      images,
      inStock: body.inStock === undefined ? undefined : body.inStock !== 'false' && body.inStock !== false,
      displayOrder: body.displayOrder === undefined ? undefined : typeof body.displayOrder === 'string' || typeof body.displayOrder === 'number' ? Number(body.displayOrder) : undefined,
      metaTitle: typeof body.metaTitle === 'string' ? body.metaTitle : undefined,
      metaDescription: typeof body.metaDescription === 'string' ? body.metaDescription : undefined,
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
    const body = req.body as Record<string, unknown>;
    const waterType = createWaterType({
      name: typeof body.name === 'string' ? body.name : '',
      phMin: body.phMin === undefined || body.phMin === null || body.phMin === '' ? null : Number(body.phMin),
      phMax: body.phMax === undefined || body.phMax === null || body.phMax === '' ? null : Number(body.phMax),
      description: typeof body.description === 'string' ? body.description : undefined,
      uses: parseStringArray(body.uses),
      color: typeof body.color === 'string' ? body.color : undefined,
      displayOrder: typeof body.displayOrder === 'string' || typeof body.displayOrder === 'number' ? Number(body.displayOrder) || 0 : 0,
      isActive: body.isActive !== 'false' && body.isActive !== false,
    });
    res.status(201).json(waterType);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateWaterType(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const body = req.body as Record<string, unknown>;
    const waterType = updateWaterType(Number(req.params.id), {
      name: typeof body.name === 'string' ? body.name : undefined,
      phMin: body.phMin === undefined ? undefined : body.phMin === null || body.phMin === '' ? null : Number(body.phMin),
      phMax: body.phMax === undefined ? undefined : body.phMax === null || body.phMax === '' ? null : Number(body.phMax),
      description: typeof body.description === 'string' ? body.description : undefined,
      uses: body.uses === undefined ? undefined : parseStringArray(body.uses),
      color: typeof body.color === 'string' ? body.color : undefined,
      displayOrder: body.displayOrder === undefined ? undefined : typeof body.displayOrder === 'string' || typeof body.displayOrder === 'number' ? Number(body.displayOrder) : undefined,
      isActive: body.isActive === undefined ? undefined : body.isActive !== 'false' && body.isActive !== false,
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
    const body = req.body as Record<string, unknown>;
    let fileUrl = typeof body.fileUrl === 'string' ? body.fileUrl : undefined;
    let fileType = typeof body.fileType === 'string' ? body.fileType : 'image';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
    }

    const certificate = createCertificate({
      title: typeof body.title === 'string' ? body.title : '',
      issuingBody: typeof body.issuingBody === 'string' ? body.issuingBody : undefined,
      year: body.year === undefined || body.year === null || body.year === '' ? null : Number(body.year),
      description: typeof body.description === 'string' ? body.description : undefined,
      fileUrl: fileUrl ?? undefined,
      fileType,
      category: typeof body.category === 'string' ? body.category : undefined,
      certificateNumber: typeof body.certificateNumber === 'string' ? body.certificateNumber : undefined,
      validDate: typeof body.validDate === 'string' ? body.validDate : undefined,
      displayOrder: typeof body.displayOrder === 'string' || typeof body.displayOrder === 'number' ? Number(body.displayOrder) || 0 : 0,
      isActive: body.isActive !== 'false' && body.isActive !== false,
    });
    res.status(201).json(certificate);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateCertificate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const body = req.body as Record<string, unknown>;
    const id = Number(req.params.id);
    const existing = getCertificateById(id);
    if (!existing) throw new AppError('Certificate not found', 404);

    let fileUrl = typeof existing.file_url === 'string' ? existing.file_url : undefined;
    let fileType = typeof existing.file_type === 'string' ? existing.file_type : 'image';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
    }

    const certificate = updateCertificate(id, {
      title: typeof body.title === 'string' ? body.title : undefined,
      issuingBody: typeof body.issuingBody === 'string' ? body.issuingBody : undefined,
      year: body.year === undefined ? undefined : body.year === null || body.year === '' ? null : Number(body.year),
      description: typeof body.description === 'string' ? body.description : undefined,
      fileUrl,
      fileType,
      category: typeof body.category === 'string' ? body.category : undefined,
      certificateNumber: typeof body.certificateNumber === 'string' ? body.certificateNumber : undefined,
      validDate: typeof body.validDate === 'string' ? body.validDate : undefined,
      displayOrder: body.displayOrder === undefined ? undefined : typeof body.displayOrder === 'string' || typeof body.displayOrder === 'number' ? Number(body.displayOrder) : undefined,
      isActive: body.isActive === undefined ? undefined : body.isActive !== 'false' && body.isActive !== false,
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
    const body = req.body as Record<string, unknown>;
    let imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl : undefined;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const history = createHistory({
      year: typeof body.year === 'string' || typeof body.year === 'number' ? Number(body.year) : 0,
      title: typeof body.title === 'string' ? body.title : '',
      description: typeof body.description === 'string' ? body.description : undefined,
      imageUrl,
      displayOrder: typeof body.displayOrder === 'string' || typeof body.displayOrder === 'number' ? Number(body.displayOrder) || 0 : 0,
      isActive: body.isActive !== 'false' && body.isActive !== false,
    });
    res.status(201).json(history);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const body = req.body as Record<string, unknown>;
    const id = Number(req.params.id);
    const existing = getHistoryById(id);
    if (!existing) throw new AppError('History entry not found', 404);

    let imageUrl = typeof existing.image_url === 'string' ? existing.image_url : undefined;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const history = updateHistory(id, {
      year: body.year === undefined ? undefined : typeof body.year === 'string' || typeof body.year === 'number' ? Number(body.year) : undefined,
      title: typeof body.title === 'string' ? body.title : undefined,
      description: typeof body.description === 'string' ? body.description : undefined,
      imageUrl,
      displayOrder: body.displayOrder === undefined ? undefined : typeof body.displayOrder === 'string' || typeof body.displayOrder === 'number' ? Number(body.displayOrder) : undefined,
      isActive: body.isActive === undefined ? undefined : body.isActive !== 'false' && body.isActive !== false,
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
    const body = req.body as Record<string, unknown>;
    let imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl : undefined;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const content = upsertCompanyContent({
      sectionKey: typeof body.sectionKey === 'string' ? body.sectionKey : '',
      title: typeof body.title === 'string' ? body.title : undefined,
      content: typeof body.content === 'string' ? body.content : undefined,
      imageUrl,
      metaData: parseJsonObject(body.metaData),
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
    const body = req.body as Record<string, unknown>;
    const faq = createFaq({
      question: typeof body.question === 'string' ? body.question : '',
      answer: typeof body.answer === 'string' ? body.answer : '',
      category: typeof body.category === 'string' ? body.category : undefined,
      displayOrder: typeof body.displayOrder === 'string' || typeof body.displayOrder === 'number' ? Number(body.displayOrder) || 0 : 0,
      isActive: body.isActive !== 'false' && body.isActive !== false,
    });
    res.status(201).json(faq);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateFaq(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const body = req.body as Record<string, unknown>;
    const faq = updateFaq(Number(req.params.id), {
      question: typeof body.question === 'string' ? body.question : undefined,
      answer: typeof body.answer === 'string' ? body.answer : undefined,
      category: typeof body.category === 'string' ? body.category : undefined,
      displayOrder: body.displayOrder === undefined ? undefined : typeof body.displayOrder === 'string' || typeof body.displayOrder === 'number' ? Number(body.displayOrder) : undefined,
      isActive: body.isActive === undefined ? undefined : body.isActive !== 'false' && body.isActive !== false,
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
    const body = req.body as Record<string, unknown>;
    let backgroundImageUrl = typeof body.backgroundImageUrl === 'string' ? body.backgroundImageUrl : undefined;
    if (req.file) {
      backgroundImageUrl = `/uploads/${req.file.filename}`;
    }

    run(`
      UPDATE hero_content SET 
        headline = ?, subheadline = ?, cta_text = ?, cta_link = ?, 
        background_image_url = ?, background_video_url = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = (SELECT id FROM hero_content WHERE is_active = 1 LIMIT 1)
    `, [
      typeof body.headline === 'string' ? body.headline : '',
      typeof body.subheadline === 'string' ? body.subheadline : '',
      typeof body.ctaText === 'string' ? body.ctaText : '',
      typeof body.ctaLink === 'string' ? body.ctaLink : '',
      backgroundImageUrl ?? null,
      typeof body.backgroundVideoUrl === 'string' ? body.backgroundVideoUrl : '',
      body.isActive === undefined || body.isActive === 'false' || body.isActive === false ? 0 : 1,
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