import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { motion } from 'framer-motion';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1" id="main-content" role="main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:block">
        <AdminSidebar />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminSidebar() {
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/water-types', label: 'Water Types', icon: '💧' },
    { href: '/admin/certificates', label: 'Certificates', icon: '📜' },
    { href: '/admin/history', label: 'History', icon: '📅' },
    { href: '/admin/company-content', label: 'Company Content', icon: '🏢' },
    { href: '/admin/faqs', label: 'FAQs', icon: '❓' },
    { href: '/admin/contact-messages', label: 'Messages', icon: '📨' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="p-4 space-y-1" aria-label="Admin navigation">
      {navItems.map(item => (
        <a
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-water-700 transition-colors"
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </a>
      ))}
      <div className="pt-4 mt-4 border-t border-gray-200">
        <a
          href="/admin/logout"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}