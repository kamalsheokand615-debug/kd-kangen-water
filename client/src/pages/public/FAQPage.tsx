import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations';
import { useFaqs } from '../../hooks/useApi';
import { useSettings } from '../../context/SettingsContext';
import { FAQ } from '../../utils/types';
import { cn } from '../../utils/helpers';

export function FAQPage() {
  const { faqs, loading } = useFaqs();
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const whatsapp = settings.whatsapp || '919896007699';

  const activeFaqs = faqs.filter(f => f.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
  const categories: string[] = ['all', ...new Set(activeFaqs.map(f => f.category).filter((c): c is string => Boolean(c)))];

  const filteredFaqs = activeFaqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
              Frequently Asked Questions
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Your Questions, Answered
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Find answers to common questions about Kangen Water®, Enagic machines, maintenance, and more.
              Can't find what you're looking for? Contact us directly.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="faq-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
            variants={fadeInUp}
          >
            <div className="relative max-w-xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input pl-12 w-full"
                aria-label="Search FAQs"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="FAQ categories">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setExpandedIndex(null); }}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all',
                    activeCategory === cat
                      ? 'bg-water-700 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {cat === 'all' ? 'All Questions' : cat}
                </button>
              ))}
            </div>
          </motion.div>

          {filteredFaqs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter.</p>
              <button onClick={() => { setSearchTerm(''); setActiveCategory('all'); }} className="btn-secondary">
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-4xl mx-auto"
            >
              <AnimatePresence mode="popLayout">
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    variants={staggerItem}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <FAQItem
                      faq={faq}
                      index={index}
                      isExpanded={expandedIndex === index}
                      onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <section className="section bg-gray-50" aria-labelledby="contact-cta-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 id="contact-cta-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Our team of Kangen Water experts is here to help. Get personalized answers to your specific questions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="btn-primary text-lg px-10 py-4">Contact Us</Link>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-accent text-lg px-10 py-4">
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ faq, index, isExpanded, onToggle }: { faq: FAQ; index: number; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div className="card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-water-500 focus:ring-offset-2 rounded-xl"
        aria-expanded={isExpanded}
        aria-controls={`faq-answer-${index}`}
      >
        <div className="flex items-start gap-4 flex-1 pr-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-water-100 flex items-center justify-center text-water-700 font-bold text-lg">
            {index + 1}
          </span>
          <h3 className="font-semibold text-gray-900 text-lg">{faq.question}</h3>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-water-600"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`faq-answer-${index}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
            role="region"
            aria-label={`Answer to: ${faq.question}`}
          >
            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed pt-4 border-t border-gray-100" dangerouslySetInnerHTML={{ __html: faq.answer }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}