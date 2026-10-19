import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Award, Truck, Headphones, RotateCcw, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { fadeInUp, staggerItem } from '../../utils/animations';
import { useProducts } from '../../hooks/useApi';

export function WarrantyPage() {
  const { data: productsData, loading } = useProducts({ limit: 20 });

  const warrantyInfo = [
    {
      title: 'Standard Warranty Coverage',
      icon: Shield,
      items: [
        'Manufacturing defects in materials and workmanship',
        'Electrode plates and electrolysis chamber',
        'Internal electronic components and circuit boards',
        'Power supply and transformer units',
        'Control panel and display systems',
      ],
    },
    {
      title: 'Warranty Duration by Model',
      icon: Clock,
      items: [
        'Leveluk K8, DX501, DX501 Platinum: 5 years (Japan)',
        'Leveluk JR IV: 3 years (Japan)',
        'Super 501 (Commercial): 5 years (Japan)',
        'Anespa DX Shower System: 1 year (Japan)',
      ],
    },
    {
      title: 'What\'s Not Covered',
      icon: AlertTriangle,
      items: [
        'Normal wear and tear of consumable parts',
        'Filter cartridges (replaced periodically)',
        'Electrolysis enhancer (saline solution)',
        'Citric acid cleaning cartridges',
        'Damage from improper installation or misuse',
        'Damage from voltage fluctuations or power surges',
        'Cosmetic damage (scratches, dents, discoloration)',
        'Water quality issues due to source water conditions',
      ],
    },
    {
      title: 'Warranty Claim Process',
      icon: Headphones,
      items: [
        'Contact K.D Kangen Water support team',
        'Provide purchase invoice and machine serial number',
        'Describe the issue with photos/videos if possible',
        'Our certified technicians will assess the problem',
        'Approved claims: free repair or replacement parts',
        'On-site service available in major metro areas',
      ],
    },
    {
      title: 'Extended Protection',
      icon: Award,
      items: [
        'Free installation guidance and setup support',
        'Lifetime technical consultation via phone/email',
        'Priority service scheduling for warranty customers',
        'Genuine Enagic parts guaranteed for all repairs',
        'Annual maintenance reminders and checkups',
      ],
    },
    {
      title: 'Important Notes',
      icon: CheckCircle,
      items: [
        'Warranty valid only for purchases from authorized Enagic distributors',
        'Register your machine within 30 days of purchase',
        'Use only genuine Enagic filters and consumables',
        'Regular maintenance as per user manual is required',
        'Warranty is non-transferable (original purchaser only)',
        'Keep purchase receipt and warranty card safely',
      ],
    },
  ];

  const machineWarranties = productsData?.data
    ?.filter(p => p.category && ['Water Ionizers', 'Commercial', 'Shower Systems'].includes(p.category))
    ?.map(p => ({
      name: p.name,
      warranty: p.features?.find(f => f.includes('warranty')) || '3-year warranty (Japan)',
      category: p.category || 'Machine',
    })) || [];

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
              Warranty & Protection
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Enagic Warranty Coverage
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Your investment is protected with genuine Enagic warranty. Learn about coverage, duration, and our dedicated support.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="warranty-overview-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeInUp}
          >
            <h2 id="warranty-overview-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              Comprehensive Warranty Protection
            </h2>
            <p className="text-gray-600 text-lg">
              Every Enagic machine comes with manufacturer warranty backed by 50+ years of Japanese engineering excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Shield, title: '3-Year Warranty', desc: 'Standard coverage on all ionizer models (Japan manufacturer warranty)' },
              { icon: Award, title: 'Medical Grade', desc: 'Japanese MHLW approved - same standards as hospital equipment' },
              { icon: Truck, title: 'Pan-India Service', desc: 'On-site support in major cities, pickup service elsewhere' },
              { icon: Headphones, title: 'Expert Support', desc: 'Certified technicians with factory training' },
              { icon: RotateCcw, title: 'Genuine Parts', desc: 'Only original Enagic replacement parts used' },
              { icon: Clock, title: 'Quick Turnaround', desc: 'Fast repair service to minimize downtime' },
            ].map((item, index) => (
              <motion.div key={index} variants={staggerItem} className="group">
                <div className="card p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-water-500 to-aqua-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-gray-50" aria-labelledby="warranty-details-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
            variants={fadeInUp}
          >
            <h2 id="warranty-details-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              Warranty Details
            </h2>
            <p className="text-gray-600 text-lg">
              Click each section to learn more about your coverage
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {warrantyInfo.map((section, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-water-100 flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-water-600" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-gray-900">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {machineWarranties.length > 0 && (
        <section className="section bg-white" aria-labelledby="machine-warranty-heading">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-12"
              variants={fadeInUp}
            >
              <h2 id="machine-warranty-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
                Warranty by Machine Model
              </h2>
              <p className="text-gray-600 text-lg">
                Specific warranty details for each Enagic model
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {machineWarranties.map((machine, index) => (
                <motion.div key={index} variants={staggerItem} className="group">
                  <div className="card p-6 h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-water-200">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-water-500 to-aqua-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">{machine.name}</h3>
                    <p className="text-gray-600 mb-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-water-100 text-water-700 text-sm font-medium">
                        {machine.warranty}
                      </span>
                    </p>
                    <span className="text-sm text-gray-500 capitalize">{machine.category?.toLowerCase()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section bg-gradient-to-r from-water-800 to-aqua-700 text-white" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            <h3 id="cta-heading" className="font-display font-bold text-3xl sm:text-4xl mb-6">
              Need Warranty Support?
            </h3>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Our certified technicians are ready to assist with any warranty claims or questions about your Enagic machine.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="btn bg-white text-water-700 hover:bg-water-50 text-lg px-10 py-4 inline-flex items-center gap-2">
                Contact Support
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/products" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-4 inline-flex items-center gap-2">
                View All Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}