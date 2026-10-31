import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Edit, Trash2, Eye, ImageIcon, Loader2, ChevronLeft, ChevronRight, Upload, X } from 'lucide-react';
import { fadeInUp } from '../../utils/animations';
import { useAdminProducts, Product } from '../../hooks/useApi';
import { api } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Input';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { showToast } from '../../components/ui/Toast';
import { formatPrice } from '../../utils/helpers';
import { cn } from '../../utils/helpers';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional(),
  features: z.string().optional(),
  category: z.string().optional(),
  price: z.string().optional(),
  contactForPrice: z.boolean().optional(),
  inStock: z.boolean().optional(),
  displayOrder: z.coerce.number().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const categories = ['Water Ionizers', 'Shower Systems', 'Commercial', 'Filters & Accessories'];

export function AdminProductsPage() {
  const [searchParams, setSearchParams] = useState({ page: 1, limit: 10, search: '', category: '', sortBy: 'displayOrder', sortOrder: 'asc' as 'asc' | 'desc' });
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewingImages, setViewingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const { data, loading, error, refetch } = useAdminProducts(searchParams);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      inStock: true,
      contactForPrice: false,
      displayOrder: 0,
    },
  });

  const onSubmit = async (formData: ProductFormData) => {
    setUploading(true);
    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (key === 'features') {
            formDataObj.append(key, String(value));
          } else if (key === 'contactForPrice' || key === 'inStock') {
            formDataObj.append(key, String(value));
          } else if (key === 'price') {
            formDataObj.append(key, String(Math.round(Number(value) * 100)));
          } else {
            formDataObj.append(key, String(value));
          }
        }
      });

      const files = document.getElementById('product-images') as HTMLInputElement;
      if (files?.files) {
        Array.from(files.files).forEach(file => formDataObj.append('images', file));
      }

      const endpoint = editingProduct ? `/admin/products/${editingProduct.id}` : '/admin/products';
      const method = editingProduct ? 'put' : 'post';
      await api[method](endpoint, formDataObj, { headers: { 'Content-Type': 'multipart/form-data' } });

      showToast(editingProduct ? 'Product updated successfully' : 'Product created successfully', 'success');
      closeForm();
      void refetch();
    } catch (error) {
      showToast('Failed to save product', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/admin/products/${deletingId}`);
      showToast('Product deleted', 'success');
      void refetch();
    } catch {
      showToast('Failed to delete product', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      features: product.features.join('\n'),
      category: product.category || '',
      price: product.price ? String(product.price / 100) : '',
      contactForPrice: product.contactForPrice,
      inStock: product.inStock,
      displayOrder: product.displayOrder,
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    reset();
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 text-water-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} variants={fadeInUp}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <Button onClick={() => { setEditingProduct(null); reset(); setShowForm(true); }}>
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </Button>
        </div>
      </motion.div>

      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchParams.search}
                onChange={e => setSearchParams(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                className="input pl-10"
              />
            </div>
            <Select
              value={searchParams.category}
              onChange={e => setSearchParams(prev => ({ ...prev, category: e.target.value, page: 1 }))}
              options={[{ value: '', label: 'All Categories' }, ...categories.map(c => ({ value: c, label: c }))]}
              className="w-48"
            />
            <Select
              value={`${searchParams.sortBy}:${searchParams.sortOrder}`}
              onChange={e => {
                const [s, o] = e.target.value.split(':');
                setSearchParams(prev => ({ ...prev, sortBy: s, sortOrder: o as 'asc' | 'desc', page: 1 }));
              }}
              options={[
                { value: 'displayOrder:asc', label: 'Display Order' },
                { value: 'name:asc', label: 'Name A-Z' },
                { value: 'name:desc', label: 'Name Z-A' },
                { value: 'price:asc', label: 'Price Low-High' },
                { value: 'price:desc', label: 'Price High-Low' },
                { value: 'createdAt:desc', label: 'Newest' },
              ]}
              className="w-48"
            />
          </div>
        </div>

        {error && (
          <div className="px-6 py-4 bg-red-50 border-b border-red-200 text-red-700">{error}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence mode="popLayout">
                {data?.data.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 30 }}
                  >
                    <td className="px-6 py-4">
                      {product.images.length > 0 ? (
                        <button
                          onClick={() => setViewingImages(product.images)}
                          className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                        </button>
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge-primary">{product.category || 'General'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={product.contactForPrice ? 'text-orange-600 font-medium' : 'text-gray-900'}>
                        {product.contactForPrice ? 'Contact for Price' : formatPrice(product.price, product.contactForPrice)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('badge', product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.displayOrder}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingImages(product.images)}
                          className="p-2 rounded-lg text-gray-400 hover:text-water-600 hover:bg-water-50 transition-colors"
                          aria-label="View images"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 rounded-lg text-gray-400 hover:text-water-600 hover:bg-water-50 transition-colors"
                          aria-label="Edit product"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(product.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {data?.data.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No products found. <Button variant="ghost" size="sm" onClick={() => { setEditingProduct(null); reset(); setShowForm(true); }}>Add your first product</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data && data.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing {(data.pagination.page - 1) * data.pagination.limit + 1} to {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of {data.pagination.total} results
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={data.pagination.page === 1} onClick={() => handlePageChange(data.pagination.page - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" disabled={data.pagination.page === data.pagination.totalPages} onClick={() => handlePageChange(data.pagination.page + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={showForm} onClose={closeForm} title={editingProduct ? 'Edit Product' : 'Add Product'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <input type="file" id="product-images" name="images" accept="image/*" multiple className="hidden" />
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Input label="Name *" error={errors.name?.message} {...register('name')} required />
            <Input label="Slug *" error={errors.slug?.message} {...register('slug')} placeholder="leveluk-k8" required />
          </div>

          <Input label="Category" {...register('category')} placeholder="Select or type" list="categories" />
          <datalist id="categories">
            {categories.map(c => <option key={c} value={c} />)}
          </datalist>

          <Textarea label="Description" {...register('description')} rows={3} placeholder="Product description..." />

          <Textarea label="Features (one per line)" {...register('features')} rows={4} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />

          <div className="grid sm:grid-cols-3 gap-6">
            <Input label="Price (₹)" type="number" error={errors.price?.message} {...register('price')} placeholder="0 for contact for price" />
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('contactForPrice')} className="w-4 h-4 text-water-600 border-gray-300 rounded" />
                <span className="text-sm text-gray-700">Contact for Price</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('inStock')} className="w-4 h-4 text-water-600 border-gray-300 rounded" />
                <span className="text-sm text-gray-700">In Stock</span>
              </label>
            </div>
            <Input label="Display Order" type="number" {...register('displayOrder')} />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Input label="Meta Title" {...register('metaTitle')} placeholder="SEO title (max 60 chars)" />
            <Input label="Meta Description" {...register('metaDescription')} placeholder="SEO description (max 160 chars)" />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => document.getElementById('product-images')?.click()}
                className="btn-secondary"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Images
              </button>
              <span className="text-sm text-gray-500">PNG, JPG, WebP up to 10MB each</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={closeForm}>Cancel</Button>
            <Button type="submit" loading={uploading}>
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => void handleDelete()}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      <Modal
        isOpen={viewingImages.length > 0}
        onClose={() => setViewingImages([])}
        title="Product Images"
        size="xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {viewingImages.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img src={img} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => setViewingImages(viewingImages)}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/90 text-gray-600 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}