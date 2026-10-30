import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';
import bcrypt from 'bcryptjs';
import { initializeDatabase, run, get, save } from '../models/database.js';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = join(__dirname, '..', '..', 'data');

function loadJson(filename: string): unknown {
  const path = join(dataDir, filename);
  if (!existsSync(path)) {
    console.warn(`Data file not found: ${path}`);
    return null;
  }
  return JSON.parse(readFileSync(path, 'utf-8'));
}

async function seed() {
  console.log('Starting database seed...');
  
  await initializeDatabase();

  // Create or update admin user
  const adminExists = get('SELECT id FROM users WHERE email = ?', [config.admin.email]);
  if (!adminExists) {
    const hash = await bcrypt.hash(config.admin.password, 12);
    run('INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)', 
      [config.admin.email, hash, 'Admin User', 'admin']);
    save();
    console.log('Created admin user:', config.admin.email);
  } else {
    const hash = await bcrypt.hash(config.admin.password, 12);
    run(`
      UPDATE users
      SET password_hash = ?, name = ?, role = ?, updated_at = CURRENT_TIMESTAMP
      WHERE email = ?
    `, [hash, 'Admin User', 'admin', config.admin.email]);
    save();
    console.log('Updated admin user:', config.admin.email);
  }

  // Seed Products
  const productsData = loadJson('products.json') as Array<{
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
  }> || [];

  for (const p of productsData) {
    const existing = get('SELECT id FROM products WHERE slug = ?', [p.slug]);
    if (!existing) {
      run(`
        INSERT INTO products (slug, name, description, features, price, contact_for_price, category, images, in_stock, display_order, meta_title, meta_description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        p.slug, p.name, p.description, JSON.stringify(p.features),
        p.price, p.contactForPrice ? 1 : 0, p.category,
        JSON.stringify(p.images), p.inStock ? 1 : 0, p.displayOrder,
        p.metaTitle, p.metaDescription
      ]);
      save();
      console.log(`Seeded product: ${p.name}`);
    } else {
      run(`
        UPDATE products
        SET name = ?, description = ?, features = ?, price = ?, contact_for_price = ?, category = ?, images = ?, in_stock = ?, display_order = ?, meta_title = ?, meta_description = ?, updated_at = CURRENT_TIMESTAMP
        WHERE slug = ?
      `, [
        p.name, p.description, JSON.stringify(p.features),
        p.price, p.contactForPrice ? 1 : 0, p.category,
        JSON.stringify(p.images), p.inStock ? 1 : 0, p.displayOrder,
        p.metaTitle, p.metaDescription,
        p.slug
      ]);
      save();
      console.log(`Updated product: ${p.name}`);
    }
  }

  // Seed Water Types
  const waterTypesData = loadJson('water-types.json') as Array<{
    name: string;
    phMin: number | null;
    phMax: number | null;
    description: string;
    uses: string[];
    color: string;
    displayOrder: number;
    isActive: boolean;
  }> || [];

  for (const w of waterTypesData) {
    const existing = get('SELECT id FROM water_types WHERE name = ?', [w.name]);
    if (!existing) {
      run(`
        INSERT INTO water_types (name, ph_min, ph_max, description, uses, color, display_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        w.name, w.phMin, w.phMax, w.description,
        JSON.stringify(w.uses), w.color, w.displayOrder, w.isActive ? 1 : 0
      ]);
      save();
      console.log(`Seeded water type: ${w.name}`);
    } else {
      run(`
        UPDATE water_types
        SET ph_min = ?, ph_max = ?, description = ?, uses = ?, color = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        w.phMin, w.phMax, w.description,
        JSON.stringify(w.uses), w.color, w.displayOrder, w.isActive ? 1 : 0,
        (existing as { id: number }).id
      ]);
      save();
      console.log(`Updated water type: ${w.name}`);
    }
  }

  // Seed Certificates
  const certificatesData = loadJson('certificates.json') as Array<{
    title: string;
    issuingBody: string;
    year: number | null;
    description: string;
    fileUrl: string;
    fileType: string;
    displayOrder: number;
    isActive: boolean;
  }> || [];

  for (const c of certificatesData) {
    const existing = get('SELECT id FROM certificates WHERE title = ?', [c.title]);
    if (!existing) {
      run(`
        INSERT INTO certificates (title, issuing_body, year, description, file_url, file_type, display_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        c.title, c.issuingBody, c.year, c.description,
        c.fileUrl, c.fileType, c.displayOrder, c.isActive ? 1 : 0
      ]);
      save();
      console.log(`Seeded certificate: ${c.title}`);
    }
  }

  // Seed History
  const historyData = loadJson('history.json') as Array<{
    year: number;
    title: string;
    description: string;
    imageUrl: string | null;
    displayOrder: number;
    isActive: boolean;
  }> || [];

  for (const h of historyData) {
    const existing = get('SELECT id FROM history_timeline WHERE year = ? AND title = ?', [h.year, h.title]);
    if (!existing) {
      run(`
        INSERT INTO history_timeline (year, title, description, image_url, display_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [h.year, h.title, h.description, h.imageUrl, h.displayOrder, h.isActive ? 1 : 0]);
      save();
      console.log(`Seeded history: ${h.year} - ${h.title}`);
    }
  }

  // Seed Company Content
  const companyData = loadJson('company.json') as Record<string, {
    title: string;
    content: string;
    imageUrl: string | null;
    metaData: Record<string, unknown>;
  }> || {};

  for (const [key, value] of Object.entries(companyData)) {
    const existing = get('SELECT id FROM company_content WHERE section_key = ?', [key]);
    if (existing) {
      run(`
        UPDATE company_content SET title = ?, content = ?, image_url = ?, meta_data = ?, updated_at = CURRENT_TIMESTAMP
        WHERE section_key = ?
      `, [value.title, value.content, value.imageUrl, JSON.stringify(value.metaData), key]);
    } else {
      run(`
        INSERT INTO company_content (section_key, title, content, image_url, meta_data)
        VALUES (?, ?, ?, ?, ?)
      `, [key, value.title, value.content, value.imageUrl, JSON.stringify(value.metaData)]);
    }
    save();
    console.log(`Seeded company content: ${key}`);
  }

  // Seed FAQs
  const faqsData = loadJson('faqs.json') as Array<{
    question: string;
    answer: string;
    category: string;
    displayOrder: number;
    isActive: boolean;
  }> || [];

  for (const f of faqsData) {
    const existing = get('SELECT id FROM faqs WHERE question = ?', [f.question]);
    if (!existing) {
      run(`
        INSERT INTO faqs (question, answer, category, display_order, is_active)
        VALUES (?, ?, ?, ?, ?)
      `, [f.question, f.answer, f.category, f.displayOrder, f.isActive ? 1 : 0]);
      save();
      console.log(`Seeded FAQ: ${f.question.substring(0, 50)}...`);
    }
  }

  // Seed Hero Content
  const heroData = loadJson('hero.json') as {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaLink: string;
    backgroundImageUrl: string | null;
    backgroundVideoUrl: string | null;
    isActive: boolean;
  } | null;

  if (heroData) {
    const hero = get('SELECT id FROM hero_content WHERE is_active = 1 LIMIT 1');
    if (hero) {
      run(`
        UPDATE hero_content SET 
          headline = ?, subheadline = ?, cta_text = ?, cta_link = ?, 
          background_image_url = ?, background_video_url = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        heroData.headline, heroData.subheadline, heroData.ctaText, heroData.ctaLink,
        heroData.backgroundImageUrl, heroData.backgroundVideoUrl, heroData.isActive ? 1 : 0, (hero as any).id
      ]);
      save();
      console.log('Updated hero content');
    }
  }

  console.log('Database seed completed!');
}

seed().catch(console.error);