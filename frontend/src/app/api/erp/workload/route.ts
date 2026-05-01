import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const workloads = await prisma.workloadEntry.findMany({
      include: { employee: { include: { department: true } } },
      orderBy: { allocation: 'desc' },
    });

    const formatted = workloads.map(w => ({
      id: w.id,
      employeeId: w.employeeId,
      employeeName: `${w.employee.firstName} ${w.employee.lastName}`,
      department: w.employee.department.name,
      designation: w.employee.designation,
      allocation: w.allocation,
      capacity: w.capacity,
      projects: JSON.parse(w.projects),
      overtime: w.overtime,
      status: w.status,
    }));

    const overloaded = workloads.filter(w => w.status === 'overloaded').length;
    const atCapacity = workloads.filter(w => w.status === 'at-capacity').length;
    const optimal = workloads.filter(w => w.status === 'optimal').length;
    const underUtilized = workloads.filter(w => w.status === 'under-utilized').length;
    const avgAllocation = workloads.length > 0
      ? workloads.reduce((sum, w) => sum + w.allocation, 0) / workloads.length
      : 0;

    return NextResponse.json({
      workloads: formatted,
      total: formatted.length,
      summary: {
        overloaded,
        atCapacity,
        optimal,
        underUtilized,
        avgAllocation: Math.round(avgAllocation * 10) / 10,
      },
    });
  } catch (error) {
    console.error('Workload API error:', error);
    return NextResponse.json({ error: 'Failed to load workload data' }, { status: 500 });
  }
}
