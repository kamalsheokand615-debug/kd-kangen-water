import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

let transporter: nodemailer.Transporter | null = null;

function createTransporter() {
  if (config.email.host && config.email.user && config.email.pass) {
    return nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }
  return null;
}

export function isEmailConfigured(): boolean {
  return Boolean(config.email.host && config.email.user && config.email.pass);
}

export function getTransporter(): nodemailer.Transporter | null {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<void> {
  const transport = getTransporter();
  if (!transport) {
    console.log('SMTP not configured; skipping contact notification email.');
    return;
  }

  const to = config.email.contactEmail;
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
    from: config.email.from,
    to,
    subject,
    html,
    replyTo: data.email,
  });
}