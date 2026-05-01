import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const health = searchParams.get('health');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (health) where.health = health;

    const projects = await prisma.project.findMany({
      where,
      include: {
        department: true,
        milestones: { orderBy: { date: 'asc' } },
        tasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = projects.map(proj => ({
      id: proj.id,
      name: proj.name,
      client: proj.client,
      accountManager: proj.accountManager,
      budget: proj.budget,
      actualSpend: proj.actualSpend,
      progress: proj.progress,
      profitability: proj.profitability,
      health: proj.health,
      sla: proj.sla,
      dueDate: proj.dueDate.toISOString(),
      status: proj.status,
      priority: proj.priority,
      isRecurring: proj.isRecurring,
      department: proj.department?.name || '',
      milestoneCount: proj.milestones.length,
      completedMilestones: proj.milestones.filter(m => m.completed).length,
      taskCount: proj.tasks.length,
      completedTasks: proj.tasks.filter(t => t.stage === 'done').length,
      milestones: proj.milestones.map(m => ({
        id: m.id,
        title: m.title,
        date: m.date.toISOString(),
        completed: m.completed,
      })),
    }));

    return NextResponse.json({ projects: formatted, total: formatted.length });
  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 });
  }
}
