import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Droplet } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { useSettings } from '../../context/SettingsContext';
import { navLinks } from './navigation';

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
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.472.099-.174.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378 9.86 9.86 0 01-.649-.717 28.53 28.53 0 00-.27-.953c-.099-.174-.223-.125-.422.05-.174.149-1.005 1.016-1.18 1.29-.248.373-.422.52-.57.52h-.52c-2.94 0-5.456-2.217-5.717-5.184-.149-1.634.743-3.165 2.175-3.927.879-.458 1.833-.669 2.787-.669.927 0 1.758.208 2.479.472.97.372 1.87.995 2.49 1.76.619.743 1.016 1.623 1.14 2.479.133.883.04 1.758-.18 2.494-.133.507-.619 1.577-1.475 2.36a26.77 26.77 0 01-1.107 1.535c-.208.323-.298.497-.298.694 0 .18.04.372.1.52.074.149.642 1.35 1.255 1.975.641.64 1.78 1.107 2.803 1.14.546.02 1.033-.1 1.513-.435.56-.373 1.238-1.22 1.273-1.422.025-.09.06-.209.035-.312-.036-.14-.26-.49-.669-.792-.744-.548-.84-.57-.84-.57z"/></svg>
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
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.472.099-.174.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378 9.86 9.86 0 01-.649-.717 28.53 28.53 0 00-.27-.953c-.099-.174-.223-.125-.422.05-.174.149-1.005 1.016-1.18 1.29-.248.373-.422.52-.57.52h-.52c-2.94 0-5.456-2.217-5.717-5.184-.149-1.634.743-3.165 2.175-3.927.879-.458 1.833-.669 2.787-.669.927 0 1.758.208 2.479.472.97.372 1.87.995 2.49 1.76.619.743 1.016 1.623 1.14 2.479.133.883.04 1.758-.18 2.494-.133.507-.619 1.577-1.475 2.36a26.77 26.77 0 01-1.107 1.535c-.208.323-.298.497-.298.694 0 .18.04.372.1.52.074.149.642 1.35 1.255 1.975.641.64 1.78 1.107 2.803 1.14.546.02 1.033-.1 1.513-.435.56-.373 1.238-1.22 1.273-1.422.025-.09.06-.209.035-.312-.036-.14-.26-.49-.669-.792-.744-.548-.84-.57-.84-.57z"/></svg>
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