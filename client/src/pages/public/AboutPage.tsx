import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, Factory, Globe, Users, Award, Leaf, Zap, Shield, BookOpen } from 'lucide-react';
import { fadeInUp, staggerItem } from '../../utils/animations';
import { useCompanyContent } from '../../hooks/useApi';
import { cn } from '../../utils/helpers';

const sections = [
  { key: 'overview', icon: Building2, title: 'Company Overview' },
  { key: 'history', icon: BookOpen, title: 'Enagic & Kangen Water® History' },
  { key: 'mission', icon: Award, title: 'Mission & Philosophy' },
  { key: 'founder', icon: Users, title: 'Founder' },
  { key: 'headquarters', icon: MapPin, title: 'Headquarters & Manufacturing' },
  { key: 'manufacturing', icon: Factory, title: 'Japanese Manufacturing Excellence' },
  { key: 'india_presence', icon: Globe, title: 'Enagic in India' },
];

const highlights = [
  { icon: Award, number: '50+', label: 'Years of Excellence' },
  { icon: Globe, number: '40+', label: 'Countries Worldwide' },
  { icon: Users, number: '1M+', label: 'Machines Sold' },
  { icon: Shield, number: 'ISO 9001', label: 'Quality Certified' },
  { icon: Leaf, number: 'Eco', label: 'Friendly' },
  { icon: Zap, number: 'Medical', label: 'Grade Approved' },
];

export function AboutPage() {
  const { content, loading } = useCompanyContent();

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
              Authorized Enagic Distributor
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              About Enagic & K.D Kangen Water
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Discover the Japanese company behind the world's most trusted water ionization technology and our commitment to bringing True Health to India.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="highlights-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeInUp}
          >
            <h2 id="highlights-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              Enagic at a Glance
            </h2>
            <p className="text-gray-600 text-lg">
              Five decades of innovation, quality, and commitment to True Health through water technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {highlights.map((highlight, index) => (
              <motion.div key={index} variants={staggerItem} className="group">
                <div className="card p-6 text-center h-full">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-water-500 to-aqua-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <highlight.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="font-display font-bold text-3xl text-water-700 mb-1">{highlight.number}</div>
                  <div className="text-gray-600 text-sm">{highlight.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-gray-50" aria-labelledby="sections-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeInUp}
          >
            <h2 id="sections-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              Our Story & Values
            </h2>
          </motion.div>

          <div className="space-y-12">
            {sections.map((section, index) => {
              const sectionData = content[section.key] as { title?: string; content?: string; imageUrl?: string; metaData?: Record<string, unknown> } | undefined;
              if (!sectionData?.content) return null;

              return (
                <motion.article
                  key={section.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="card overflow-hidden"
                >
                  <div className={cn('md:flex', index % 2 === 1 ? 'md:flex-row-reverse' : '')}>
                    {sectionData.imageUrl && (
                      <div className="md:w-1/2 relative h-64 md:h-auto">
                          <img
                            src={sectionData.imageUrl}
                            alt={sectionData.title || section.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                      </div>
                    )}
                    <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-water-100 text-water-700 text-sm font-medium mb-3 w-fit">
                        {section.title}
                      </span>
                      <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-4">
                        {sectionData.title || section.title}
                      </h2>
                      <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: sectionData.content }} />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-water-900 text-white" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 id="cta-heading" className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Experience True Health with K.D Kangen Water
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              As an authorized independent distributor, we provide genuine Enagic products with full warranty and expert support across India.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/products" className="btn-primary text-lg px-10 py-4">
                Explore Products
              </Link>
              <Link to="/contact" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}