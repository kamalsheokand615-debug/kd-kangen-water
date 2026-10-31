import multer from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { config } from '../config/index.js';
import { AppError } from './errorHandler.js';

const uploadDir = config.upload.dir;

if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const allowedPdfTypes = ['application/pdf'];
  const allowedTypes = [...allowedImageTypes, ...allowedPdfTypes];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new AppError('Only images (JPEG, PNG, WebP, GIF) and PDFs are allowed', 400));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxSize,
    files: 10,
  },
});

export const uploadSingle = (fieldName: string) => upload.single(fieldName);
export const uploadArray = (fieldName: string, maxCount: number) => upload.array(fieldName, maxCount);
export const uploadFields = (fields: multer.Field[]) => upload.fields(fields);