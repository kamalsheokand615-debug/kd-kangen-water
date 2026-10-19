import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit, Loader2, Building2, Award, Users, MapPin, Factory, Globe, ImageIcon, Upload } from 'lucide-react';
import { fadeInUp } from '../../utils/animations';
import { useAdminCompanyContent } from '../../hooks/useApi';
import { api } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { showToast } from '../../components/ui/Toast';

const companyContentSchema = z.object({
  sectionKey: z.string().min(1, 'Section key is required'),
  title: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
});

type CompanyContentFormData = z.infer<typeof companyContentSchema>;

const sections = [
  { key: 'overview', icon: Building2, label: 'Company Overview' },
  { key: 'mission', icon: Award, label: 'Mission & Philosophy' },
  { key: 'founder', icon: Users, label: 'Founder' },
  { key: 'headquarters', icon: MapPin, label: 'Headquarters & Manufacturing' },
  { key: 'manufacturing', icon: Factory, label: 'Japanese Manufacturing' },
  { key: 'india_presence', icon: Globe, label: 'Enagic in India' },
];

export function AdminCompanyContentPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { content, loading, error, refetch } = useAdminCompanyContent();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<CompanyContentFormData>({
    resolver: zodResolver(companyContentSchema),
    defaultValues: {
      sectionKey: 'overview',
      title: '',
      content: '',
      imageUrl: '',
    },
  });

  const onSubmit = async (formData: CompanyContentFormData) => {
    setUploading(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          payload.append(key, String(value));
        }
      });

      const fileInput = document.getElementById('company-image') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        payload.append('image', fileInput.files[0]);
      }

      await api.post('/admin/company-content', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Content saved', 'success');
      closeForm();
      refetch();
    } catch {
      showToast('Failed to save content', 'error');
    } finally {
      setUploading(false);
    }
  };

  const openEdit = (sectionKey: string) => {
    const existing = content.find(c => c.sectionKey === sectionKey);
    setEditingKey(sectionKey);
    reset({
      sectionKey,
      title: existing?.title || '',
      content: existing?.content || '',
      imageUrl: existing?.imageUrl || '',
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingKey(null);
    reset();
    const fileInput = document.getElementById('company-image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-12 h-12 text-water-600 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} variants={fadeInUp}>
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900">Company Content</h1>
          <p className="text-gray-600 mt-1">Manage About page sections</p>
        </div>
      </motion.div>

      <div className="card overflow-hidden">
        {error && <div className="p-6 bg-red-50 border-b border-red-200 text-red-700">{error}</div>}

        <div className="divide-y divide-gray-200">
          {sections.map(section => {
            const existing = content.find(c => c.sectionKey === section.key);
            return (
              <div key={section.key} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-water-100 flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-water-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{section.label}</h3>
                    <p className="text-sm text-gray-500">{section.key}</p>
                    {existing && (
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Edit className="w-3 h-3" />
                          Last updated: {new Date(existing.updatedAt).toLocaleDateString()}
                        </span>
                        {existing.imageUrl && (
                          <span className="flex items-center gap-1 text-water-600">
                            <ImageIcon className="w-3 h-3" /> Has image
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <Button size="sm" onClick={() => openEdit(section.key)}>
                  {existing ? 'Edit' : 'Add'}
                </Button>
              </div>
            );
          })}
        </div>

        {content.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No content sections configured yet.
          </div>
        )}
      </div>

      <Modal isOpen={showForm} onClose={closeForm} title={editingKey ? `Edit: ${sections.find(s => s.key === editingKey)?.label}` : 'Add Company Content'} size="xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <Select label="Section Key *" {...register('sectionKey')} options={sections.map(s => ({ value: s.key, label: s.label }))} disabled={!!editingKey} />
          
          <Input label="Title" {...register('title')} placeholder="Section title" />
          
          <Textarea label="Content (HTML allowed)" {...register('content')} rows={8} placeholder="Enter content with HTML tags..." />
          
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image {editingKey ? '(leave empty to keep current)' : ''}
            </label>
            <input type="file" id="company-image" name="image" accept="image/*" className="hidden" />
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => document.getElementById('company-image')?.click()}
                className="btn-secondary"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </button>
              <span className="text-sm text-gray-500">JPG, PNG, WebP up to 10MB</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={closeForm}>Cancel</Button>
            <Button type="submit" loading={uploading}>Save Content</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}