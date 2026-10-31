import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/helpers';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1" id="main-content" role="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:block">
        <AdminSidebar />
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="font-display font-semibold text-gray-900">Admin Menu</span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Open navigation"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAuth();
  const { pathname } = useLocation();

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
        <Link
          key={item.href}
          to={item.href}
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
            pathname === item.href
              ? 'bg-water-50 text-water-700 font-medium'
              : 'text-gray-700 hover:bg-gray-100 hover:text-water-700'
          )}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
      <div className="pt-4 mt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => { onNavigate?.(); void logout(); }}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}