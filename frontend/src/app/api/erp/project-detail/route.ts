import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        department: true,
        milestones: { orderBy: { date: 'asc' } },
        tasks: { orderBy: { createdAt: 'desc' } },
        invoices: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const deliveries = await prisma.delivery.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        client: project.client,
        accountManager: project.accountManager,
        budget: project.budget,
        actualSpend: project.actualSpend,
        progress: project.progress,
        profitability: project.profitability,
        health: project.health,
        sla: project.sla,
        dueDate: project.dueDate.toISOString(),
        status: project.status,
        priority: project.priority,
        isRecurring: project.isRecurring,
        department: project.department?.name || '',
        createdAt: project.createdAt.toISOString(),
      },
      milestones: project.milestones.map(m => ({
        id: m.id,
        title: m.title,
        date: m.date.toISOString(),
        completed: m.completed,
      })),
      tasks: project.tasks.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        stage: t.stage,
        assignee: t.assignee,
        dueDate: t.dueDate?.toISOString(),
        storyPoints: t.storyPoints,
        timeLogged: t.timeLogged,
        isBlocked: t.isBlocked,
      })),
      invoices: project.invoices.map(inv => ({
        id: inv.id,
        invoiceNo: inv.invoiceNo,
        amount: inv.amount,
        gst: inv.gst,
        status: inv.status,
        dueDate: inv.dueDate.toISOString(),
        paidAmount: inv.paidAmount,
      })),
      deliveries: deliveries.map(d => ({
        id: d.id,
        deliverable: d.deliverable,
        status: d.status,
        dueDate: d.dueDate?.toISOString(),
        clientApproval: d.clientApproval,
        revisionRounds: d.revisionRounds,
        assignedTo: d.assignedTo,
      })),
    });
  } catch (error) {
    console.error('Project Detail API error:', error);
    return NextResponse.json({ error: 'Failed to load project details' }, { status: 500 });
  }
}
