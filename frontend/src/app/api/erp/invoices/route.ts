import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const invoices = await prisma.invoice.findMany({
      where,
      include: { project: true },
      orderBy: { createdAt: 'desc' },
    });

    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalGst = invoices.reduce((sum, inv) => sum + inv.gst, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;

    const formatted = invoices.map(inv => ({
      id: inv.id,
      invoiceNo: inv.invoiceNo,
      client: inv.client,
      project: inv.project?.name || '',
      amount: inv.amount,
      gst: inv.gst,
      totalWithGst: inv.amount + inv.gst,
      dueDate: inv.dueDate.toISOString(),
      paidAmount: inv.paidAmount,
      status: inv.status,
      recurring: inv.recurring,
      createdAt: inv.createdAt.toISOString(),
    }));

    return NextResponse.json({
      invoices: formatted,
      total: formatted.length,
      summary: {
        totalAmount,
        totalGst,
        totalPaid,
        overdueCount,
        pendingAmount: totalAmount + totalGst - totalPaid,
      },
    });
  } catch (error) {
    console.error('Invoices API error:', error);
    return NextResponse.json({ error: 'Failed to load invoices' }, { status: 500 });
  }
}
