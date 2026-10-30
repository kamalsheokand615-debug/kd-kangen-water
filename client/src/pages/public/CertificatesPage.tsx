import { motion } from 'framer-motion';
import { Award, FileText, ImageIcon, ExternalLink, CheckCircle } from 'lucide-react';
import { fadeInUp } from '../../utils/animations';
import { useCertificates } from '../../hooks/useApi';
import { Certificate } from '../../utils/types';
import { Lightbox } from '../../components/ui/Lightbox';
import { useState } from 'react';

export function CertificatesPage() {
  const { certificates, loading } = useCertificates();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const activeCertificates = certificates.filter(c => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder);

  const lightboxItems = activeCertificates.map(cert => ({
    src: cert.fileUrl || '',
    alt: cert.title,
    type: cert.fileType,
    title: cert.title,
    description: `${cert.issuingBody || ''} ${cert.year ? `(${cert.year})` : ''}${cert.description ? ` - ${cert.description}` : ''}`,
  }));

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

  const groupedCerts = activeCertificates.reduce((acc, cert) => {
    const category = cert.issuingBody || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(cert);
    return acc;
  }, {} as Record<string, Certificate[]>);

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
              Verified Quality & Compliance
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Certifications & Approvals
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Enagic's commitment to quality is backed by international certifications, medical device approvals,
              and rigorous testing standards. View our verified certificates below.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="certificates-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeInUp}
          >
            <h2 id="certificates-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              Our Certifications
            </h2>
            <p className="text-gray-600 text-lg">
              Click on any certificate to view the full document. All certifications are current and verifiable.
            </p>
          </motion.div>

          {activeCertificates.length === 0 ? (
            <div className="text-center py-16">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates available</h3>
              <p className="text-gray-600">Certificates will appear here once added in the admin panel.</p>
            </div>
          ) : (
            <>
              {Object.entries(groupedCerts).map(([category, certs]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-16"
                  variants={fadeInUp}
                >
                  <h3 className="font-display font-semibold text-2xl text-gray-900 mb-6 flex items-center gap-3">
                    <Award className="w-7 h-7 text-water-600" />
                    {category}
                    <span className="px-2 py-1 bg-water-100 text-water-700 text-sm rounded-full">{certs.length}</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certs.map(cert => (
                      <motion.article
                        key={cert.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group"
                      >
                        <div className="card h-full overflow-hidden">
                          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                            {cert.fileUrl && cert.fileType === 'image' ? (
                              <button
                                onClick={() => { setLightboxIndex(activeCertificates.findIndex(c => c.id === cert.id)); setLightboxOpen(true); }}
                                className="w-full h-full"
                                aria-label={`View ${cert.title} full size`}
                              >
                                <img
                                  src={cert.fileUrl}
                                  alt={cert.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                  decoding="async"
                                />
                              </button>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-water-100 to-aqua-100">
                                <FileText className="w-16 h-16 text-water-400" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <span className="text-white text-sm font-medium w-full text-center">
                                {cert.fileType === 'pdf' ? 'View PDF' : 'View Image'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-5">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-10 h-10 rounded-lg bg-water-100 flex items-center justify-center flex-shrink-0">
                                {cert.fileType === 'pdf' ? (
                                  <FileText className="w-5 h-5 text-water-600" />
                                ) : (
                                  <ImageIcon className="w-5 h-5 text-water-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 line-clamp-1">{cert.title}</h4>
                                <p className="text-sm text-gray-500 truncate">
                                  {cert.issuingBody || 'Unknown Issuer'}
                                  {cert.year && ` (${cert.year})`}
                                </p>
                              </div>
                            </div>
                            
                            {cert.description && (
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{cert.description}</p>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                Verified
                              </span>
                              <button
                                onClick={() => { setLightboxIndex(activeCertificates.findIndex(c => c.id === cert.id)); setLightboxOpen(true); }}
                                className="text-water-600 hover:text-water-700 text-sm font-medium flex items-center gap-1"
                                aria-label={`View ${cert.title} full size`}
                              >
                                View Full
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </motion.div>
              ))}
            </>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card bg-gradient-to-r from-water-800 to-aqua-700 p-8 text-center"
            variants={fadeInUp}
          >
            <h3 className="font-display font-bold text-2xl text-white mb-4">Need a Specific Certificate?</h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Can't find the certification you're looking for? Contact us and we'll provide the documentation you need.
            </p>
            <a href="/contact" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-4 inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200">
              Contact Us
              <ExternalLink className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={lightboxItems}
        initialIndex={lightboxIndex}
      />
    </div>
  );
}