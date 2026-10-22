import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, Loader2, GripVertical } from 'lucide-react';
import { fadeInUp } from '../../utils/animations';
import { useAdminWaterTypes, WaterType } from '../../hooks/useApi';
import { api } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Input'
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { showToast } from '../../components/ui/Toast';
import { cn } from '../../utils/helpers';

const waterTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phMin: z.string().optional(),
  phMax: z.string().optional(),
  description: z.string().optional(),
  uses: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  displayOrder: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});

type WaterTypeFormData = z.infer<typeof waterTypeSchema>;

export function AdminWaterTypesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WaterType | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const { waterTypes, loading, error, refetch } = useAdminWaterTypes();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaterTypeFormData>({
    resolver: zodResolver(waterTypeSchema),
    defaultValues: {
      color: '#0077b6',
      isActive: true,
      displayOrder: 0,
    },
  });

  const onSubmit = async (formData: WaterTypeFormData) => {
    try {
      const payload = {
        ...formData,
        phMin: formData.phMin ? parseFloat(formData.phMin) : null,
        phMax: formData.phMax ? parseFloat(formData.phMax) : null,
        uses: formData.uses ? formData.uses.split('\n').map(u => u.trim()).filter(Boolean) : [],
        displayOrder: formData.displayOrder || 0,
        isActive: formData.isActive !== false,
      };

      if (editingItem) {
        await api.put(`/admin/water-types/${editingItem.id}`, payload);
        showToast('Water type updated', 'success');
      } else {
        await api.post('/admin/water-types', payload);
        showToast('Water type created', 'success');
      }
      closeForm();
      void refetch();
    } catch {
      showToast('Failed to save water type', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/admin/water-types/${deletingId}`);
      showToast('Water type deleted', 'success');
      void refetch();
    } catch {
      showToast('Failed to delete', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (item: WaterType) => {
    setEditingItem(item);
    reset({
      name: item.name,
      phMin: item.phMin?.toString() || '',
      phMax: item.phMax?.toString() || '',
      description: item.description || '',
      uses: item.uses.join('\n'),
      color: item.color,
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

    const items = [...waterTypes];
    const dragIndex = items.findIndex(i => i.id === draggingId);
    const targetIndex = items.findIndex(i => i.id === targetId);
    if (dragIndex === -1 || targetIndex === -1) return;

    const [dragged] = items.splice(dragIndex, 1);
    items.splice(targetIndex, 0, dragged);

    const updates = items.map((item, index) => ({
      id: item.id,
      displayOrder: index,
    }));

    try {
      for (const update of updates) {
        await api.put(`/admin/water-types/${update.id}`, { displayOrder: update.displayOrder });
      }
      showToast('Order updated', 'success');
      void refetch();
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
            <h1 className="font-display font-bold text-3xl text-gray-900">Water Types</h1>
            <p className="text-gray-600 mt-1">Manage the 7 types of Kangen Water</p>
          </div>
          <Button onClick={() => { setEditingItem(null); reset(); setShowForm(true); }}>
            <Plus className="w-5 h-5 mr-2" />
            Add Water Type
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">pH Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {waterTypes.map(item => (
                <tr
                  key={item.id}
                  draggable
                  onDragStart={e => handleDragStart(e, item.id)}
                  onDragOver={handleDragOver}
                  onDrop={e => void handleDrop(e, item.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(draggingId === item.id && 'opacity-50 bg-water-50')}
                >
                  <td className="px-6 py-4">
                    <GripVertical className="w-5 h-5 text-gray-300 cursor-grab active:cursor-grabbing" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    {item.phMin !== null && item.phMax !== null ? (
                      <span className="font-mono text-water-700">pH {item.phMin} – {item.phMax}</span>
                    ) : (
                      <span className="text-gray-400">Not set</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-500 font-mono">{item.color}</span>
                    </div>
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

        {waterTypes.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No water types configured. <Button variant="ghost" onClick={() => { reset(); setShowForm(true); }}>Add first water type</Button>
          </div>
        )}
      </div>

      <Modal isOpen={showForm} onClose={closeForm} title={editingItem ? 'Edit Water Type' : 'Add Water Type'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <Input label="Name *" error={errors.name?.message} {...register('name')} required placeholder="e.g., Kangen Water pH 9.5" />
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Input label="Min pH" type="number" step="0.1" min="0" max="14" error={errors.phMin?.message} {...register('phMin')} placeholder="8.5" />
            <Input label="Max pH" type="number" step="0.1" min="0" max="14" error={errors.phMax?.message} {...register('phMax')} placeholder="9.5" />
          </div>

          <Input label="Color *" error={errors.color?.message} {...register('color')} type="color" className="h-12" />

          <Textarea label="Description" {...register('description')} rows={3} placeholder="Description of this water type..." />

          <Textarea label="Uses (one per line)" {...register('uses')} rows={4} placeholder="Use 1&#10;Use 2&#10;Use 3" />

          <div className="grid sm:grid-cols-3 gap-6">
            <Input label="Display Order" type="number" {...register('displayOrder')} />
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer w-full">
                <input type="checkbox" {...register('isActive')} className="w-4 h-4 text-water-600 border-gray-300 rounded" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={closeForm}>Cancel</Button>
            <Button type="submit">{editingItem ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => void handleDelete()}
        title="Delete Water Type"
        message="Are you sure you want to delete this water type?"
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}