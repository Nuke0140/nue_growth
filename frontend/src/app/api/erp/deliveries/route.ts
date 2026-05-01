import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const projectId = searchParams.get('projectId');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (projectId) where.projectId = projectId;

    const deliveries = await prisma.delivery.findMany({
      where,
      include: { project: true },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = deliveries.map(d => ({
      id: d.id,
      projectId: d.projectId,
      projectName: d.project.name,
      deliverable: d.deliverable,
      status: d.status,
      dueDate: d.dueDate?.toISOString(),
      clientApproval: d.clientApproval,
      revisionRounds: d.revisionRounds,
      assignedTo: d.assignedTo,
      createdAt: d.createdAt.toISOString(),
    }));

    return NextResponse.json({
      deliveries: formatted,
      total: formatted.length,
      summary: {
        pending: deliveries.filter(d => d.status === 'pending').length,
        inProgress: deliveries.filter(d => d.status === 'in-progress').length,
        inReview: deliveries.filter(d => ['review', 'client-review'].includes(d.status)).length,
        delivered: deliveries.filter(d => d.status === 'delivered').length,
      },
    });
  } catch (error) {
    console.error('Deliveries API error:', error);
    return NextResponse.json({ error: 'Failed to load deliveries' }, { status: 500 });
  }
}
