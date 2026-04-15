'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import RolePermissionMatrix from '@/modules/auth/components/role-permission-matrix';

export default function RolesPage() {
  const { navigateTo } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <button
            onClick={() => navigateTo('login')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Roles &amp; Permissions
              </h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                Control access levels for your team
              </p>
            </div>
          </div>
        </motion.div>

        {/* RolePermissionMatrix Component */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <RolePermissionMatrix />
        </motion.div>
      </div>
    </div>
  );
}
