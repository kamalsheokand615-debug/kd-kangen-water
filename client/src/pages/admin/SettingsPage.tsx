import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Eye, EyeOff, Upload } from 'lucide-react';
import { fadeInUp } from '../../utils/animations';
import { api, SiteSettings, HeroContent } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Input'
import { showToast } from '../../components/ui/Toast';

const settingsSchema = z.record(z.string(), z.string());

const heroSchema = z.object({
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  backgroundVideoUrl: z.string().optional(),
  isActive: z.boolean().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;
type HeroFormData = z.infer<typeof heroSchema>;

const settingGroups = [
  { key: 'general', label: 'General', icon: '⚙️', fields: ['site_name', 'site_tagline'] },
  { key: 'contact', label: 'Contact Info', icon: '📞', fields: ['phone', 'whatsapp', 'email', 'address'] },
  { key: 'social', label: 'Social Links', icon: '🔗', fields: ['facebook_url', 'instagram_url', 'youtube_url', 'linkedin_url'] },
  { key: 'seo', label: 'SEO & Meta', icon: '🔍', fields: ['seo_title', 'seo_description', 'og_image'] },
  { key: 'footer', label: 'Footer', icon: '📄', fields: ['footer_text', 'disclaimer_text'] },
];

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);

  const {
    register: registerSettings,
    handleSubmit: handleSubmitSettings,
    setValue: setSettingsValue,
    formState: { errors: settingsErrors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    mode: 'onChange',
  });

  const {
    register: registerHero,
    handleSubmit: handleSubmitHero,
    setValue: setHeroValue,
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    mode: 'onChange',
  });

  const loadData = async () => {
    try {
      const [settingsRes, heroRes] = await Promise.all([
        api.get<SiteSettings>('/admin/settings'),
        api.get<HeroContent>('/admin/hero').catch(() => ({ data: null })),
      ]);

      Object.entries(settingsRes.data).forEach(([key, value]) => {
        setSettingsValue(key, value);
      });

      const heroData = heroRes.data;
      if (heroData) {
        setHeroValue('headline', heroData.headline ?? '');
        setHeroValue('subheadline', heroData.subheadline ?? '');
        setHeroValue('ctaText', heroData.ctaText ?? '');
        setHeroValue('ctaLink', heroData.ctaLink ?? '');
        setHeroValue('backgroundVideoUrl', heroData.backgroundVideoUrl ?? '');
        setHeroValue('isActive', heroData.isActive);
        if (heroData.backgroundImageUrl) {
          setHeroImagePreview(heroData.backgroundImageUrl);
        }
      }
    } catch {
      showToast('Failed to load settings', 'error');
    }
  };

  const handleSaveSettings = async (data: Record<string, string>) => {
    setSaving(true);
    try {
      await api.put('/admin/settings', data);
      showToast('Settings saved successfully', 'success');
      loadData();
    } catch {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHero = async (formData: HeroFormData) => {
    setHeroSaving(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          payload.append(key, String(value));
        }
      });

      const fileInput = document.getElementById('hero-background') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        payload.append('backgroundImage', fileInput.files[0]);
      }

      await api.put('/admin/hero', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Hero content saved', 'success');
      loadData();
    } catch {
      showToast('Failed to save hero content', 'error');
    } finally {
      setHeroSaving(false);
    }
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} variants={fadeInUp}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-gray-900">Site Settings</h1>
            <p className="text-gray-600 mt-1">Configure your website settings</p>
          </div>
        </div>
      </motion.div>

      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap -mb-px" aria-label="Settings tabs">
            {settingGroups.map(group => (
              <button
                key={group.key}
                onClick={() => setActiveTab(group.key)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === group.key ? 'border-water-600 text-water-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                role="tab"
                aria-selected={activeTab === group.key}
              >
                <span className="mr-2">{group.icon}</span>
                {group.label}
              </button>
            ))}
            <button
              onClick={() => setHeroExpanded(!heroExpanded)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${heroExpanded ? 'border-water-600 text-water-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              role="tab"
              aria-selected={heroExpanded}
            >
              <span className="mr-2">🎨</span>
              Hero Section
            </button>
          </nav>
        </div>

        <div className="p-6">
          {settingGroups.map(group => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: activeTab === group.key ? 1 : 0, height: activeTab === group.key ? 'auto' : 0 }}
              transition={{ duration: 0.2 }}
              className={activeTab !== group.key ? 'hidden' : ''}
            >
              <form onSubmit={handleSubmitSettings(handleSaveSettings)} className="space-y-6">
                {group.fields.map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </label>
                    {field === 'seo_description' || field === 'footer_text' || field === 'disclaimer_text' ? (
                      <Textarea
                        {...registerSettings(field)}
                        rows={3}
                        placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                      />
                    ) : (
                      <Input
                        {...registerSettings(field)}
                        placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                      />
                    )}
                    {settingsErrors[field] && (
                      <p className="mt-1 text-sm text-red-600">{settingsErrors[field].message}</p>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <Button type="submit" loading={saving}>
                    <Save className="w-5 h-5 mr-2" />
                    Save {group.label}
                  </Button>
                </div>
              </form>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: heroExpanded ? 1 : 0, height: heroExpanded ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
            className={heroExpanded ? '' : 'hidden'}
          >
            <form onSubmit={handleSubmitHero(handleSaveHero)} className="space-y-6">
              <Input label="Headline" {...registerHero('headline')} placeholder="Main headline" />
              <Textarea label="Subheadline" {...registerHero('subheadline')} rows={3} placeholder="Supporting text" />
              
              <div className="grid sm:grid-cols-2 gap-6">
                <Input label="CTA Button Text" {...registerHero('ctaText')} placeholder="Explore Products" />
                <Input label="CTA Link" {...registerHero('ctaLink')} placeholder="/products" />
              </div>

              <Input label="Background Video URL (optional)" {...registerHero('backgroundVideoUrl')} placeholder="https://..." type="url" />

              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image {heroImagePreview ? '(current preview below)' : ''}
                </label>
                <input type="file" id="hero-background" name="backgroundImage" accept="image/*" onChange={handleHeroImageChange} className="hidden" />
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => document.getElementById('hero-background')?.click()} className="btn-secondary">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </button>
                  <span className="text-sm text-gray-500">JPG, PNG, WebP up to 10MB</span>
                </div>
                
                {heroImagePreview && (
                  <div className="mt-4 relative max-w-md">
                    <img src={heroImagePreview} alt="Hero background preview" className="w-full h-auto rounded-lg border border-gray-200" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...registerHero('isActive')} className="w-4 h-4 text-water-600 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button type="submit" loading={heroSaving}>
                  <Save className="w-5 h-5 mr-2" />
                  Save Hero Section
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <div className="card">
        <div className="p-6">
          <h2 className="font-display font-semibold text-xl text-gray-900 mb-4">Change Password</h2>
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ currentPassword: string; newPassword: string; confirmPassword: string }>({
    resolver: zodResolver(z.object({
      currentPassword: z.string().min(1, 'Current password required'),
      newPassword: z.string().min(8, 'At least 8 characters'),
      confirmPassword: z.string().min(1, 'Confirm password required'),
    }).refine(d => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })),
  });

  const onSubmit = async (data: { currentPassword: string; newPassword: string }) => {
    setLoading(true);
    try {
      await api.post('/auth/change-password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      showToast('Password changed successfully', 'success');
    } catch {
      showToast('Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
        <div className="relative">
          <input
            type={showCurrent ? 'text' : 'password'}
            {...register('currentPassword')}
            className="input pr-12"
            placeholder="Current password"
          />
          <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600">
            {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            {...register('newPassword')}
            className="input pr-12"
            placeholder="New password (min 8 chars)"
          />
          <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600">
            {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            {...register('confirmPassword')}
            className="input pr-12"
            placeholder="Confirm new password"
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600">
            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" loading={loading}>Change Password</Button>
    </form>
  );
}

