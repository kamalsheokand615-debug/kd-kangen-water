import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout, AdminLayout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { HistoryPage } from './pages/public/HistoryPage';
import { WaterTypesPage } from './pages/public/WaterTypesPage';
import { ProductsPage } from './pages/public/ProductsPage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { CertificatesPage } from './pages/public/CertificatesPage';
import { FAQPage } from './pages/public/FAQPage';
import { ContactPage } from './pages/public/ContactPage';
import { WarrantyPage } from './pages/public/WarrantyPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { AdminProductsPage } from './pages/admin/ProductsPage';
import { AdminWaterTypesPage } from './pages/admin/WaterTypesPage';
import { AdminCertificatesPage } from './pages/admin/CertificatesPage';
import { AdminHistoryPage } from './pages/admin/HistoryPage';
import { AdminCompanyContentPage } from './pages/admin/CompanyContentPage';
import { AdminFaqsPage } from './pages/admin/FaqsPage';
import { AdminContactMessagesPage } from './pages/admin/ContactMessagesPage';
import { AdminSettingsPage } from './pages/admin/SettingsPage';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/water-types" element={<WaterTypesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/warranty" element={<WarrantyPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

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

      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

export default App;