import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock, CheckCircle, Loader2, Trash2, Eye } from 'lucide-react';
import { fadeInUp } from '../../utils/animations';
import { useAdminContactMessages, ContactMessage } from '../../hooks/useApi';
import { api } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { showToast } from '../../components/ui/Toast';
import { cn } from '../../utils/helpers';

export function AdminContactMessagesPage() {
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, loading, error, refetch } = useAdminContactMessages({ page, limit: 20, unreadOnly });

  const handleMarkRead = async (id: number) => {
    try {
      await api.put(`/admin/contact-messages/${id}/read`);
      showToast('Marked as read', 'success');
      refetch();
    } catch {
      showToast('Failed to update', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/admin/contact-messages/${deletingId}`);
      showToast('Message deleted', 'success');
      refetch();
    } catch {
      showToast('Failed to delete', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && !data) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-12 h-12 text-water-600 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} variants={fadeInUp}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-gray-900">Contact Messages</h1>
            <p className="text-gray-600 mt-1">Manage incoming inquiries</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={e => { setUnreadOnly(e.target.checked); setPage(1); }}
                className="w-4 h-4 text-water-600 border-gray-300 rounded focus:ring-water-500"
              />
              <span className="text-sm text-gray-700">Unread only</span>
            </label>
          </div>
        </div>
      </motion.div>

      <div className="card overflow-hidden">
        {error && <div className="p-6 bg-red-50 border-b border-red-200 text-red-700">{error}</div>}

        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.data.map((message, index) => (
                <motion.tr
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 30 }}
                  className={message.isRead ? '' : 'bg-blue-25'}
                >
                  <td className="px-6 py-4">
                    <span className={cn('badge', message.isRead ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-800')}>
                      {message.isRead ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{message.name}</div>
                    {message.phone && <div className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {message.phone}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <a href={`mailto:${message.email}`} className="text-gray-600 hover:text-water-600 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {message.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="font-medium text-gray-900 truncate">{message.subject || 'No subject'}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{message.message}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {formatDate(message.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingMessage(message)}
                        className="p-2 rounded-lg text-gray-400 hover:text-water-600 hover:bg-water-50 transition-colors"
                        aria-label="View message"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {!message.isRead && (
                        <button
                          onClick={() => handleMarkRead(message.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                          aria-label="Mark as read"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeletingId(message.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label="Delete message"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {data?.data.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            {unreadOnly ? 'No unread messages.' : 'No contact messages yet.'}
          </div>
        )}

        {data && data.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Page {data.pagination.page} of {data.pagination.totalPages} — {data.pagination.total} total
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={data.pagination.page === 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </Button>
              <Button variant="secondary" size="sm" disabled={data.pagination.page === data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!viewingMessage}
        onClose={() => setViewingMessage(null)}
        title="Message Details"
        size="lg"
      >
        {viewingMessage && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{viewingMessage.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <a href={`mailto:${viewingMessage.email}`} className="text-water-600 hover:underline">{viewingMessage.email}</a>
              </div>
              {viewingMessage.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{viewingMessage.phone}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Subject</label>
                <p className="text-gray-900">{viewingMessage.subject || 'No subject'}</p>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-500">Received</label>
                <p className="text-gray-900 flex items-center gap-1">
                  <Clock className="w-4 h-4 inline" />
                  {formatDate(viewingMessage.createdAt, true)}
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={cn('badge', viewingMessage.isRead ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800')}>
                  {viewingMessage.isRead ? 'Read' : 'Unread'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <label className="text-sm font-medium text-gray-500 block mb-2">Message</label>
              <div className="prose prose-gray max-w-none whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg">
                {viewingMessage.message}
              </div>
            </div>

            {!viewingMessage.isRead && (
              <Button onClick={() => handleMarkRead(viewingMessage.id)} className="w-full sm:w-auto">
                <CheckCircle className="w-5 h-5 mr-2" />
                Mark as Read
              </Button>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message permanently?"
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}

function formatDate(dateString: string, withTime = false): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(withTime && { hour: '2-digit', minute: '2-digit' }),
  });
}