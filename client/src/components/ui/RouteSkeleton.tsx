import { motion } from 'framer-motion';

export function RouteSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen bg-white"
    >
      <div className="h-16 border-b border-gray-100 bg-white" />
      <main className="flex-1 flex items-center justify-center">
        <div className="space-y-6 max-w-md mx-auto px-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </main>
      <div className="h-24 border-t border-gray-100 bg-white" />
    </motion.div>
  );
}
