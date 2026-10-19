import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Droplet, Award, Shield, Truck, Star, Zap, Leaf, Droplets, Sparkles, Cpu, Zap as ZapIcon } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem, waveAnimation, machineFloatAnimation, waterDropAnimation, glowAnimation, slideUpAnimation } from '../../utils/animations';
import { useHero } from '../../hooks/useHero';

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

// Machine data for showcase
const machineShowcase = [
  { name: 'Leveluk K8', icon: Cpu, color: 'from-blue-500 to-indigo-600', plates: 8, desc: 'Flagship model with 8 platinum plates' },
  { name: 'DX501', icon: Droplets, color: 'from-cyan-500 to-teal-600', plates: 7, desc: 'Industry standard with 7 platinum plates' },
  { name: 'DX501 Platinum', icon: Sparkles, color: 'from-purple-500 to-pink-600', plates: 7, desc: 'Premium finish with same trusted performance' },
  { name: 'Leveluk JR IV', icon: ZapIcon, color: 'from-green-500 to-emerald-600', plates: 4, desc: 'Compact entry-level with 4 platinum plates' },
  { name: 'Super 501', icon: Cpu, color: 'from-orange-500 to-red-600', plates: 12, desc: 'Commercial dual-chamber 12 plates' },
  { name: 'Anespa DX', icon: Droplets, color: 'from-teal-500 to-cyan-600', plates: 0, desc: 'Mineral shower system' },
];

export function HomePage() {
  const { hero } = useHero();

  return (
    <div className="relative">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-water-900 via-water-700 to-aqua-800" />
        
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

      <section className="section bg-gray-50" aria-labelledby="products-cta-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card bg-gradient-to-r from-water-800 to-aqua-700 p-8 md:p-12 text-center"
            variants={fadeInUp}
          >
            <div className="max-w-2xl mx-auto">
              <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-4">
                Ready to Transform Your Water?
              </span>
              <h2 id="products-cta-heading" className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
                Find Your Perfect Kangen Machine
              </h2>
              <p className="text-white/90 text-lg mb-8">
                From compact home units to commercial systems. Compare features, see prices, and choose the right model for your needs.
              </p>
              <Link to="/products" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-4 inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200">
                Browse All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeInUp}
          >
            <h2 id="testimonials-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              Trusted by Families Across India
            </h2>
            <p className="text-gray-600 text-lg">
              Join thousands of satisfied customers experiencing the benefits of Kangen Water®
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya Sharma', location: 'Mumbai', text: 'Been using Kangen Water for 2 years. The difference in taste and how I feel is remarkable. Best investment for family health!', rating: 5 },
              { name: 'Rajesh Kumar', location: 'Delhi', text: 'The SD501 has been a game changer. Strong Kangen Water cleans my vegetables perfectly, and the 9.5 pH water tastes amazing.', rating: 5 },
              { name: 'Anita Patel', location: 'Ahmedabad', text: 'K.D Kangen Water team guided me through the entire process. Installation was smooth, and their after-sales support is excellent.', rating: 5 },
            ].map((testimonial, index) => (
              <motion.div key={index} variants={staggerItem} className="group">
                <div className="card p-6 h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Machine Showcase Section */}
      <section className="section bg-gradient-to-b from-gray-50 to-white" aria-labelledby="machines-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeInUp}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-water-100 text-water-700 text-sm font-medium mb-4">
              Our Machine Lineup
            </span>
            <h2 id="machines-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              Premium Enagic Machines
            </h2>
            <p className="text-gray-600 text-lg">
              Japanese engineering excellence in every model. From compact home units to commercial powerhouses.
            </p>
          </motion.div>

          <div className="relative">
            {/* Background water droplets animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 bg-water-300/20 rounded-full"
                  style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
                  animate={waterDropAnimation}
                  transition={{ delay: i * 0.4, duration: 4 }}
                />
              ))}
            </div>

            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {machineShowcase.map((machine, index) => (
                <motion.div
                  key={machine.name}
                  variants={slideUpAnimation}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ delay: index * 0.15 }}
                  className="group"
                >
                  <Link to="/products" className="block">
                    <div className="card relative overflow-hidden h-full hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-water-200">
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-500" style={{ background: machine.color }} />
                      
                      {/* Machine illustration area */}
                      <div className="relative p-8 pb-4 flex flex-col items-center">
                        {/* Floating machine icon with glow */}
                        <motion.div
                          animate={machineFloatAnimation}
                          className="relative w-32 h-32 sm:w-36 sm:h-36 mb-6 flex items-center justify-center"
                        >
                          <div 
                            className="w-full h-full rounded-2xl flex items-center justify-center shadow-xl"
                            style={{ background: machine.color }}
                          >
                            <machine.icon className="w-14 h-14 sm:w-16 sm:h-16 text-white" />
                          </div>
                          {/* Glow effect */}
                          <motion.div
                            animate={glowAnimation}
                            className="absolute inset-0 rounded-2xl blur-2xl opacity-30"
                            style={{ background: machine.color }}
                          />
                        </motion.div>

                        {/* Water droplets around machine */}
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(4)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-2 h-2 bg-water-300/40 rounded-full"
                              style={{ 
                                top: `${15 + i * 20}%`, 
                                left: `${10 + (i % 2) * 70}%` 
                              }}
                              animate={waterDropAnimation}
                              transition={{ delay: index * 0.5 + i * 0.3 }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Machine info */}
                      <div className="relative p-6 pt-0">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          {machine.plates > 0 && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white" style={{ background: machine.color }}>
                              <Cpu className="w-3 h-3" />
                              {machine.plates} Platinum Plates
                            </span>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-xl text-gray-900 text-center mb-2">{machine.name}</h3>
                        <p className="text-gray-600 text-center text-sm mb-4">{machine.desc}</p>
                        
                        {/* Feature highlights */}
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                          <span className="px-2 py-1 bg-water-50 text-water-700 text-xs rounded-full">Medical Grade</span>
                          <span className="px-2 py-1 bg-aqua-50 text-aqua-700 text-xs rounded-full">ISO Certified</span>
                          {machine.plates > 0 && <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">{machine.plates} Plates</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
            variants={fadeInUp}
          >
            <Link to="/products" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2 group">
              View All Machines & Compare
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}