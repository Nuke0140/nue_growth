import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    const employeeId = searchParams.get('employeeId');

    const where: Record<string, unknown> = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (date) {
      const targetDate = new Date(date);
      where.date = {
        gte: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()),
        lt: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1),
      };
    }

    const records = await prisma.attendance.findMany({
      where,
      include: { employee: { include: { department: true } } },
      orderBy: { date: 'desc' },
      take: 100,
    });

    const formatted = records.map(r => ({
      id: r.id,
      employeeId: r.employeeId,
      employeeName: `${r.employee.firstName} ${r.employee.lastName}`,
      department: r.employee.department.name,
      date: r.date.toISOString(),
      checkIn: r.checkIn?.toISOString(),
      checkOut: r.checkOut?.toISOString(),
      hours: r.hours,
      overtime: r.overtime,
      status: r.status,
      isAnomaly: r.isAnomaly,
    }));

    // Today's summary
    const today = new Date();
    const todayRecords = await prisma.attendance.findMany({
      where: {
        date: {
          gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        },
      },
    });

    return NextResponse.json({
      records: formatted,
      total: formatted.length,
      todaySummary: {
        present: todayRecords.filter(r => r.status === 'present').length,
        wfh: todayRecords.filter(r => r.status === 'wfh').length,
        absent: todayRecords.filter(r => r.status === 'absent').length,
        halfDay: todayRecords.filter(r => r.status === 'half-day').length,
        onLeave: todayRecords.filter(r => r.status === 'on-leave').length,
      },
    });
  } catch (error) {
    console.error('Attendance API error:', error);
    return NextResponse.json({ error: 'Failed to load attendance' }, { status: 500 });
  }
}
