import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
import { getSetting } from '../utils/queries.js';

let transporter: nodemailer.Transporter | null = null;

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  contactEmail: string;
}

function createTransporter(opts: EmailConfig) {
  return nodemailer.createTransport({
    host: opts.host,
    port: opts.port,
    secure: opts.port === 465,
    auth: {
      user: opts.user,
      pass: opts.pass,
    },
  });
}

function envEmailConfig(): EmailConfig | null {
  if (!config.email.host || !config.email.user || !config.email.pass) {
    return null;
  }
  return {
    host: config.email.host,
    port: config.email.port,
    user: config.email.user,
    pass: config.email.pass,
    from: config.email.from,
    contactEmail: config.email.contactEmail,
  };
}

function dbEmailConfig(): EmailConfig | null {
  const host = getSetting('smtp_host');
  const user = getSetting('smtp_user');
  const pass = getSetting('smtp_pass');
  if (!host || !user || !pass) {
    return null;
  }
  const portRaw = getSetting('smtp_port');
  return {
    host,
    port: portRaw ? parseInt(portRaw, 10) : 587,
    user,
    pass,
    from: getSetting('smtp_from') || config.email.from || 'noreply@example.com',
    contactEmail: getSetting('contact_email') || config.email.contactEmail || 'info@example.com',
  };
}

function resolveEmailConfig(): EmailConfig | null {
  return envEmailConfig() ?? dbEmailConfig();
}

export function isEmailConfigured(): boolean {
  return Boolean(resolveEmailConfig());
}

export function getTransporter(): nodemailer.Transporter | null {
  const cfg = resolveEmailConfig();
  if (!cfg) {
    return null;
  }
  if (config.email.host && config.email.user && config.email.pass) {
    if (!transporter) {
      transporter = createTransporter(cfg);
    }
    return transporter;
  }
  return createTransporter(cfg);
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<void> {
  const cfg = resolveEmailConfig();
  if (!cfg) {
    console.log('SMTP not configured; skipping contact notification email.');
    return;
  }

  const transport = createTransporter(cfg);
  const to = cfg.contactEmail;
  const subject = `New Contact Form Message: ${data.subject || 'No Subject'}`;
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
    <p><strong>Subject:</strong> ${data.subject || 'N/A'}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
  `;

  await transport.sendMail({
    from: cfg.from,
    to,
    subject,
    html,
    replyTo: data.email,
  });
}
