import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const approvals = await prisma.approval.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const formatted = approvals.map(a => ({
      id: a.id,
      type: a.type,
      title: a.title,
      requestedBy: a.requestedBy,
      status: a.status,
      project: a.project,
      version: a.version,
      createdAt: a.createdAt.toISOString(),
    }));

    return NextResponse.json({
      approvals: formatted,
      total: formatted.length,
      summary: {
        pending: approvals.filter(a => a.status === 'pending').length,
        approved: approvals.filter(a => a.status === 'approved').length,
        rejected: approvals.filter(a => a.status === 'rejected').length,
        escalated: approvals.filter(a => a.status === 'escalated').length,
      },
    });
  } catch (error) {
    console.error('Approvals API error:', error);
    return NextResponse.json({ error: 'Failed to load approvals' }, { status: 500 });
  }
}
