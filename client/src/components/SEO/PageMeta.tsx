import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type PageMeta = {
  title: string;
  description: string;
  noindex?: boolean;
};

const DEFAULT_META: PageMeta = {
  title: 'K.D Kangen Water | Water Ionizer | Authorized Enagic Kangen Water® Distributor',
  description:
    'K.D Kangen Water is an authorized independent Enagic distributor offering Kangen Water® ionizers, Leveluk® machines, product certifications, and warranty support.',
};

const PAGE_META: Record<string, PageMeta> = {
  '/': DEFAULT_META,
  '/about': {
    title: 'About Us | K.D Kangen Water',
    description:
      'Learn about K.D Kangen Water, an authorized independent Enagic distributor, and our mission to bring Kangen Water® ionizers to homes and businesses.',
  },
  '/water-types': {
    title: 'Water Types | K.D Kangen Water',
    description:
      'Explore the different Kangen Water® types — strong acidic, acidic, clean, green, drinking, beauty, and strong Kangen water — and their uses.',
  },
  '/products': {
    title: 'Kangen Water Machines | K.D Kangen Water',
    description:
      'Browse Enagic Kangen Water® ionizer machines, including Leveluk® models, with specifications, pricing, and features.',
  },
  '/products/compare': {
    title: 'Compare Kangen Water Machines | K.D Kangen Water',
    description:
      'Compare Enagic Kangen Water® machines side by side to find the right ionizer for your home or business.',
  },
  '/certificates': {
    title: 'Certifications | K.D Kangen Water',
    description:
      'View K.D Kangen Water certifications, including WQA and Enagic product certifications for Kangen Water® machines.',
  },
  '/contact': {
    title: 'Contact Us | K.D Kangen Water',
    description:
      'Get in touch with K.D Kangen Water for Kangen Water® machine enquiries, demonstrations, pricing, and support.',
  },
  '/warranty': {
    title: 'Warranty | K.D Kangen Water',
    description:
      'Warranty information and support for Enagic Kangen Water® machines distributed by K.D Kangen Water.',
  },
};

const ADMIN_META: PageMeta = {
  title: 'Admin | K.D Kangen Water',
  description: 'Administration panel for K.D Kangen Water.',
  noindex: true,
};

const NOT_FOUND_META: PageMeta = {
  title: 'Page Not Found | K.D Kangen Water',
  description: 'The page you are looking for does not exist on the K.D Kangen Water website.',
  noindex: true,
};

function resolveMeta(pathname: string): PageMeta {
  if (pathname.startsWith('/admin')) return ADMIN_META;
  if (pathname.startsWith('/products/')) {
    return {
      title: 'Kangen Water Machines | K.D Kangen Water',
      description:
        'Detailed specifications, features, and pricing for Enagic Kangen Water® ionizer machines from K.D Kangen Water.',
    };
  }
  return PAGE_META[pathname] ?? NOT_FOUND_META;
}

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = resolveMeta(pathname);
    const canonical = `${window.location.origin}${pathname}`;

    document.title = meta.title;
    upsertMeta('meta[name="description"]', 'name', 'description', meta.description);
    upsertCanonical(canonical);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', meta.title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', meta.description);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    upsertMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      meta.noindex ? 'noindex, nofollow' : 'index, follow'
    );
  }, [pathname]);

  return null;
}