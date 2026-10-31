import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, ChevronRight, Loader2, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { fadeInUp } from '../../utils/animations';
import { useProducts } from '../../hooks/useApi';
import { cn, formatPrice } from '../../utils/helpers';
import type { Product } from '../../utils/types';

const MAX_COMPARE = 4;

export function ComparePage() {
  const { data, loading, error } = useProducts({ limit: 100, sortBy: 'displayOrder', sortOrder: 'asc' });
  const [searchParams, setSearchParams] = useSearchParams();

  const products = data?.data ?? [];
  const selectedSlugs = (searchParams.get('products') || '').split(',').filter(Boolean);
  const selectedProducts = selectedSlugs
    .map(slug => products.find(product => product.slug === slug))
    .filter((product): product is Product => Boolean(product));

  const toggleProduct = (slug: string) => {
    const next = selectedSlugs.includes(slug)
      ? selectedSlugs.filter(item => item !== slug)
      : [...selectedSlugs, slug].slice(-MAX_COMPARE);
    const params = new URLSearchParams(searchParams);
    if (next.length > 0) params.set('products', next.join(','));
    else params.delete('products');
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="relative">
      <section className="relative bg-gradient-to-b from-water-900 to-water-700 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6" aria-label="Breadcrumb">
              <Link to="/products" className="hover:text-white">Products</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Compare</span>
            </nav>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Compare Enagic Machines
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Select up to {MAX_COMPARE} models to compare their specifications, features, and pricing side by side.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="select-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 id="select-heading" className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-2">
                Choose models
              </h2>
              <p className="text-gray-600">
                {selectedProducts.length} of {MAX_COMPARE} selected
              </p>
            </div>
            {selectedProducts.length > 0 && (
              <button
                type="button"
                onClick={() => setSearchParams({}, { replace: true })}
                className="btn-secondary self-start sm:self-auto"
              >
                <X className="w-4 h-4" />
                Clear selection
              </button>
            )}
          </div>

          {loading && products.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-10 h-10 text-water-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map(product => {
                const isSelected = selectedSlugs.includes(product.slug);
                const isDisabled = !isSelected && selectedSlugs.length >= MAX_COMPARE;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleProduct(product.slug)}
                    disabled={isDisabled}
                    aria-pressed={isSelected}
                    className={cn(
                      'card p-4 text-left transition-all duration-200 border-2',
                      isSelected
                        ? 'border-water-500 bg-water-50/50 shadow-md'
                        : 'border-transparent hover:border-water-200',
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-3">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                          No image
                        </div>
                      )}
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-water-600 text-white flex items-center justify-center shadow">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category || 'General'}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="section bg-gray-50" aria-labelledby="compare-table-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} variants={fadeInUp}>
            <h2 id="compare-table-heading" className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-6">
              Side-by-side comparison
            </h2>

            {selectedProducts.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-gray-600 mb-4">Select at least two models above to start comparing.</p>
                <Link to="/products" className="btn-primary">Browse Products</Link>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="w-full min-w-[640px] text-left">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th scope="col" className="p-4 text-sm font-semibold text-gray-500 w-40">Specification</th>
                      {selectedProducts.map(product => (
                        <th key={product.id} scope="col" className="p-4 min-w-[180px] align-top">
                          <Link to={`/products/${product.slug}`} className="font-display font-semibold text-gray-900 hover:text-water-700">
                            {product.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleProduct(product.slug)}
                            className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                            Remove
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <CompareRow label="Price" products={selectedProducts} render={product => (
                      <span className="font-semibold text-water-700">
                        {formatPrice(product.price, product.contactForPrice)}
                      </span>
                    )} />
                    <CompareRow label="Category" products={selectedProducts} render={product => product.category || 'General'} />
                    <CompareRow label="Availability" products={selectedProducts} render={product => (
                      <span className={product.inStock ? 'text-green-700' : 'text-red-600'}>
                        {product.inStock ? 'In stock' : 'Out of stock'}
                      </span>
                    )} />
                    <CompareRow label="Key features" products={selectedProducts} render={product => (
                      <ul className="space-y-1.5">
                        {(product.features.length > 0 ? product.features.slice(0, 6) : ['Contact us for full specifications']).map(feature => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-aqua-600 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )} />
                    <CompareRow label="" products={selectedProducts} render={product => (
                      <Link to={`/contact?subject=${encodeURIComponent(`Price Inquiry: ${product.name}`)}`} className="btn-primary text-sm px-4 py-2">
                        Request quote
                      </Link>
                    )} />
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function CompareRow({
  label,
  products,
  render,
}: {
  label: string;
  products: Product[];
  render: (product: Product) => ReactNode;
}) {
  return (
    <tr className="border-b border-gray-100 last:border-0 align-top">
      <th scope="row" className="p-4 text-sm font-medium text-gray-500">{label}</th>
      {products.map(product => (
        <td key={product.id} className="p-4 text-gray-700">{render(product)}</td>
      ))}
    </tr>
  );
}
