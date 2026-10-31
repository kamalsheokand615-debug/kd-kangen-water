import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';
import { useHistory } from '../../hooks/useApi';
import { cn } from '../../utils/helpers';

export function HistoryPage() {
  const { history, loading } = useHistory();

  const activeHistory = history.filter(h => h.isActive).sort((a, b) => b.year - a.year);

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
              1974 — Present
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Enagic History Timeline
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              From a small Okinawan company to a global leader in water ionization technology. Explore the milestones that shaped 50+ years of innovation.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="timeline-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeInUp}
          >
            <h2 id="timeline-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              Key Milestones
            </h2>
            <p className="text-gray-600 text-lg">
              Each step forward in our journey to bring Kangen Water® to the world.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-water-200 via-water-400 to-water-200 transform -translate-x-1/2" />
            
            <div className="relative space-y-12">
              {activeHistory.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6 }}
                  className={cn('relative flex items-start gap-8', index % 2 === 0 ? '' : 'flex-row-reverse')}
                >
                  <div className={cn(
                    'absolute left-1/2 w-4 h-4 rounded-full border-4 bg-white z-10 transform -translate-x-1/2 flex-shrink-0',
                    index % 2 === 0 ? 'border-water-500' : 'border-aqua-500'
                  )} />
                  
                  <div className={cn(
                    'w-1/2 pr-8 flex flex-col items-end',
                    index % 2 === 0 ? '' : 'order-2 pl-8 pr-0 items-start'
                  )}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={cn('card p-6 w-full relative', index % 2 === 0 ? '' : '')}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-display font-bold text-2xl text-water-700 bg-water-100 px-4 py-1 rounded-full">
                          {entry.year}
                        </span>
                        {entry.imageUrl && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6l.424-3.576a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6l.424-3.576a2 2 0 012.828 0L16 16"/></svg>
                            Image
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">{entry.title}</h3>
                      {entry.description && (
                        <p className="text-gray-600 leading-relaxed">{entry.description}</p>
                      )}
                    </motion.div>
                  </div>

                  {entry.imageUrl && (
                    <div className={cn(
                      'w-1/2 flex-shrink-0',
                      index % 2 === 0 ? 'pl-8' : 'order-1 pr-8'
                    )}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg"
                      >
                        <img
                          src={entry.imageUrl}
                          alt={`${entry.year}: ${entry.title}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-gray-50" aria-labelledby="legacy-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 id="legacy-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              A Legacy of Innovation Continues
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Enagic continues to innovate with new technologies, expanded global reach, and a commitment to True Health through the power of water.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/products" className="btn-primary text-lg px-10 py-4">
                View Current Products
              </Link>
              <Link to="/about" className="btn-secondary text-lg px-10 py-4">
                Learn More About Enagic
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}