import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, Droplet } from 'lucide-react';
import { floatAnimation } from '../../utils/animations';
import { Button } from '../../components/ui/Button';
import { useSettings } from '../../context/SettingsContext';

export function NotFoundPage() {
  const { settings } = useSettings();
  const siteName = settings.site_name || 'K.D Kangen Water';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-water-50 via-white to-aqua-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={floatAnimation}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-water-500 to-aqua-500 mb-8"
        >
          <Droplet className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="mb-6"
        >
          <span className="font-display font-bold text-9xl sm:text-12xl text-water-200">404</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 text-lg mb-10 max-w-md mx-auto"
        >
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link to="/">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto">
            <Link to="/products">
              <Search className="w-5 h-5 mr-2" />
              Browse Products
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-gray-500 text-sm">
            <Link to="/" className="hover:text-water-600 transition-colors">{siteName}</Link> - Authorized Enagic Distributor
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed bottom-8 right-8"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <button className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow" onClick={() => window.history.back()}>
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      </motion.div>
    </div>
  );
}