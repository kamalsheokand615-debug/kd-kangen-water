import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import initSqlJs, { Database } from 'sql.js';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = config.database.path;
const dbDir = dirname(dbPath);

if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

let db: Database | null = null;

export async function initializeDatabase() {
  const SQL = await initSqlJs({
    locateFile: () => join(__dirname, '..', '..', 'sql-wasm.wasm'),
  });

  let sqlDb: Database;
  
  if (existsSync(dbPath)) {
    const fileBuffer = readFileSync(dbPath);
    sqlDb = new SQL.Database(fileBuffer);
    createTables(sqlDb);
  } else {
    sqlDb = new SQL.Database();
    createTables(sqlDb);
    saveDatabase(sqlDb);
  }

  db = sqlDb;
  console.log('Database initialized successfully with sql.js');
  return db;
}

function saveDatabase(sqlDb: Database) {
  const data = sqlDb.export();
  writeFileSync(dbPath, Buffer.from(data));
}

function createTables(sqlDb: Database) {
  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      features TEXT,
      price INTEGER,
      contact_for_price BOOLEAN DEFAULT 0,
      category TEXT,
      images TEXT,
      in_stock BOOLEAN DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      meta_title TEXT,
      meta_description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS water_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ph_min REAL,
      ph_max REAL,
      description TEXT,
      uses TEXT,
      color TEXT,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      issuing_body TEXT,
      year INTEGER,
      description TEXT,
      file_url TEXT,
      file_type TEXT DEFAULT 'image',
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS history_timeline (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS company_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_key TEXT UNIQUE NOT NULL,
      title TEXT,
      content TEXT,
      image_url TEXT,
      meta_data TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS hero_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      headline TEXT,
      subheadline TEXT,
      cta_text TEXT,
      cta_link TEXT,
      background_image_url TEXT,
      background_video_url TEXT,
      is_active BOOLEAN DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key TEXT UNIQUE NOT NULL,
      setting_value TEXT,
      setting_type TEXT DEFAULT 'text',
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default site settings
  const defaultSettings = [
    { key: 'site_name', value: 'K.D Kangen Water', type: 'text', desc: 'Website name' },
    { key: 'site_tagline', value: 'Authorized Enagic Distributor', type: 'text', desc: 'Tagline' },
    { key: 'phone', value: '+91-9896007699', type: 'text', desc: 'Contact phone' },
    { key: 'whatsapp', value: '919896007699', type: 'text', desc: 'WhatsApp number (with country code, no +)' },
    { key: 'email', value: 'info@kdkangenwater.com', type: 'text', desc: 'Contact email' },
    { key: 'address', value: 'Badanpur, Narwana, Jind, Haryana', type: 'text', desc: 'Physical address' },
    { key: 'facebook_url', value: '', type: 'text', desc: 'Facebook page URL' },
    { key: 'instagram_url', value: '', type: 'text', desc: 'Instagram profile URL' },
    { key: 'youtube_url', value: '', type: 'text', desc: 'YouTube channel URL' },
    { key: 'linkedin_url', value: '', type: 'text', desc: 'LinkedIn page URL' },
    { key: 'footer_text', value: '© 2024 K.D Kangen Water. Authorized Enagic Distributor. All rights reserved.', type: 'text', desc: 'Footer copyright text' },
    { key: 'seo_title', value: 'K.D Kangen Water - Authorized Enagic Distributor | Kangen Water Machines India', type: 'text', desc: 'Default SEO title' },
    { key: 'seo_description', value: 'Official authorized distributor of Enagic Kangen Water machines in India. Discover the 7 types of water, certified products, and health benefits.', type: 'text', desc: 'Default SEO description' },
    { key: 'og_image', value: '', type: 'image', desc: 'Default Open Graph image' },
    { key: 'disclaimer_text', value: 'This is an independent website of an authorized distributor/representative (K.D). Enagic trademarks belong to Enagic Co., Ltd. The information provided is as stated by the manufacturer and is not medical advice.', type: 'text', desc: 'Footer disclaimer' },
  ];

  const insertSetting = sqlDb.prepare(`
    INSERT OR IGNORE INTO site_settings (setting_key, setting_value, setting_type, description)
    VALUES (?, ?, ?, ?)
  `);

  for (const s of defaultSettings) {
    insertSetting.run([s.key, s.value, s.type, s.desc]);
  }

  // Insert default hero content
  const heroCount = sqlDb.exec('SELECT COUNT(*) as count FROM hero_content');
  if (heroCount.length === 0 || heroCount[0].values[0][0] === 0) {
    sqlDb.prepare(`
      INSERT INTO hero_content (headline, subheadline, cta_text, cta_link, is_active)
      VALUES (?, ?, ?, ?, 1)
    `).run([
      'Experience the Power of Kangen Water®',
      'Transform your tap water into healthy, alkaline, antioxidant-rich water with Enagic\'s certified medical-grade ionizers.',
      'Explore Products',
      '/products'
    ]);
  }

  saveDatabase(sqlDb);
}

export function getDb() {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export function run(sql: string, params: unknown[] = []) {
  const stmt = getDb().prepare(sql);
  stmt.bind(params);
  stmt.run();
  stmt.free();
  saveDatabase(getDb());
  return { lastInsertRowid: getDb().exec('SELECT last_insert_rowid()')[0].values[0][0] };
}

export function get(sql: string, params: unknown[] = []) {
  const stmt = getDb().prepare(sql);
  stmt.bind(params);
  const hasRow = stmt.step();
  const result = hasRow ? stmt.getAsObject() : null;
  stmt.free();
  return result;
}

export function all(sql: string, params: unknown[] = []) {
  const stmt = getDb().prepare(sql);
  stmt.bind(params);
  const results: Record<string, unknown>[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push(row);
  }
  stmt.free();
  return results;
}

export function exec(sql: string) {
  return getDb().exec(sql);
}

export function save() {
  if (db) {
    saveDatabase(db);
  }
}