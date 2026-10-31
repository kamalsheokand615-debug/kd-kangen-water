import { run, get, all, save } from '../models/database.js';

function mapRow(row: Record<string, unknown>): Record<string, unknown> {
  return row;
}

export function getSetting(key: string): string | null {
  const row = get('SELECT setting_value FROM site_settings WHERE setting_key = ?', [key]) as { setting_value: string } | undefined;
  return row?.setting_value ?? null;
}

export function getAllSettings(): Record<string, string> {
  const rows = all('SELECT setting_key, setting_value FROM site_settings') as { setting_key: string; setting_value: string }[];
  return Object.fromEntries(rows.map(r => [r.setting_key, r.setting_value]));
}

export function setSetting(key: string, value: string) {
  run('UPDATE site_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?', [value, key]);
  save();
}

export function getHeroContent() {
  const row = get('SELECT * FROM hero_content WHERE is_active = 1 ORDER BY updated_at DESC LIMIT 1');
  return row ? mapRow(row) : null;
}

export function getAllProducts(options: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  inStock?: boolean;
} = {}) {
  const { page = 1, limit = 12, category, search, sortBy = 'display_order', sortOrder = 'asc', inStock } = options;
  const offset = (page - 1) * limit;

  let where = 'WHERE 1=1';
  const params: unknown[] = [];

  if (category) {
    where += ' AND category = ?';
    params.push(category);
  }
  if (search) {
    where += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (inStock !== undefined) {
    where += ' AND in_stock = ?';
    params.push(inStock ? 1 : 0);
  }

  const sortColumnMap: Record<string, string> = {
    displayOrder: 'display_order',
    display_order: 'display_order',
    name: 'name',
    price: 'price',
    createdAt: 'created_at',
    created_at: 'created_at',
  };
  const sortColumn = sortColumnMap[sortBy] ?? 'display_order';
  const order = sortOrder === 'desc' ? 'DESC' : 'ASC';

  const totalResult = get(`SELECT COUNT(*) as count FROM products ${where}`, params) as { count: number } | undefined;
  const total = totalResult?.count ?? 0;
  const products = all(`SELECT * FROM products ${where} ORDER BY ${sortColumn} ${order} LIMIT ? OFFSET ?`, [...params, limit, offset]);

  return {
    data: (products).map(p => ({
      ...mapRow(p),
      features: p.features ? JSON.parse(p.features as string) : [],
      images: p.images ? JSON.parse(p.images as string) : [],
      price: p.price !== null ? p.price : null,
      contactForPrice: Boolean(p.contact_for_price),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export function getProductBySlug(slug: string) {
  const product = get('SELECT * FROM products WHERE slug = ?', [slug]);
  if (!product) return null;
  const p = mapRow(product);
  return {
    ...p,
    features: p.features ? JSON.parse(p.features as string) : [],
    images: p.images ? JSON.parse(p.images as string) : [],
    price: p.price !== null ? p.price : null,
    contactForPrice: Boolean(p.contact_for_price),
  };
}

export function getProductById(id: number) {
  const product = get('SELECT * FROM products WHERE id = ?', [id]);
  if (!product) return null;
  const p = mapRow(product);
  return {
    ...p,
    features: p.features ? JSON.parse(p.features as string) : [],
    images: p.images ? JSON.parse(p.images as string) : [],
    price: p.price !== null ? p.price : null,
    contactForPrice: Boolean(p.contact_for_price),
  };
}

export function createProduct(data: {
  slug: string;
  name: string;
  description?: string;
  features?: string[];
  price?: number | null;
  contactForPrice?: boolean;
  category?: string;
  images?: string[];
  inStock?: boolean;
  displayOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
}) {
  const result = run(`
    INSERT INTO products (slug, name, description, features, price, contact_for_price, category, images, in_stock, display_order, meta_title, meta_description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.slug,
    data.name,
    data.description ?? null,
    JSON.stringify(data.features ?? []),
    data.price ?? null,
    data.contactForPrice ? 1 : 0,
    data.category ?? null,
    JSON.stringify(data.images ?? []),
    data.inStock ? 1 : 0,
    data.displayOrder ?? 0,
    data.metaTitle ?? null,
    data.metaDescription ?? null
  ]);
  save();
  return getProductById(result.lastInsertRowid as number);
}

export function updateProduct(id: number, data: Partial<{
  slug: string;
  name: string;
  description: string;
  features: string[];
  price: number | null;
  contactForPrice: boolean;
  category: string;
  images: string[];
  inStock: boolean;
  displayOrder: number;
  metaTitle: string;
  metaDescription: string;
}>) {
  const fields: string[] = [];
  const values: unknown[] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${snakeKey} = ?`);
      if (key === 'features' || key === 'images') {
        values.push(JSON.stringify(value));
      } else if (key === 'contactForPrice' || key === 'inStock') {
        values.push(value ? 1 : 0);
      } else {
        values.push(value);
      }
    }
  });

  if (fields.length === 0) return getProductById(id);

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  run(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
  save();
  return getProductById(id);
}

export function deleteProduct(id: number) {
  run('DELETE FROM products WHERE id = ?', [id]);
  save();
}

export function getAllWaterTypes(activeOnly = true) {
  let query = 'SELECT * FROM water_types';
  if (activeOnly) query += ' WHERE is_active = 1';
  query += ' ORDER BY display_order, id';
  return (all(query)).map(w => ({
    ...mapRow(w),
    uses: w.uses ? JSON.parse(w.uses as string) : [],
  }));
}

export function getWaterTypeById(id: number) {
  const w = get('SELECT * FROM water_types WHERE id = ?', [id]);
  if (!w) return null;
  return { ...mapRow(w), uses: w.uses ? JSON.parse(w.uses as string) : [] };
}

export function createWaterType(data: {
  name: string;
  phMin?: number | null;
  phMax?: number | null;
  description?: string;
  uses?: string[];
  color?: string;
  displayOrder?: number;
  isActive?: boolean;
}) {
  const result = run(`
    INSERT INTO water_types (name, ph_min, ph_max, description, uses, color, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.name,
    data.phMin ?? null,
    data.phMax ?? null,
    data.description ?? null,
    JSON.stringify(data.uses ?? []),
    data.color ?? '#0077b6',
    data.displayOrder ?? 0,
    data.isActive ? 1 : 0
  ]);
  save();
  return getWaterTypeById(result.lastInsertRowid as number);
}

export function updateWaterType(id: number, data: Partial<{
  name: string;
  phMin: number | null;
  phMax: number | null;
  description: string;
  uses: string[];
  color: string;
  displayOrder: number;
  isActive: boolean;
}>) {
  const fields: string[] = [];
  const values: unknown[] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${snakeKey} = ?`);
      if (key === 'uses') {
        values.push(JSON.stringify(value));
      } else if (key === 'isActive') {
        values.push(value ? 1 : 0);
      } else {
        values.push(value);
      }
    }
  });

  if (fields.length === 0) return getWaterTypeById(id);

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  run(`UPDATE water_types SET ${fields.join(', ')} WHERE id = ?`, values);
  save();
  return getWaterTypeById(id);
}

export function deleteWaterType(id: number) {
  run('DELETE FROM water_types WHERE id = ?', [id]);
  save();
}

export function getAllCertificates(activeOnly = true) {
  let query = 'SELECT * FROM certificates';
  if (activeOnly) query += ' WHERE is_active = 1';
  query += ' ORDER BY display_order, year DESC';
  return all(query).map(mapRow);
}

export function getCertificateById(id: number) {
  const cert = get('SELECT * FROM certificates WHERE id = ?', [id]);
  return cert ? mapRow(cert) : null;
}

export function createCertificate(data: {
  title: string;
  issuingBody?: string;
  year?: number | null;
  description?: string;
  fileUrl?: string;
  fileType?: string;
  displayOrder?: number;
  isActive?: boolean;
}) {
  const result = run(`
    INSERT INTO certificates (title, issuing_body, year, description, file_url, file_type, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.title,
    data.issuingBody ?? null,
    data.year ?? null,
    data.description ?? null,
    data.fileUrl ?? null,
    data.fileType ?? 'image',
    data.displayOrder ?? 0,
    data.isActive ? 1 : 0
  ]);
  save();
  return getCertificateById(result.lastInsertRowid as number);
}

export function updateCertificate(id: number, data: Partial<{
  title: string;
  issuingBody: string;
  year: number | null;
  description: string;
  fileUrl: string;
  fileType: string;
  displayOrder: number;
  isActive: boolean;
}>) {
  const fields: string[] = [];
  const values: unknown[] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${snakeKey} = ?`);
      if (key === 'isActive') {
        values.push(value ? 1 : 0);
      } else {
        values.push(value);
      }
    }
  });

  if (fields.length === 0) return getCertificateById(id);

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  run(`UPDATE certificates SET ${fields.join(', ')} WHERE id = ?`, values);
  save();
  return getCertificateById(id);
}

export function deleteCertificate(id: number) {
  run('DELETE FROM certificates WHERE id = ?', [id]);
  save();
}

export function getAllHistory(activeOnly = true) {
  let query = 'SELECT * FROM history_timeline';
  if (activeOnly) query += ' WHERE is_active = 1';
  query += ' ORDER BY year DESC, display_order';
  return all(query).map(mapRow);
}

export function getHistoryById(id: number) {
  const h = get('SELECT * FROM history_timeline WHERE id = ?', [id]);
  return h ? mapRow(h) : null;
}

export function createHistory(data: {
  year: number;
  title: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}) {
  const result = run(`
    INSERT INTO history_timeline (year, title, description, image_url, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    data.year,
    data.title,
    data.description ?? null,
    data.imageUrl ?? null,
    data.displayOrder ?? 0,
    data.isActive ? 1 : 0
  ]);
  save();
  return getHistoryById(result.lastInsertRowid as number);
}

export function updateHistory(id: number, data: Partial<{
  year: number;
  title: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}>) {
  const fields: string[] = [];
  const values: unknown[] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${snakeKey} = ?`);
      if (key === 'isActive') {
        values.push(value ? 1 : 0);
      } else {
        values.push(value);
      }
    }
  });

  if (fields.length === 0) return getHistoryById(id);

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  run(`UPDATE history_timeline SET ${fields.join(', ')} WHERE id = ?`, values);
  save();
  return getHistoryById(id);
}

export function deleteHistory(id: number) {
  run('DELETE FROM history_timeline WHERE id = ?', [id]);
  save();
}

export function getCompanyContent(key: string) {
  const row = get('SELECT * FROM company_content WHERE section_key = ?', [key]);
  return row ? mapRow(row) : null;
}

export function getAllCompanyContent() {
  return all('SELECT * FROM company_content').map(mapRow);
}

export function upsertCompanyContent(data: {
  sectionKey: string;
  title?: string;
  content?: string;
  imageUrl?: string | null;
  metaData?: Record<string, unknown>;
}) {
  const existing = getCompanyContent(data.sectionKey);
  if (existing) {
    run(`
      UPDATE company_content SET title = ?, content = ?, image_url = ?, meta_data = ?, updated_at = CURRENT_TIMESTAMP
      WHERE section_key = ?
    `, [data.title ?? null, data.content ?? null, data.imageUrl ?? null, JSON.stringify(data.metaData ?? {}), data.sectionKey]);
  } else {
    run(`
      INSERT INTO company_content (section_key, title, content, image_url, meta_data)
      VALUES (?, ?, ?, ?, ?)
    `, [data.sectionKey, data.title ?? null, data.content ?? null, data.imageUrl ?? null, JSON.stringify(data.metaData ?? {})]);
  }
  save();
  return getCompanyContent(data.sectionKey);
}

export function getAllFaqs(activeOnly = true) {
  let query = 'SELECT * FROM faqs';
  if (activeOnly) query += ' WHERE is_active = 1';
  query += ' ORDER BY display_order, id';
  return all(query).map(mapRow);
}

export function getFaqById(id: number) {
  const row = get('SELECT * FROM faqs WHERE id = ?', [id]);
  return row ? mapRow(row) : null;
}

export function createFaq(data: {
  question: string;
  answer: string;
  category?: string;
  displayOrder?: number;
  isActive?: boolean;
}) {
  const result = run(`
    INSERT INTO faqs (question, answer, category, display_order, is_active)
    VALUES (?, ?, ?, ?, ?)
  `, [data.question, data.answer, data.category ?? null, data.displayOrder ?? 0, data.isActive ? 1 : 0]);
  save();
  return getFaqById(result.lastInsertRowid as number);
}

export function updateFaq(id: number, data: Partial<{
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isActive: boolean;
}>) {
  const fields: string[] = [];
  const values: unknown[] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${snakeKey} = ?`);
      if (key === 'isActive') {
        values.push(value ? 1 : 0);
      } else {
        values.push(value);
      }
    }
  });

  if (fields.length === 0) return getFaqById(id);

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  run(`UPDATE faqs SET ${fields.join(', ')} WHERE id = ?`, values);
  save();
  return getFaqById(id);
}

export function deleteFaq(id: number) {
  run('DELETE FROM faqs WHERE id = ?', [id]);
  save();
}

export function getAllContactMessages(options: { page?: number; limit?: number; unreadOnly?: boolean } = {}) {
  const { page = 1, limit = 20, unreadOnly = false } = options;
  const offset = (page - 1) * limit;

  let where = 'WHERE 1=1';
  const params: unknown[] = [];

  if (unreadOnly) {
    where += ' AND is_read = 0';
  }

  const totalResult = get(`SELECT COUNT(*) as count FROM contact_messages ${where}`, params) as { count: number } | undefined;
  const total = totalResult?.count ?? 0;
  const messages = all(`SELECT * FROM contact_messages ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);

  return {
    data: messages.map(mapRow),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export function getContactMessageById(id: number) {
  const row = get('SELECT * FROM contact_messages WHERE id = ?', [id]);
  return row ? mapRow(row) : null;
}

export function createContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  run(`
    INSERT INTO contact_messages (name, email, phone, subject, message)
    VALUES (?, ?, ?, ?, ?)
  `, [data.name, data.email, data.phone ?? null, data.subject ?? null, data.message]);
  save();
}

export function markContactMessageRead(id: number) {
  run('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [id]);
  save();
}

export function deleteContactMessage(id: number) {
  run('DELETE FROM contact_messages WHERE id = ?', [id]);
  save();
}

export function getUnreadContactCount() {
  const row = get('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0') as { count: number } | undefined;
  return row ?? { count: 0 };
}