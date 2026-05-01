import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formatted = vendors.map(v => ({
      id: v.id,
      name: v.name,
      type: v.type,
      contractValue: v.contractValue,
      payoutDue: v.payoutDue,
      slaScore: v.slaScore,
      qualityScore: v.qualityScore,
      rating: v.rating,
      status: v.status,
    }));

    const totalContractValue = vendors.reduce((sum, v) => sum + v.contractValue, 0);
    const totalPayoutDue = vendors.reduce((sum, v) => sum + v.payoutDue, 0);
    const avgRating = vendors.length > 0 ? vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length : 0;

    return NextResponse.json({
      vendors: formatted,
      total: formatted.length,
      summary: {
        totalContractValue,
        totalPayoutDue,
        avgRating: Math.round(avgRating * 10) / 10,
        activeVendors: vendors.filter(v => v.status === 'active').length,
      },
    });
  } catch (error) {
    console.error('Vendors API error:', error);
    return NextResponse.json({ error: 'Failed to load vendors' }, { status: 500 });
  }
}
