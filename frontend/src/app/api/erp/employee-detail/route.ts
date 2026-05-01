import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Employee ID required' }, { status: 400 });
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        attendance: { take: 30, orderBy: { date: 'desc' } },
        leaves: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Get active projects for this employee
    const tasks = await prisma.task.findMany({
      where: { assignee: `${employee.firstName} ${employee.lastName}` },
      include: { project: true },
    });

    const activeProjects = [...new Map(tasks.map(t => [t.project.id, t.project])).values()];

    const workload = await prisma.workloadEntry.findFirst({
      where: { employeeId: id },
    });

    return NextResponse.json({
      employee: {
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        email: employee.email,
        phone: employee.phone,
        department: employee.department.name,
        departmentCode: employee.department.code,
        designation: employee.designation,
        salaryBand: employee.salaryBand,
        baseSalary: employee.baseSalary,
        joinDate: employee.joinDate.toISOString(),
        status: employee.status,
        productivityScore: employee.productivityScore,
        avatar: employee.avatar,
      },
      activeProjects: activeProjects.map(p => ({
        id: p.id,
        name: p.name,
        client: p.client,
        progress: p.progress,
        health: p.health,
        status: p.status,
      })),
      recentAttendance: employee.attendance.map(a => ({
        id: a.id,
        date: a.date.toISOString(),
        checkIn: a.checkIn?.toISOString(),
        checkOut: a.checkOut?.toISOString(),
        hours: a.hours,
        overtime: a.overtime,
        status: a.status,
        isAnomaly: a.isAnomaly,
      })),
      recentLeaves: employee.leaves.map(l => ({
        id: l.id,
        type: l.type,
        startDate: l.startDate.toISOString(),
        endDate: l.endDate.toISOString(),
        days: l.days,
        status: l.status,
        reason: l.reason,
      })),
      workload: workload ? {
        allocation: workload.allocation,
        capacity: workload.capacity,
        status: workload.status,
        projects: JSON.parse(workload.projects),
        overtime: workload.overtime,
      } : null,
    });
  } catch (error) {
    console.error('Employee Detail API error:', error);
    return NextResponse.json({ error: 'Failed to load employee details' }, { status: 500 });
  }
}
