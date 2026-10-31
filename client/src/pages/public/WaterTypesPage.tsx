import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplet, Sparkles, Leaf, Utensils, Zap, AlertTriangle } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations';
import { useWaterTypes } from '../../hooks/useApi';
import { cn } from '../../utils/helpers';

const phIcons = {
  strongAlkaline: Sparkles,
  alkaline: Droplet,
  neutral: Leaf,
  acidic: Utensils,
  strongAcidic: AlertTriangle,
};

const getWaterTypeIcon = (phMin: number | null, phMax: number | null) => {
  const avg = ((phMin || 0) + (phMax || 0)) / 2;
  if (avg >= 11) return phIcons.strongAlkaline;
  if (avg >= 8) return phIcons.alkaline;
  if (avg >= 7) return phIcons.neutral;
  if (avg >= 4) return phIcons.acidic;
  return phIcons.strongAcidic;
};

const getPHColor = (phMin: number | null, phMax: number | null, customColor?: string) => {
  if (customColor) return customColor;
  const avg = ((phMin || 0) + (phMax || 0)) / 2;
  if (avg >= 11) return '#004d7a';
  if (avg >= 9) return '#0077b6';
  if (avg >= 8) return '#0096c7';
  if (avg >= 7) return '#48cae4';
  if (avg >= 5.5) return '#f77f00';
  return '#dc2f02';
};

export function WaterTypesPage() {
  const { waterTypes, loading } = useWaterTypes();

  const activeWaterTypes = waterTypes.filter(w => w.isActive).sort((a, b) => a.displayOrder - b.displayOrder);

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
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#004d7a" />
                <stop offset="50%" stopColor="#0077b6" />
                <stop offset="100%" stopColor="#dc2f02" />
              </linearGradient>
            </defs>
            <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="url(#gradient)" />
          </svg>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-4">
              The 7 Types of Kangen Water®
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Water for Every Purpose
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              One machine produces seven distinct types of water with pH levels from 2.5 to 11.5.
              Each type serves a specific purpose for your health, home, and beauty needs.
              The full pH scale ranges from 0 to 14.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="ph-scale-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
            variants={fadeInUp}
          >
            <h2 id="ph-scale-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4 text-center">
              Interactive pH Scale
            </h2>
            
            <div className="max-w-5xl mx-auto">
              <div className="relative h-20 rounded-xl overflow-hidden bg-gradient-to-r from-[#8b0000] via-[#dc2f02] via-[#ff6b00] via-[#ffd700] via-[#ffff00] via-[#adff2f] via-[#32cd32] via-[#00bfff] via-[#0077b6] via-[#0055aa] via-[#4b0082] to-[#800080]">
                {activeWaterTypes.map(water => {
                  const avgPH = ((water.phMin || 0) + (water.phMax || 0)) / 2;
                  const position = Math.min(Math.max((14 - avgPH) / 14 * 100, 2), 98);
                  return (
                    <motion.button
                      key={water.id}
                      style={{ left: `${position}%` }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-4 border-white shadow-lg"
                      whileHover={{ scale: 1.5, y: -8 }}
                      whileTap={{ scale: 1.2 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      aria-label={`${water.name} - pH ${avgPH.toFixed(1)}`}
                    >
                      <motion.span
                        className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded opacity-0 pointer-events-none"
                        animate={{ opacity: 1, y: -4 }}
                      >
                        pH {avgPH.toFixed(1)}
                      </motion.span>
                    </motion.button>
                  );
                })}
              </div>
              
              <div className="grid grid-cols-9 gap-2 mt-6 text-center">
                {['0', '2.5', '4', '5.5', '7', '8.5', '9.5', '11.5', '14'].map((ph, i) => (
                  <div key={i} className="text-xs text-gray-500 font-medium">
                    pH {ph}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {activeWaterTypes.map(water => {
              const avgPH = ((water.phMin || 0) + (water.phMax || 0)) / 2;
              const color = getPHColor(water.phMin, water.phMax, water.color);
              const Icon = getWaterTypeIcon(water.phMin, water.phMax);
              const isDrinking = avgPH >= 7 && avgPH <= 10;
              const isExternal = avgPH < 7 || avgPH > 10;

              return (
                <motion.article
                  key={water.id}
                  variants={staggerItem}
                  className="group"
                >
                  <div className="card overflow-hidden h-full">
                    <div className="relative h-32">
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-16 h-16 text-white/90 drop-shadow-lg" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: color }}
                        >
                          {water.name}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                      </div>

                      <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">
                        pH {water.phMin !== null && water.phMax !== null 
                          ? `${water.phMin} – ${water.phMax}`
                          : avgPH.toFixed(1)}
                      </h3>

                      {water.description && (
                        <p className="text-gray-600 mb-4 line-clamp-3">{water.description}</p>
                      )}

                      <div className="space-y-2 mb-4">
                        {water.uses.slice(0, 4).map((use, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: color }} />
                            <span>{use}</span>
                          </div>
                        ))}
                        {water.uses.length > 4 && (
                          <button className="text-water-600 hover:text-water-700 text-sm font-medium flex items-center gap-1">
                            +{water.uses.length - 4} more uses
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          isDrinking ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        )}>
                          {isDrinking ? 'Drinking Safe' : 'External Use Only'}
                        </span>
                        {isExternal && (
                          <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                            Not for Drinking
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="section bg-gray-50" aria-labelledby="details-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeInUp}
          >
            <h2 id="details-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              Detailed Information
            </h2>
            <p className="text-gray-600 text-lg">
              Click on any water type above to learn more about its specific uses and benefits.
              All information is as stated by the manufacturer (Enagic).
            </p>
          </motion.div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {activeWaterTypes.map(water => {
              const avgPH = ((water.phMin || 0) + (water.phMax || 0)) / 2;
              const color = getPHColor(water.phMin, water.phMax, water.color);
              const isDrinking = avgPH >= 7 && avgPH <= 10;

              return (
                <motion.article
                  key={water.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="card overflow-hidden"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3 relative min-h-[200px] flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)` }}>
                      <div className="text-center p-8">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: color }}>
                          <span className="font-display font-bold text-3xl">{avgPH.toFixed(1)}</span>
                        </div>
                        <p className="font-medium text-gray-700">pH Range</p>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <h3 className="font-display font-bold text-2xl text-gray-900">{water.name}</h3>
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium text-white"
                          style={{ backgroundColor: color }}
                        >
                          pH {water.phMin !== null && water.phMax !== null 
                            ? `${water.phMin} – ${water.phMax}`
                            : avgPH.toFixed(1)}
                        </span>
                        <span className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          isDrinking ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        )}>
                          {isDrinking ? 'Safe for Drinking' : 'External Use Only'}
                        </span>
                        {!isDrinking && (
                          <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                            Not for Drinking
                          </span>
                        )}
                      </div>

                      {water.description && (
                        <p className="text-gray-600 mb-6 leading-relaxed">{water.description}</p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {water.uses.map((use, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: color }} />
                            <span className="text-gray-700">{use}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-water-900 text-white" aria-labelledby="disclaimer-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 id="disclaimer-heading" className="font-display font-bold text-2xl sm:text-3xl mb-4">
              Important Health Disclaimer
            </h2>
            <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
              The information provided is as stated by the manufacturer (Enagic) and is not medical advice.
              Consult your healthcare provider before making significant changes to your water consumption,
              especially if you have medical conditions or take medications.
            </p>
            <Link to="/contact" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-4 inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200">
              Schedule a Free Demo
              <Zap className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}