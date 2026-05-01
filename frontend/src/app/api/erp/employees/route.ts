import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (department) where.departmentId = department;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { designation: { contains: search } },
      ];
    }

    const employees = await prisma.employee.findMany({
      where,
      include: {
        department: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = employees.map(emp => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      email: emp.email,
      phone: emp.phone,
      department: emp.department.name,
      departmentCode: emp.department.code,
      designation: emp.designation,
      managerId: emp.managerId,
      salaryBand: emp.salaryBand,
      baseSalary: emp.baseSalary,
      joinDate: emp.joinDate.toISOString(),
      status: emp.status,
      productivityScore: emp.productivityScore,
      avatar: emp.avatar,
    }));

    return NextResponse.json({ employees: formatted, total: formatted.length });
  } catch (error) {
    console.error('Employees API error:', error);
    return NextResponse.json({ error: 'Failed to load employees' }, { status: 500 });
  }
}
