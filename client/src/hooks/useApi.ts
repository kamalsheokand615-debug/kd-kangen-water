import { useState, useEffect, useCallback } from 'react';
import { api, PaginatedResponse } from '../utils/api';
import type { Product, WaterType, Certificate, HistoryEntry, FAQ, ContactMessage, CompanyContent, DashboardStats } from '../utils/api';

export type { Product, WaterType, Certificate, HistoryEntry, FAQ, ContactMessage, HeroContent, SiteSettings, User, CompanyContent, DashboardStats, PaginationParams } from '../utils/api';

export function useProducts(params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  inStock?: boolean;
} = {}) {
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = JSON.stringify(params);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<PaginatedResponse<Product>>('/products', { params: JSON.parse(paramsKey) as typeof params });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [paramsKey]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return { data, loading, error, refetch: fetchProducts };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get<Product>(`/products/${slug}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    if (slug) void fetchProduct();
  }, [slug]);

  return { product, loading, error };
}

export function useWaterTypes() {
  const [waterTypes, setWaterTypes] = useState<WaterType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWaterTypes = async () => {
      try {
        const response = await api.get<WaterType[]>('/water-types');
        setWaterTypes(response.data);
      } catch (err) {
        setError('Failed to load water types');
      } finally {
        setLoading(false);
      }
    };
    void fetchWaterTypes();
  }, []);

  return { waterTypes, loading, error };
}

export function useCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await api.get<Certificate[]>('/certificates');
        setCertificates(response.data);
      } catch (err) {
        setError('Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };
    void fetchCertificates();
  }, []);

  return { certificates, loading, error };
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get<HistoryEntry[]>('/history');
        setHistory(response.data);
      } catch (err) {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    void fetchHistory();
  }, []);

  return { history, loading, error };
}

export function useCompanyContent() {
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get<Record<string, unknown>>('/company-content');
        setContent(response.data);
      } catch (err) {
        setError('Failed to load company content');
      } finally {
        setLoading(false);
      }
    };
    void fetchContent();
  }, []);

  return { content, loading, error };
}

export function useFaqs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await api.get<FAQ[]>('/faqs');
        setFaqs(response.data);
      } catch (err) {
        setError('Failed to load FAQs');
      } finally {
        setLoading(false);
      }
    };
    void fetchFaqs();
  }, []);

  return { faqs, loading, error };
}

// Admin hooks
export function useAdminProducts(params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}) {
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = JSON.stringify(params);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<PaginatedResponse<Product>>('/admin/products', { params: JSON.parse(paramsKey) as typeof params });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [paramsKey]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return { data, loading, error, refetch: fetchProducts };
}

export function useAdminWaterTypes() {
  const [waterTypes, setWaterTypes] = useState<WaterType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWaterTypes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<WaterType[]>('/admin/water-types');
      setWaterTypes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load water types');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchWaterTypes();
  }, [fetchWaterTypes]);

  return { waterTypes, loading, error, refetch: fetchWaterTypes };
}

export function useAdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<Certificate[]>('/admin/certificates');
      setCertificates(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCertificates();
  }, [fetchCertificates]);

  return { certificates, loading, error, refetch: fetchCertificates };
}

export function useAdminHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<HistoryEntry[]>('/admin/history');
      setHistory(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  return { history, loading, error, refetch: fetchHistory };
}

export function useAdminCompanyContent() {
  const [content, setContent] = useState<CompanyContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<CompanyContent[]>('/admin/company-content');
      setContent(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load company content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchContent();
  }, [fetchContent]);

  return { content, loading, error, refetch: fetchContent };
}

export function useAdminFaqs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaqs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<FAQ[]>('/admin/faqs');
      setFaqs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFaqs();
  }, [fetchFaqs]);

  return { faqs, loading, error, refetch: fetchFaqs };
}

export function useAdminContactMessages(params: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
} = {}) {
  const [data, setData] = useState<PaginatedResponse<ContactMessage> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = JSON.stringify(params);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<PaginatedResponse<ContactMessage>>('/admin/contact-messages', { params: JSON.parse(paramsKey) as typeof params });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [paramsKey]);

  useEffect(() => {
    void fetchMessages();
  }, [fetchMessages]);

  return { data, loading, error, refetch: fetchMessages };
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get<DashboardStats>('/admin/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}