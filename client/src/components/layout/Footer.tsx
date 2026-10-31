import { Link } from 'react-router-dom';
import { Droplet, Facebook, Instagram, Youtube, Linkedin, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { useSettings } from '../../context/SettingsContext';
import { navLinks } from './navigation';

export function Footer() {
  const { settings } = useSettings();

  const siteName = settings.site_name || 'K.D Kangen Water';
  const tagline = settings.site_tagline || '';
  const phone = settings.phone || '+91-9896007699';
  const whatsapp = settings.whatsapp || '919896007699';
  const email = settings.email || 'info@kdkangenwater.com';
  const address = settings.address || 'Badanpur, Narwana, Jind, Haryana';
  const facebookUrl = settings.facebook_url || '#';
  const instagramUrl = settings.instagram_url || '#';
  const youtubeUrl = settings.youtube_url || '#';
  const linkedinUrl = settings.linkedin_url || '#';
  const footerText = settings.footer_text || `© 2024 ${siteName}. All rights reserved.`;
  const disclaimerText = settings.disclaimer_text || 'This is an independent website of an authorized distributor/representative (K.D). Enagic trademarks belong to Enagic Co., Ltd. The information provided is as stated by the manufacturer and is not medical advice.';

  const socialLinks = [
    { href: facebookUrl, icon: Facebook, label: 'Facebook', color: 'hover:text-blue-600' },
    { href: instagramUrl, icon: Instagram, label: 'Instagram', color: 'hover:text-pink-600' },
    { href: youtubeUrl, icon: Youtube, label: 'YouTube', color: 'hover:text-red-600' },
    { href: linkedinUrl, icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-700' },
  ].filter(link => link.href && link.href !== '#');

  return (
    <footer className="bg-gray-900 text-gray-300" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label={`${siteName} - Home`}>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-water-500 to-aqua-500 flex items-center justify-center">
                <Droplet className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="font-display font-semibold text-xl text-white">{siteName}</span>
                {tagline && tagline.trim() && <span className="block text-xs text-gray-400 font-sans">{tagline}</span>}
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-xs">
              Your trusted authorized distributor for Enagic Kangen Water® machines in India.
              Experience the power of alkaline, hydrogen-rich, antioxidant water for true health.
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map(({ href, icon: Icon, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('p-2 rounded-lg bg-gray-800 text-gray-400 transition-colors', color)}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-medium text-lg text-white mb-4">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link to={href} className="hover:text-water-400 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="font-display font-medium text-lg text-white mb-4">Products</h3>
            <nav aria-label="Product categories">
              <ul className="space-y-2">
                <li><Link to="/products?category=Water%20Ionizers" className="hover:text-water-400 transition-colors">Water Ionizers</Link></li>
                <li><Link to="/products?category=Shower%20Systems" className="hover:text-water-400 transition-colors">Shower Systems</Link></li>
                <li><Link to="/products?category=Commercial" className="hover:text-water-400 transition-colors">Commercial</Link></li>
                <li><Link to="/products?category=Filters%20%26%20Accessories" className="hover:text-water-400 transition-colors">Filters & Accessories</Link></li>
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="font-display font-medium text-lg text-white mb-4">Contact Us</h3>
            <address className="not-italic space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-water-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm">{address}</p>
              </div>
              <a href={`tel:${phone}`} className="flex items-center gap-3 hover:text-water-400 transition-colors">
                <Phone className="w-5 h-5 text-water-400 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm">{phone}</span>
              </a>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-water-400 transition-colors">
                <MessageCircle className="w-5 h-5 text-green-500 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm">WhatsApp</span>
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-3 hover:text-water-400 transition-colors">
                <Mail className="w-5 h-5 text-water-400 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm">{email}</span>
              </a>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>{footerText}</p>
            <p className="text-center md:text-left max-w-3xl">
              {disclaimerText}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}