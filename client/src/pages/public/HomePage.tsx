import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Droplet, Award, Shield, Truck, Star, Zap, Leaf } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem, waveAnimation } from '../../utils/animations';
import { useHero } from '../../hooks/useHero';
import WaterTypesSection from '../../components/WaterTypesSection';

const features = [
  { icon: Droplet, title: '7 Types of Water', desc: 'From pH 2.5 to 11.5 for every need', link: '/water-types' },
  { icon: Award, title: 'Medical Grade', desc: 'Japanese MHLW approved medical devices', link: '/certificates' },
  { icon: Shield, title: 'Certified Quality', desc: 'ISO 9001, 14001, 13485 certified', link: '/certificates' },
  { icon: Truck, title: 'Pan India Delivery', desc: 'Fast shipping across India', link: '/contact' },
  { icon: Star, title: 'Warranty', desc: '5-year warranty (3-year JR IV, 1-year Anespa) on genuine Enagic machines', link: '/warranty' },
  { icon: Zap, title: 'Antioxidant Rich', desc: 'Negative ORP for cellular health', link: '/water-types' },
  { icon: Leaf, title: 'Eco Friendly', desc: 'Reduce plastic bottle waste', link: '/contact' },
  { icon: Award, title: 'Expert Support', desc: 'Certified technicians for service', link: '/contact' },
];

const trustStats = [
  { value: '50+', label: 'Years of innovation' },
  { value: '40+', label: 'Countries worldwide' },
  { value: '1M+', label: 'Machines sold' },
  { value: '24/7', label: 'Support assistance' },
];

export function HomePage() {
  const { hero } = useHero();

  return (
    <div className="relative">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-water-900 via-water-700 to-aqua-800" />

        {hero?.backgroundVideoUrl ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={hero.backgroundVideoUrl}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        ) : hero?.backgroundImageUrl ? (
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src={hero.backgroundImageUrl}
            alt=""
            aria-hidden="true"
          />
        ) : null}
        {(hero?.backgroundVideoUrl || hero?.backgroundImageUrl) && (
          <div className="absolute inset-0 bg-water-900/60" />
        )}
        
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <path id="wavePath" d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" />
            </defs>
            <motion.use
              xlinkHref="#wavePath"
              fill="currentColor"
              className="text-white"
              animate={waveAnimation}
            />
            <motion.use
              xlinkHref="#wavePath"
              fill="currentColor"
              className="text-white"
              y="20"
              animate={waveAnimation}
              style={{ animationDelay: '1s' }}
            />
            <motion.use
              xlinkHref="#wavePath"
              fill="currentColor"
              className="text-white"
              y="40"
              animate={waveAnimation}
              style={{ animationDelay: '2s' }}
            />
          </svg>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-8"
            >
              <span className="relative">
                <motion.span
                  className="w-2 h-2 rounded-full bg-aqua-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </span>
              Authorized Enagic Distributor
            </motion.div>

            <motion.h1
              id="hero-heading"
              variants={fadeInUp}
              className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6 text-balance"
            >
              {hero?.headline || 'Experience the Power of Kangen Water®'}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              {hero?.subheadline || 'Transform your tap water into healthy, alkaline, antioxidant-rich water with Enagic\'s certified medical-grade ionizers. Trusted by millions worldwide for over 50 years.'}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to={hero?.ctaLink || '/products'} className="btn-primary text-lg px-10 py-4 group">
                {hero?.ctaText || 'Explore Products'}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/contact" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200">
                Get a Free Demo
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/80 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-aqua-400" />
                50+ Years Excellence
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-aqua-400" />
                1M+ Machines Sold
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-aqua-400" />
                40+ Countries
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-aqua-400" />
                Medical Grade Certified
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      <section className="section bg-white" aria-labelledby="features-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeInUp}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-water-100 text-water-700 text-sm font-medium mb-4">
              Why Choose K.D Kangen Water
            </span>
            <h2 id="features-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              Experience the Difference
            </h2>
            <p className="text-gray-600 text-lg">
              As an authorized independent distributor, we bring you genuine Enagic products with full warranty, expert guidance, and dedicated after-sales support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(feature => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                className="group"
              >
                <Link to={feature.link} className="block">
                  <div className="card p-6 h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-water-200">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-water-500 to-aqua-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-gray-50" aria-labelledby="trust-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
            variants={fadeInUp}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-water-100 text-water-700 text-sm font-medium mb-4">
              Global trust, local support
            </span>
            <h2 id="trust-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              A trusted name in healthy living
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustStats.map((stat) => (
              <motion.div key={stat.label} variants={staggerItem} className="card p-6 text-center">
                <div className="text-3xl font-display font-bold text-water-700 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    <WaterTypesSection />
    </div>
  );
}