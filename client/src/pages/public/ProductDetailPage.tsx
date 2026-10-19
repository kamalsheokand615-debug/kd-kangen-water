import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Check, Truck, Shield, Star, RotateCcw, MessageSquare, MapPin } from 'lucide-react';
import { fadeInUp } from '../../utils/animations';
import { useProduct } from '../../hooks/useApi';
import { formatPrice } from '../../utils/helpers';
import { Button } from '../../components/ui/Button';
import { Lightbox } from '../../components/ui/Lightbox';
import { cn } from '../../utils/helpers';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading, error } = useProduct(slug || '');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (loading) {
    return (
      <div className="section">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-water-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="section">
        <div className="container mx-auto px-4 text-center py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} variants={fadeInUp}>
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/products" className="btn-primary">Browse All Products</Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const lightboxItems = product.images.map((img, i) => ({
    src: img,
    alt: `${product.name} - Image ${i + 1}`,
    type: 'image' as const,
    title: product.name,
  }));

  const features = product.features.length > 0 ? product.features : [
    'Premium Enagic quality',
    'Medical-grade certification',
    'Japanese manufacturing',
    'Full manufacturer warranty',
  ];

  return (
    <div className="relative">
      <nav className="bg-gray-50 py-4" aria-label="Breadcrumb">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm text-gray-600" role="list">
            <li><Link to="/" className="hover:text-water-600">Home</Link></li>
            <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" /><Link to="/products" className="hover:text-water-600">Products</Link></li>
            <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" /><span className="text-gray-900 font-medium" aria-current="page">{product.name}</span></li>
          </ol>
        </div>
      </nav>

      <section className="section bg-white" aria-labelledby="product-name">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} variants={fadeInUp}>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-4">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    id="main-image"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6l.424-3.576a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6l.424-3.576a2 2 0 012.828 0L16 16"/>
                    </svg>
                  </div>
                )}
              </div>
              
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2" role="list" aria-label="Product images">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
                      className={cn(
                        'relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                        index === 0 ? 'border-water-500' : 'border-transparent hover:border-water-300'
                      )}
                      aria-label={`View image ${index + 1}`}
                      role="listitem"
                    >
                      <img src={img} alt={`${product.name} - View ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} variants={fadeInUp} style={{ transitionDelay: '100ms' }}>
              <div className="sticky top-24">
                <span className="inline-block px-3 py-1 rounded-full bg-water-100 text-water-700 text-sm font-medium mb-3">{product.category || 'General'}</span>
                <h1 id="product-name" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">{product.name}</h1>

                <div className="flex items-center gap-4 mb-6">
                  <span className="font-display font-bold text-3xl text-water-700">
                    {product.contactForPrice ? 'Contact for Price' : formatPrice(product.price, product.contactForPrice)}
                  </span>
                  {product.contactForPrice && (
                    <Button variant="secondary" size="sm" asChild>
                      <Link to="/contact?subject=Price+Inquiry:+{product.name}">Request Quote</Link>
                    </Button>
                  )}
                </div>

                {product.description && (
                  <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: product.description }} />
                )}

                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-gray-900">Key Features</h3>
                  <ul className="space-y-3" role="list">
                    {features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 50 }}
                        className="flex items-start gap-3"
                      >
                        <Check className="w-5 h-5 text-aqua-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Truck className="w-6 h-6 text-water-600" />
                      <div>
                        <p className="font-medium text-gray-900">Pan India Delivery</p>
                        <p className="text-sm text-gray-500">Free shipping on all machines</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Shield className="w-6 h-6 text-water-600" />
                      <div>
                        <p className="font-medium text-gray-900">5 Year Warranty</p>
                        <p className="text-sm text-gray-500">Manufacturer warranty</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <RotateCcw className="w-6 h-6 text-water-600" />
                      <div>
                        <p className="font-medium text-gray-900">Easy Returns</p>
                        <p className="text-sm text-gray-500">30-day satisfaction guarantee</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Star className="w-6 h-6 text-water-600" />
                      <div>
                        <p className="font-medium text-gray-900">Expert Support</p>
                        <p className="text-sm text-gray-500">Certified technicians available</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button size="lg" className="w-full sm:w-auto" asChild>
                      <Link to={`/contact?subject=Demo+Request:+${encodeURIComponent(product.name)}`}>
                        <MessageSquare className="w-5 h-5" />
                        Request Free Demo
                      </Link>
                    </Button>
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto" asChild>
                      <Link to="/contact">
                        <MapPin className="w-5 h-5" />
                        Find Dealer
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {product.metaDescription && (
        <section className="section bg-gray-50" aria-labelledby="specs-heading">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} variants={fadeInUp}>
              <h2 id="specs-heading" className="font-display font-bold text-2xl text-gray-900 mb-6">Specifications & Details</h2>
              <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: product.metaDescription }} />
            </motion.div>
          </div>
        </section>
      )}

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={lightboxItems}
        initialIndex={lightboxIndex}
      />
    </div>
  );
}