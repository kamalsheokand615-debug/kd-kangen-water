import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, Loader2, FileText, ImageIcon, Eye, GripVertical, Upload } from 'lucide-react';
import { fadeInUp } from '../../utils/animations';
import { useAdminCertificates, Certificate } from '../../hooks/useApi';
import { api } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { showToast } from '../../components/ui/Toast';
import { cn } from '../../utils/helpers';

const certificateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuingBody: z.string().optional(),
  year: z.string().optional(),
  description: z.string().optional(),
  fileType: z.enum(['image', 'pdf']),
  displayOrder: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

export function AdminCertificatesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Certificate | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const { certificates, loading, error, refetch } = useAdminCertificates();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      fileType: 'image',
      isActive: true,
      displayOrder: 0,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (formData: CertificateFormData) => {
    setUploading(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          payload.append(key, String(value));
        }
      });

      const fileInput = document.getElementById('certificate-file') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        payload.append('file', fileInput.files[0]);
      }

      if (editingItem) {
        await api.put(`/admin/certificates/${editingItem.id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Certificate updated', 'success');
      } else {
        await api.post('/admin/certificates', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Certificate created', 'success');
      }
      closeForm();
      refetch();
    } catch {
      showToast('Failed to save certificate', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/admin/certificates/${deletingId}`);
      showToast('Certificate deleted', 'success');
      refetch();
    } catch {
      showToast('Failed to delete', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (item: Certificate) => {
    setEditingItem(item);
    reset({
      title: item.title,
      issuingBody: item.issuingBody || '',
      year: item.year?.toString() || '',
      description: item.description || '',
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    reset();
    const fileInput = document.getElementById('certificate-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggingId === null || draggingId === targetId) return;

    const items = [...certificates];
    const dragIndex = items.findIndex(i => i.id === draggingId);
    const targetIndex = items.findIndex(i => i.id === targetId);
    if (dragIndex === -1 || targetIndex === -1) return;

    const [dragged] = items.splice(dragIndex, 1);
    items.splice(targetIndex, 0, dragged);

    const updates = items.map((item, index) => ({ id: item.id, displayOrder: index }));
    try {
      for (const update of updates) {
        await api.put(`/admin/certificates/${update.id}`, { displayOrder: update.displayOrder });
      }
      showToast('Order updated', 'success');
      refetch();
    } catch {
      showToast('Failed to update order', 'error');
    }
    setDraggingId(null);
  };

  const handleDragEnd = () => setDraggingId(null);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-12 h-12 text-water-600 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} variants={fadeInUp}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-gray-900">Certificates</h1>
            <p className="text-gray-600 mt-1">Manage certifications and approvals</p>
          </div>
          <Button onClick={() => { setEditingItem(null); reset(); setShowForm(true); }}>
            <Plus className="w-5 h-5 mr-2" />
            Add Certificate
          </Button>
        </div>
      </motion.div>

      <div className="card overflow-hidden">
        {error && <div className="p-6 bg-red-50 border-b border-red-200 text-red-700">{error}</div>}

        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issuing Body</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {certificates.map(item => (
                <tr
                  key={item.id}
                  draggable
                  onDragStart={e => handleDragStart(e, item.id)}
                  onDragOver={handleDragOver}
                  onDrop={e => handleDrop(e, item.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(draggingId === item.id && 'opacity-50 bg-water-50')}
                >
                  <td className="px-6 py-4">
                    <GripVertical className="w-5 h-5 text-gray-300 cursor-grab active:cursor-grabbing" />
                  </td>
                  <td className="px-6 py-4">
                    {item.fileUrl && item.fileType === 'image' ? (
                      <img src={item.fileUrl} alt={item.title} className="w-16 h-12 rounded-lg object-cover border border-gray-200" loading="lazy" />
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        {item.fileType === 'pdf' ? <FileText className="w-6 h-6 text-gray-400" /> : <ImageIcon className="w-6 h-6 text-gray-400" />}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.issuingBody || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{item.year || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={cn('badge', item.fileType === 'pdf' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800')}>
                      {item.fileType.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('badge', item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600')}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-gray-400 hover:text-water-600 hover:bg-water-50 transition-colors" aria-label="Edit">
                        <Edit className="w-5 h-5" />
                      </button>
                      {item.fileUrl && (
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-gray-400 hover:text-water-600 hover:bg-water-50 transition-colors" aria-label="View">
                          <Eye className="w-5 h-5" />
                        </a>
                      )}
                      <button onClick={() => setDeletingId(item.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" aria-label="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {certificates.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No certificates yet. <Button variant="ghost" onClick={() => { reset(); setShowForm(true); }}>Add first certificate</Button>
          </div>
        )}
      </div>

      <Modal isOpen={showForm} onClose={closeForm} title={editingItem ? 'Edit Certificate' : 'Add Certificate'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <input type="file" id="certificate-file" name="file" accept="image/*,application/pdf" className="hidden" ref={fileInputRef} />
          
          <Input label="Title *" error={errors.title?.message} {...register('title')} required placeholder="e.g., ISO 9001:2015" />
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Input label="Issuing Body" {...register('issuingBody')} placeholder="e.g., JQA, WQA, NSF" />
            <Input label="Year" type="number" min="1900" max="2100" {...register('year')} placeholder="2024" />
          </div>

          <Select label="File Type" {...register('fileType')} options={[{ value: 'image', label: 'Image' }, { value: 'pdf', label: 'PDF' }]} />

          <Textarea label="Description" {...register('description')} rows={3} placeholder="Additional details..." />

          <div className="flex items-end gap-6">
            <Input label="Display Order" type="number" {...register('displayOrder')} className="w-32" />
            <label className="flex items-center gap-2 cursor-pointer flex-1">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4 text-water-600 border-gray-300 rounded" />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File {editingItem?.fileUrl ? '(leave empty to keep current)' : '*'}
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => document.getElementById('certificate-file')?.click()}
                className="btn-secondary"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </button>
              <span className="text-sm text-gray-500">Image (JPG, PNG, WebP) or PDF, max 10MB</span>
            </div>
            
            {editingItem?.fileUrl && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  {editingItem.fileType === 'pdf' ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                  Current file: {editingItem.fileUrl.split('/').pop()}
                </span>
                <a href={editingItem.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-water-600 hover:underline">View</a>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={closeForm}>Cancel</Button>
            <Button type="submit" loading={uploading}>{editingItem ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Certificate"
        message="Are you sure you want to delete this certificate?"
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}