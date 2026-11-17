import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout, AdminLayout } from './components/layout/Layout';
import { ProtectedRoute, PublicOnlyRoute } from './components/layout/ProtectedRoute';

const HomePage = lazy(() => import('./pages/public/HomePage').then(mod => ({ default: mod.HomePage })));
const AboutPage = lazy(() => import('./pages/public/AboutPage').then(mod => ({ default: mod.AboutPage })));
const WaterTypesPage = lazy(() => import('./pages/public/WaterTypesPage').then(mod => ({ default: mod.WaterTypesPage })));
const ProductsPage = lazy(() => import('./pages/public/ProductsPage').then(mod => ({ default: mod.ProductsPage })));
const ComparePage = lazy(() => import('./pages/public/ComparePage').then(mod => ({ default: mod.ComparePage })));
const ProductDetailPage = lazy(() => import('./pages/public/ProductDetailPage').then(mod => ({ default: mod.ProductDetailPage })));
const CertificatesPage = lazy(() => import('./pages/public/CertificatesPage').then(mod => ({ default: mod.CertificatesPage })));
const ContactPage = lazy(() => import('./pages/public/ContactPage').then(mod => ({ default: mod.ContactPage })));
const WarrantyPage = lazy(() => import('./pages/public/WarrantyPage').then(mod => ({ default: mod.WarrantyPage })));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage').then(mod => ({ default: mod.NotFoundPage })));
const LoginPage = lazy(() => import('./pages/admin/LoginPage').then(mod => ({ default: mod.LoginPage })));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage').then(mod => ({ default: mod.DashboardPage })));
const AdminProductsPage = lazy(() => import('./pages/admin/ProductsPage').then(mod => ({ default: mod.AdminProductsPage })));
const AdminWaterTypesPage = lazy(() => import('./pages/admin/WaterTypesPage').then(mod => ({ default: mod.AdminWaterTypesPage })));
const AdminCertificatesPage = lazy(() => import('./pages/admin/CertificatesPage').then(mod => ({ default: mod.AdminCertificatesPage })));
const AdminHistoryPage = lazy(() => import('./pages/admin/HistoryPage').then(mod => ({ default: mod.AdminHistoryPage })));
const AdminCompanyContentPage = lazy(() => import('./pages/admin/CompanyContentPage').then(mod => ({ default: mod.AdminCompanyContentPage })));
const AdminFaqsPage = lazy(() => import('./pages/admin/FaqsPage').then(mod => ({ default: mod.AdminFaqsPage })));
const AdminContactMessagesPage = lazy(() => import('./pages/admin/ContactMessagesPage').then(mod => ({ default: mod.AdminContactMessagesPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/SettingsPage').then(mod => ({ default: mod.AdminSettingsPage })));

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/water-types" element={<WaterTypesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/compare" element={<ComparePage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/warranty" element={<WarrantyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />

      <Route element={<AdminLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/water-types" element={<AdminWaterTypesPage />} />
          <Route path="/admin/certificates" element={<AdminCertificatesPage />} />
          <Route path="/admin/history" element={<AdminHistoryPage />} />
          <Route path="/admin/company-content" element={<AdminCompanyContentPage />} />
          <Route path="/admin/faqs" element={<AdminFaqsPage />} />
          <Route path="/admin/contact-messages" element={<AdminContactMessagesPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
