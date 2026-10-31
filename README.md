# K.D Kangen Water - Authorized Enagic Distributor Website

A complete, production-quality multi-page website for K.D Kangen Water, an authorized independent distributor of Enagic Kangen Water® machines. Built with React (Vite), Node.js/Express, SQLite, and Tailwind CSS.

## 🌟 Features

### Public Website
- **Home** - Animated hero with water ripple effects, brand introduction, highlights
- **About Enagic** - Company overview, founder, headquarters, manufacturing, India presence
- **History** - Animated visual timeline from 1974 to present
- **7 Types of Water** - Interactive pH scale with color-changing cards
- **Products** - Listing with filters/sort, individual detail pages, comparison table
- **Certificates** - Gallery with lightbox for images/PDFs
- **FAQ** - Accordion-style with categories
- **Contact** - Validated form, WhatsApp button, map placeholder
- **404 Page** - Friendly not-found page

### Admin Panel (`/admin`)
- Secure JWT authentication with httpOnly cookies
- Dashboard with statistics
- Full CRUD for all content types:
  - Products (with multiple image uploads, price/Contact-for-price toggle)
  - 7 Water Types
  - Certificates (image/PDF upload)
  - History Timeline
  - Company/About Content & Hero Section
  - FAQs
  - Contact Messages (view, mark read, delete)
  - Site Settings (SEO, contact info, social links, footer text)
- Responsive sidebar layout
- Toast notifications, confirmation dialogs, form validation

### Technical Features
- **Animations**: Framer Motion page transitions, scroll reveals, hover effects
- **Responsive**: Mobile-first, tablet, desktop breakpoints
- **Accessible**: Semantic HTML, ARIA labels, keyboard navigation, prefers-reduced-motion
- **SEO**: Dynamic meta tags, Open Graph, structured data (editable via admin)
- **Security**: Helmet, CORS, rate limiting, bcrypt passwords, input validation/sanitization
- **Database**: SQLite (better-sqlite3) with abstraction layer for easy MongoDB migration

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router 6, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, TypeScript |
| Database | SQLite (better-sqlite3) |
| Auth | JWT (httpOnly cookies), bcryptjs |
| Validation | Zod |
| File Upload | Multer (local) / Cloudinary (optional) |
| Email | Nodemailer (optional) |
| Dev Tools | Concurrently, tsx, ESLint |

## 📁 Project Structure

```
kd-kangen-water/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (public + admin)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context providers
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles, Tailwind config
│   └── public/
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── scripts/        # Seed, migration scripts
│   │   └── utils/          # Queries, validation schemas
│   ├── data/               # JSON seed data
│   └── uploads/            # Uploaded files
├── docs/                   # Documentation
│   └── sources.md          # Data sources & verification log
├── package.json            # Root scripts
└── .env.example            # Environment template
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone and enter directory
cd kd-kangen-water

# Install all dependencies (root, client, server)
npm install
cd client && npm install
cd ../server && npm install
cd ..

# Copy environment file and configure
cp .env.example .env
# Edit .env with your values (JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, etc.)

# Seed database with initial data
npm run seed

# Start development servers (client + server)
npm run dev
```

### Access URLs
- **Frontend:** http://localhost:4173
- **Backend API:** http://localhost:3002
- **Admin Panel:** http://localhost:4173/admin
- **Admin Login:** http://localhost:4173/admin/login

## 🔐 Admin Access

### Default Credentials (from `.env`)
- **Email:** `ADMIN_EMAIL` value (default: `admin@kdkangenwater.com`)
- **Password:** `ADMIN_PASSWORD` value (default: `ChangeMe123!`)

### First Login
1. Go to `/admin/login`
2. Enter credentials from `.env`
3. **Immediately change password** via "Change Password" in admin sidebar
4. Update `.env` with new password for future seed runs

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client & server (concurrently) |
| `npm run server` | Start server only |
| `npm run client` | Start client only |
| `npm run build` | Build both client & server for production |
| `npm run start` | Start production server |
| `npm run seed` | Seed database with JSON data + create admin |
| `npm run lint` | Lint both client & server |

## 🗄 Database & Seeding

### Seed Data Location
All content is stored in `/server/data/*.json`:
- `products.json` - Product catalog
- `water-types.json` - 7 water types with pH, uses, colors
- `certificates.json` - Certifications & approvals
- `history.json` - Timeline milestones
- `company.json` - About page sections
- `faqs.json` - Frequently asked questions
- `hero.json` - Homepage hero content

### Adding/Updating Content
1. Edit JSON files in `/server/data/`
2. Run `npm run seed` to sync to database
3. Or use Admin Panel for real-time updates (no code changes needed)

### Switching to MongoDB
The data layer is in `/server/src/utils/queries.ts`. To switch:
1. Install `mongoose`
2. Replace query functions with Mongoose models
3. Update `database.ts` connection logic
4. No changes needed in controllers/routes

## 🖼 Managing Images & Certificates

### Upload via Admin Panel
- Products: Multiple images (drag & drop)
- Certificates: Single image or PDF
- Hero/History/Company: Single image

### Files Stored
- Local: `/server/uploads/` (served at `/uploads/`)
- Cloudinary: If `CLOUDINARY_*` env vars set

### Required Manual Assets
See `docs/sources.md` for list of images/certificates you must provide:
- Product photos for all models
- Certificate PDFs/images from JQA, WQA, NSF, MHLW
- Company/founder/factory photos
- Hero background image/video
- History timeline images

## 🌐 Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=3002
CLIENT_URL=https://yourdomain.com
JWT_SECRET=your-very-long-random-secret-min-32-chars
# ... other vars
```

### Build Commands
```bash
npm run build
# Client builds to client/dist
# Server compiles to server/dist
```

### Hosting Options
- **VPS/Cloud VM:** PM2 + Nginx reverse proxy
- **Docker:** Multi-stage build (Dockerfile not included but straightforward)
- **PaaS:** Railway, Render, Fly.io (support both Node + static)
- **Static + Serverless:** Vercel/Netlify for client, separate API hosting

### Nginx Config (Example)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # API & Uploads
    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /uploads/ {
        proxy_pass http://localhost:3002;
    }
}
```

### SSL
Use Let's Encrypt (Certbot) or Cloudflare for HTTPS.

## 🔒 Security Checklist

- [ ] Change `JWT_SECRET` to strong random string (32+ chars)
- [ ] Change default admin password immediately
- [ ] Set `NODE_ENV=production`
- [ ] Configure `CLIENT_URL` to exact production domain
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Configure Cloudinary for file storage (recommended for production)
- [ ] Set up SMTP for contact form emails
- [ ] Review and customize CSP headers in `helmet()` config
- [ ] Set up regular database backups
- [ ] Monitor logs for suspicious activity

## 📝 Data Verification Required

**Before launch, you MUST verify:**

1. **Product Prices (INR)** - All set to "Contact for price". Get current MRP from Enagic India.
2. **BIS Certification** - Verify current status for India market.
3. **Certificate Documents** - Upload actual PDFs/images from certification bodies.
4. **Company Images** - Add real photos of headquarters, factory, team.
5. **Product Photos** - High-quality images for all models.
6. **Contact Information** - Update phone, WhatsApp, email, address in Site Settings.
7. **Legal Disclaimer** - Review with legal counsel for Indian regulations.

See `docs/sources.md` for complete verification log.

## 🎨 Customization

### Theme Colors
Edit `client/tailwind.config.js` - primary water theme colors defined there.

### Fonts
Google Fonts (Inter + Playfair Display) loaded in `client/index.html`.

### Animations
Framer Motion variants in `client/src/utils/animations.ts`.

## 📄 License

This project is for K.D Kangen Water authorized distributor use. Enagic trademarks (Kangen Water®, Leveluk®, Anespa®, etc.) belong to Enagic Co., Ltd.

## 🤝 Support

For technical issues with this codebase, refer to the implementation documentation.
For Enagic product/distributor inquiries, contact Enagic directly.

---

**Built with ❤️ for K.D Kangen Water**