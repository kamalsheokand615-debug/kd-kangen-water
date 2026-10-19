import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, Loader2, GripVertical } from 'lucide-react';
import { fadeInUp } from '../../utils/animations';
import { useAdminFaqs, FAQ } from '../../hooks/useApi';
import { api } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Input'
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { showToast } from '../../components/ui/Toast';
import { cn } from '../../utils/helpers';

const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().optional(),
  displayOrder: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});

type FAQFormData = z.infer<typeof faqSchema>;

export function AdminFaqsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQ | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const { faqs, loading, error, refetch } = useAdminFaqs();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      isActive: true,
      displayOrder: 0,
    },
  });

  const categories = ['General', 'Health & Safety', 'Usage', 'Maintenance', 'Purchase & Warranty', 'Installation', 'Technical', 'Costs', 'Comparison'];

  const onSubmit = async (formData: FAQFormData) => {
    try {
      const payload = {
        ...formData,
        displayOrder: formData.displayOrder || 0,
        isActive: formData.isActive !== false,
      };

      if (editingItem) {
        await api.put(`/admin/faqs/${editingItem.id}`, payload);
        showToast('FAQ updated', 'success');
      } else {
        await api.post('/admin/faqs', payload);
        showToast('FAQ created', 'success');
      }
      closeForm();
      refetch();
    } catch {
      showToast('Failed to save FAQ', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/admin/faqs/${deletingId}`);
      showToast('FAQ deleted', 'success');
      refetch();
    } catch {
      showToast('Failed to delete', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (item: FAQ) => {
    setEditingItem(item);
    reset({
      question: item.question,
      answer: item.answer,
      category: item.category || '',
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    reset();
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

    const items = [...faqs];
    const dragIndex = items.findIndex(i => i.id === draggingId);
    const targetIndex = items.findIndex(i => i.id === targetId);
    if (dragIndex === -1 || targetIndex === -1) return;

    const [dragged] = items.splice(dragIndex, 1);
    items.splice(targetIndex, 0, dragged);

    const updates = items.map((item, index) => ({ id: item.id, displayOrder: index }));
    try {
      for (const update of updates) {
        await api.put(`/admin/faqs/${update.id}`, { displayOrder: update.displayOrder });
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
            <h1 className="font-display font-bold text-3xl text-gray-900">FAQs</h1>
            <p className="text-gray-600 mt-1">Manage frequently asked questions</p>
          </div>
          <Button onClick={() => { setEditingItem(null); reset(); setShowForm(true); }}>
            <Plus className="w-5 h-5 mr-2" />
            Add FAQ
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {faqs.map(item => (
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
                  <td className="px-6 py-4 max-w-xl">
                    <div className="font-medium text-gray-900 line-clamp-1">{item.question}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{item.answer}</div>
                  </td>
                  <td className="px-6 py-4">
                    {item.category ? (
                      <span className="badge-primary">{item.category}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
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

        {faqs.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No FAQs yet. <Button variant="ghost" onClick={() => { reset(); setShowForm(true); }}>Add first FAQ</Button>
          </div>
        )}
      </div>

      <Modal isOpen={showForm} onClose={closeForm} title={editingItem ? 'Edit FAQ' : 'Add FAQ'} size="xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <Input label="Question *" error={errors.question?.message} {...register('question')} required placeholder="Enter the question" />
          
          <Textarea label="Answer *" error={errors.answer?.message} {...register('answer')} rows={6} required placeholder="Enter the answer (HTML allowed)" />
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Select label="Category" {...register('category')} options={categories.map(c => ({ value: c, label: c }))} placeholder="Select category" />
            <Input label="Display Order" type="number" {...register('displayOrder')} />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4 text-water-600 border-gray-300 rounded" />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={closeForm}>Cancel</Button>
            <Button type="submit">{editingItem ? 'Update FAQ' : 'Create FAQ'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ?"
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}