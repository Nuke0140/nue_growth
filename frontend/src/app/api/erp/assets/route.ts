import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formatted = assets.map(a => ({
      id: a.id,
      name: a.name,
      type: a.type,
      serialNo: a.serialNo,
      assignedTo: a.assignedTo,
      warrantyEnd: a.warrantyEnd?.toISOString(),
      status: a.status,
      purchaseDate: a.purchaseDate.toISOString(),
      purchaseCost: a.purchaseCost,
    }));

    const totalValue = assets.reduce((sum, a) => sum + a.purchaseCost, 0);
    const warrantyExpiring = assets.filter(a => {
      if (!a.warrantyEnd) return false;
      const daysLeft = (new Date(a.warrantyEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return daysLeft < 90 && daysLeft > 0;
    }).length;

    return NextResponse.json({
      assets: formatted,
      total: formatted.length,
      summary: {
        totalValue,
        activeAssets: assets.filter(a => a.status === 'active').length,
        inRepair: assets.filter(a => a.status === 'in-repair').length,
        warrantyExpiring,
      },
    });
  } catch (error) {
    console.error('Assets API error:', error);
    return NextResponse.json({ error: 'Failed to load assets' }, { status: 500 });
  }
}
