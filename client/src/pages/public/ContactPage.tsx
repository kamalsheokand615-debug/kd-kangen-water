import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, MessageCircle, Send, Loader2, CheckCircle } from 'lucide-react';
import { fadeInUp } from '../../utils/animations';
import { api } from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Input';
import { showToast } from '../../components/ui/Toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').optional().or(z.literal('')),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactPage() {
  const { settings } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const phone = settings.phone || '+91-XXXXXXXXXX';
  const whatsapp = settings.whatsapp || '91XXXXXXXXXX';
  const email = settings.email || 'info@kdkangenwater.com';
  const address = settings.address || 'Your Address Here, City, State, PIN';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await api.post('/contact', data);
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      reset();
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Get in Touch
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Contact K.D Kangen Water
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Have questions about our products? Want to schedule a free demo? Our team is here to help.
              Reach out through any of the channels below.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="contact-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} variants={fadeInUp}>
              <h2 id="contact-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-8">
                Get in Touch
              </h2>
              
              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-water-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-water-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-gray-600">{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-water-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-water-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                    <a href={`tel:${phone}`} className="text-gray-600 hover:text-water-600 transition-colors">{phone}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                    <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600 transition-colors">
                      Chat with us on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-water-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-water-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                    <a href={`mailto:${email}`} className="text-gray-600 hover:text-water-600 transition-colors">{email}</a>
                  </div>
                </div>
              </div>

              <div className="card p-6 bg-gradient-to-r from-water-800 to-aqua-700 text-white">
                <h3 className="font-display font-semibold text-xl mb-3">Schedule a Free Demo</h3>
                <p className="text-white/80 mb-4">Experience Kangen Water® firsthand. Our experts will visit your home or office for a complimentary demonstration.</p>
                <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto">
                  <a href="/contact?demo=true">Book Free Demo</a>
                </Button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} variants={fadeInUp} style={{ transitionDelay: '100ms' }}>
              <div className="card p-6 md:p-8">
                <h3 className="font-display font-semibold text-2xl text-gray-900 mb-6">Send Us a Message</h3>
                
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800"
                  >
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Message Sent Successfully!</p>
                      <p className="text-sm">We'll get back to you within 24 hours.</p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Full Name *"
                      error={errors.name?.message}
                      {...register('name')}
                      placeholder="Your name"
                      required
                    />
                    <Input
                      label="Email Address *"
                      type="email"
                      error={errors.email?.message}
                      {...register('email')}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Phone Number"
                      type="tel"
                      error={errors.phone?.message}
                      {...register('phone')}
                      placeholder="+91 XXXXX XXXXX"
                    />
                    <Input
                      label="Subject"
                      error={errors.subject?.message}
                      {...register('subject')}
                      placeholder="Product inquiry, demo request, etc."
                    />
                  </div>

                  <Textarea
                    label="Message *"
                    error={errors.message?.message}
                    {...register('message')}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    required
                  />

                  <Button type="submit" className="w-full sm:w-auto" loading={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section bg-gray-50" aria-labelledby="map-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 id="map-heading" className="font-display font-bold text-2xl text-gray-900 mb-6 text-center">Find Us</h2>
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-200 max-w-4xl mx-auto">
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <div className="text-center p-8">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Google Maps embed placeholder</p>
                  <p className="text-sm">Add your location in Site Settings</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}