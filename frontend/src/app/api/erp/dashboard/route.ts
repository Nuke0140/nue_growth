import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [employees, projects, invoices, vendors, assets, pendingApprovals, activeDeliveries] = await Promise.all([
      prisma.employee.count({ where: { status: 'active' } }),
      prisma.project.findMany({ where: { status: { in: ['active', 'inception'] } } }),
      prisma.invoice.findMany(),
      prisma.vendor.count({ where: { status: 'active' } }),
      prisma.asset.count({ where: { status: 'active' } }),
      prisma.approval.count({ where: { status: 'pending' } }),
      prisma.delivery.count({ where: { status: { in: ['in-progress', 'review', 'client-review'] } } }),
    ]);

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const collectedRevenue = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
    const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amount + inv.gst, 0);
    const activeProjects = projects.length;
    const avgProjectHealth = projects.length > 0
      ? projects.reduce((sum, p) => sum + (p.health === 'excellent' ? 4 : p.health === 'good' ? 3 : p.health === 'at-risk' ? 2 : 1), 0) / projects.length
      : 0;
    const avgProfitability = projects.length > 0
      ? projects.reduce((sum, p) => sum + p.profitability, 0) / projects.length
      : 0;

    // Recent activities (last 10 leave requests + approvals)
    const recentLeaves = await prisma.leaveRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { employee: true },
    });
    const recentApprovals = await prisma.approval.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const activities = [
      ...recentLeaves.map(l => ({
        id: l.id,
        type: 'leave',
        title: `${l.employee.firstName} ${l.employee.lastName} requested ${l.type} leave`,
        timestamp: l.createdAt.toISOString(),
        status: l.status,
      })),
      ...recentApprovals.map(a => ({
        id: a.id,
        type: 'approval',
        title: a.title,
        timestamp: a.createdAt.toISOString(),
        status: a.status,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    // Project health distribution
    const healthDistribution = {
      excellent: projects.filter(p => p.health === 'excellent').length,
      good: projects.filter(p => p.health === 'good').length,
      atRisk: projects.filter(p => p.health === 'at-risk').length,
      critical: projects.filter(p => p.health === 'critical').length,
    };

    // Revenue by month (mock aggregation for last 6 months)
    const revenueByMonth = [
      { month: 'Nov 2025', revenue: 2450000, collected: 2200000 },
      { month: 'Dec 2025', revenue: 3100000, collected: 2800000 },
      { month: 'Jan 2026', revenue: 2850000, collected: 2600000 },
      { month: 'Feb 2026', revenue: 3400000, collected: 3000000 },
      { month: 'Mar 2026', revenue: 3900000, collected: 3500000 },
      { month: 'Apr 2026', revenue: totalRevenue / 6, collected: collectedRevenue / 6 },
    ];

    return NextResponse.json({
      kpis: {
        totalEmployees: employees,
        activeProjects,
        totalRevenue,
        collectedRevenue,
        overdueAmount,
        pendingApprovals,
        activeDeliveries,
        activeVendors: vendors,
        activeAssets: assets,
        avgProfitability: Math.round(avgProfitability * 10) / 10,
        avgProjectHealth: Math.round(avgProjectHealth * 10) / 10,
      },
      healthDistribution,
      revenueByMonth,
      activities,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}
