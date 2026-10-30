import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Droplet } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { useSettings } from '../../context/SettingsContext';
import { navLinks } from './navigation';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const siteName = settings.site_name || 'K.D Kangen Water';
  const whatsapp = settings.whatsapp || '91XXXXXXXXXX';

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      )}>
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2" aria-label={`${siteName} - Home`}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-water-600 to-aqua-600 flex items-center justify-center">
                <Droplet className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-semibold text-xl text-gray-900">{siteName}</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'relative py-2 text-sm font-medium transition-colors',
                    location.pathname === link.href
                      ? 'text-water-700'
                      : 'text-gray-700 hover:text-water-700'
                  )}
                >
                  {link.label}
                  {location.pathname === link.href && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      className="absolute bottom-0 left-0 h-0.5 bg-water-600 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent hidden sm:inline-flex"
              >
                <WhatsAppIcon />
                WhatsApp
              </a>
              <Link to="/admin/login" className="btn-primary">
                Admin Login
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="container px-4 py-4 space-y-2">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'block px-4 py-3 rounded-lg text-base font-medium transition-colors',
                      location.pathname === link.href
                        ? 'bg-water-50 text-water-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent flex-1 justify-center"
                  >
                    <WhatsAppIcon />
                    WhatsApp
                  </a>
                  <Link to="/admin/login" className="btn-primary flex-1 justify-center">
                    Admin Login
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="h-16 md:h-20" aria-hidden="true" />
    </>
  );
}