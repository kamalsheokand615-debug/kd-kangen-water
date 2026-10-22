import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations';
import { useProducts } from '../../hooks/useApi';
import { formatPrice } from '../../utils/helpers';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { Card, CardContent, CardImage } from '../../components/ui/Card';

const categories = [
  'Water Ionizers',
  'Shower Systems',
  'Commercial',
  'Filters & Accessories',
];

const sortOptions = [
  { value: 'displayOrder', label: 'Featured' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'createdAt', label: 'Newest' },
];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'displayOrder');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');

  const { data, loading, error, refetch } = useProducts({
    page: 1,
    limit: 12,
    category: selectedCategory || undefined,
    search: searchTerm || undefined,
    sortBy,
    sortOrder: sortOrder as 'asc' | 'desc',
    inStock: inStockOnly || undefined,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy !== 'displayOrder') params.set('sortBy', sortBy);
    if (sortOrder !== 'asc') params.set('sortOrder', sortOrder);
    if (inStockOnly) params.set('inStock', 'true');
    setSearchParams(params, { replace: true });
    void refetch();
  }, [searchTerm, selectedCategory, sortBy, sortOrder, inStockOnly, setSearchParams, refetch]);

  if (loading && !data) {
    return (
      <div className="section">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-water-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <section className="relative bg-gradient-to-b from-water-900 to-water-700 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-4">
              Enagic Kangen Water® Machines
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Our Product Collection
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Explore our range of medical-grade water ionizers, shower systems, and accessories.
              All products are genuine Enagic with full manufacturer warranty.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="products-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} variants={fadeInUp}>
                <h2 id="products-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-2">
                  {data?.pagination.total || 0} Products Available
                </h2>
                <p className="text-gray-600">
                  Filter and sort to find the perfect Kangen Water machine for your needs.
                </p>
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="input pl-10 w-64"
                  aria-label="Search products"
                />
              </div>

              <Select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                options={[{ value: '', label: 'All Categories' }, ...categories.map(c => ({ value: c, label: c }))]}
                placeholder="Filter by category"
                className="w-48"
              />

              <Select
                value={`${sortBy}:${sortOrder}`}
                onChange={e => {
                  const [s, o] = e.target.value.split(':');
                  setSortBy(s);
                  setSortOrder(o as 'asc' | 'desc');
                }}
                options={sortOptions.map(o => ({ value: `${o.value}:asc`, label: o.label }))}
                placeholder="Sort by"
                className="w-48"
              />

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center gap-2"
                aria-expanded={showFilters}
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-6 bg-gray-50 rounded-xl"
              >
                <div className="flex flex-wrap gap-4 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={e => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 text-water-600 border-gray-300 rounded focus:ring-water-500"
                    />
                    <span className="text-sm text-gray-700">In stock only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm text-gray-700">Price:</span>
                    <Select
                      value={inStockOnly ? 'asc' : ''}
                      onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
                      options={[
                        { value: 'asc', label: 'Low to High' },
                        { value: 'desc', label: 'High to Low' },
                      ]}
                      className="w-40"
                    />
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8" role="alert">
              {error}
            </div>
          )}

          {data?.data.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
              <Button variant="secondary" onClick={() => { setSearchTerm(''); setSelectedCategory(''); void refetch(); }}>
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {data?.data.map(product => (
                  <motion.article key={product.id} variants={staggerItem} className="group">
                    <Link to={`/products/${product.slug}`} className="block h-full">
                      <Card className="h-full flex flex-col">
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                          {product.images.length > 0 ? (
                            <CardImage
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6l.424-3.576a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6l.424-3.576a2 2 0 012.828 0L16 16"/>
                              </svg>
                            </div>
                          )}
                          <div className="absolute top-3 left-3 flex gap-1">
                            <span className="badge-primary">{product.category || 'General'}</span>
                            {!product.inStock && <span className="badge bg-red-100 text-red-800">Out of Stock</span>}
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className="badge bg-white/90 text-gray-700 backdrop-blur-sm">
                              {product.contactForPrice ? 'Contact for Price' : formatPrice(product.price, product.contactForPrice)}
                            </span>
                          </div>
                        </div>
                        <CardContent className="flex-1 flex flex-col p-4">
                          <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                          {product.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">{product.description}</p>
                          )}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="font-semibold text-water-700 text-lg">
                              {product.contactForPrice ? 'Contact for Price' : formatPrice(product.price, product.contactForPrice)}
                            </span>
                            <span className="text-sm text-gray-500 group-hover:text-water-600 transition-colors">
                              View Details →
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>

              {data && data.pagination.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={data.pagination.page === 1}
                    onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(data.pagination.page - 1) })}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="px-4 text-gray-600">
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={data.pagination.page === data.pagination.totalPages}
                    onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(data.pagination.page + 1) })}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="section bg-gray-50" aria-labelledby="compare-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 id="compare-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              Want to Compare Models?
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Use our comparison tool to see specifications side-by-side and make an informed decision.
            </p>
            <Link to="/products/compare" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              Compare Products
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}