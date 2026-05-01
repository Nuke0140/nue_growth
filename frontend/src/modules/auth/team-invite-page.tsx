'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';
import InviteTable from '@/modules/auth/components/invite-table';

const MEMBER_COUNT = 12;

export default function TeamInvitePage() {
  const { navigateTo } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <button
            onClick={() => navigateTo('login')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Team Management
                </h1>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                  Invite and manage team members
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-700 border-gray-200 text-sm font-medium rounded-lg px-3 py-1 self-start sm:self-auto w-fit"
            >
              {MEMBER_COUNT} members
            </Badge>
          </div>
        </motion.div>

        {/* InviteTable Component */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="rounded-2xl shadow-sm border-gray-100 bg-white">
            <CardContent className="p-6">
              <InviteTable />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
