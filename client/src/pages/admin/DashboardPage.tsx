import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Award, MessageSquare, Droplets, HelpCircle, ArrowRight, Users, Settings, Box, FileText, Calendar, Zap } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem, scaleIn } from '../../utils/animations';
import { useDashboardStats } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { cn } from '../../utils/helpers';

const statCards = [
  { key: 'products', icon: Package, label: 'Products', href: '/admin/products', color: 'bg-water-100 text-water-700', iconColor: 'text-water-600' },
  { key: 'certificates', icon: Award, label: 'Certificates', href: '/admin/certificates', color: 'bg-aqua-100 text-aqua-700', iconColor: 'text-aqua-600' },
  { key: 'waterTypes', icon: Droplets, label: 'Water Types', href: '/admin/water-types', color: 'bg-blue-100 text-blue-700', iconColor: 'text-blue-600' },
  { key: 'faqs', icon: HelpCircle, label: 'FAQs', href: '/admin/faqs', color: 'bg-amber-100 text-amber-700', iconColor: 'text-amber-600' },
  { key: 'unreadMessages', icon: MessageSquare, label: 'Unread Messages', href: '/admin/contact-messages', color: 'bg-red-100 text-red-700', iconColor: 'text-red-600' },
];

const quickActions = [
  { icon: Package, label: 'Add Product', href: '/admin/products', description: 'Create a new product listing' },
  { icon: Award, label: 'Add Certificate', href: '/admin/certificates', description: 'Upload a new certificate' },
  { icon: Droplets, label: 'Manage Water Types', href: '/admin/water-types', description: 'Edit the 7 water types' },
  { icon: Calendar, label: 'Add History Event', href: '/admin/history', description: 'Add a timeline milestone' },
  { icon: FileText, label: 'Write FAQ', href: '/admin/faqs', description: 'Create a new FAQ entry' },
  { icon: Settings, label: 'Site Settings', href: '/admin/settings', description: 'Configure site settings' },
];

export function DashboardPage() {
  const { user } = useAuth();
  const { stats, loading, refetch } = useDashboardStats();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        variants={fadeInUp}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.email?.split('@')[0] || 'Admin'}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={refetch}>
            <ArrowRight className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {statCards.map(stat => (
          <motion.article key={stat.key} variants={staggerItem}>
            <Link to={stat.href} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                      <p className="font-display font-bold text-3xl text-gray-900">
                        {loading ? (
                          <span className="animate-pulse bg-gray-200 h-8 w-20 inline-block rounded" />
                        ) : (
                          stats?.[stat.key as keyof typeof stats]?.count ?? 0
                        )}
                      </p>
                    </div>
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.color)}>
                      <stat.icon className={cn('w-6 h-6', stat.iconColor)} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                    <span className="text-gray-500">View details</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-water-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.article>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.article
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              variants={scaleIn}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <Link to={action.href} className="block">
                <Card className="h-full hover:shadow-md transition-all hover:border-water-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-water-100 flex items-center justify-center flex-shrink-0">
                        <action.icon className="w-6 h-6 text-water-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{action.label}</h3>
                        <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-water-600 transition-colors mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.article>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">API Status</h3>
                  <p className="text-sm text-green-600 font-medium">Operational</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-water-100 flex items-center justify-center">
                  <Box className="w-6 h-6 text-water-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Database</h3>
                  <p className="text-sm text-water-600 font-medium">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-aqua-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-aqua-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Active Admin</h3>
                  <p className="text-sm text-aqua-600 font-medium">1 session</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}