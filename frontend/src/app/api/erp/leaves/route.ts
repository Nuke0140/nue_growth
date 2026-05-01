import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const employeeId = searchParams.get('employeeId');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (employeeId) where.employeeId = employeeId;

    const leaves = await prisma.leaveRequest.findMany({
      where,
      include: { employee: { include: { department: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = leaves.map(l => ({
      id: l.id,
      employeeId: l.employeeId,
      employeeName: `${l.employee.firstName} ${l.employee.lastName}`,
      department: l.employee.department.name,
      type: l.type,
      startDate: l.startDate.toISOString(),
      endDate: l.endDate.toISOString(),
      days: l.days,
      status: l.status,
      reason: l.reason,
      approver: l.approver,
      createdAt: l.createdAt.toISOString(),
    }));

    const pendingCount = leaves.filter(l => l.status === 'pending').length;
    const approvedCount = leaves.filter(l => l.status === 'approved').length;
    const totalDaysRequested = leaves.filter(l => l.status === 'pending').reduce((sum, l) => sum + l.days, 0);

    return NextResponse.json({
      leaves: formatted,
      total: formatted.length,
      summary: {
        pendingCount,
        approvedCount,
        totalDaysRequested,
      },
    });
  } catch (error) {
    console.error('Leaves API error:', error);
    return NextResponse.json({ error: 'Failed to load leaves' }, { status: 500 });
  }
}
