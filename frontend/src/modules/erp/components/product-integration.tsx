'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Box, AlertTriangle, TrendingUp } from 'lucide-react';
import { useGlobalProductStore, useProductsForModule } from '@/store/global-product-store';
import { ProductManager } from '@/components/global-product/product-manager';
import { cn } from '@/lib/utils';

// ERP-specific product integration component
export function ErpProductIntegration() {
  const { 
    getProductsForModule, 
    reserveInventory, 
    releaseInventory, 
    updateInventory 
  } = useGlobalProductStore();

  const erpProducts = useProductsForModule('erp');

  // Calculate ERP-specific metrics
  const erpMetrics = React.useMemo(() => {
    const totalInventory = erpProducts.reduce((sum, p) => sum + p.inventory.available, 0);
    const lowStockProducts = erpProducts.filter(p => p.inventory.available <= p.inventory.lowStockThreshold);
    const outOfStockProducts = erpProducts.filter(p => p.inventory.available === 0);
    const reservedInventory = erpProducts.reduce((sum, p) => sum + p.inventory.reserved, 0);

    return {
      totalProducts: erpProducts.length,
      totalInventory,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      reservedInventory,
      lowStockProducts,
      outOfStockProducts
    };
  }, [erpProducts]);

  const handleReserveInventory = async (productId: string, quantity: number) => {
    try {
      await reserveInventory(productId, quantity, 'erp');
      console.log(`Reserved ${quantity} units of product ${productId} for ERP operations`);
    } catch (error) {
      console.error('Failed to reserve inventory:', error);
    }
  };

  const handleReleaseInventory = async (productId: string, quantity: number) => {
    try {
      await releaseInventory(productId, quantity, 'erp');
      console.log(`Released ${quantity} units of product ${productId} from ERP operations`);
    } catch (error) {
      console.error('Failed to release inventory:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* ERP Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--app-text-muted)]">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[var(--app-structural)]" />
              <span className="text-2xl font-bold text-[var(--app-text)]">{erpMetrics.totalProducts}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--app-text-muted)]">Total Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-blue-500" />
              <span className="text-2xl font-bold text-[var(--app-text)]">{erpMetrics.totalInventory}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--app-text-muted)]">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-600">{erpMetrics.lowStockCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--app-text-muted)]">Reserved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">{erpMetrics.reservedInventory}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {erpMetrics.lowStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[var(--app-text)] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {erpMetrics.lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-[var(--app-surface-1)] rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-[var(--app-text)]">{product.name}</h4>
                    <p className="text-sm text-[var(--app-text-secondary)]">SKU: {product.sku}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-medium",
                        product.inventory.available === 0 ? "text-red-500" : "text-yellow-500"
                      )}>
                        {product.inventory.available} units
                      </p>
                      <p className="text-xs text-[var(--app-text-muted)]">
                        Threshold: {product.inventory.lowStockThreshold}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReserveInventory(product.id, 10)}
                        disabled={product.inventory.available === 0}
                      >
                        Reserve 10
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateInventory(product.id, 100, 'add')}
                      >
                        Restock
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Product Manager */}
      <ProductManager
        moduleId="erp"
        title="ERP Product Management"
        showCreateButton={true}
        showFilters={true}
        showSearch={true}
        showViewToggle={true}
        showExport={true}
        showImport={true}
        allowedActions={{
          create: true,
          edit: true,
          delete: true,
          duplicate: true,
          export: true,
          import: true,
        }}
        onProductSelect={(product) => {
          console.log('ERP - Selected product:', product);
        }}
        onProductCreate={() => {
          console.log('ERP - Creating new product');
        }}
        onProductEdit={(product) => {
          console.log('ERP - Editing product:', product);
        }}
        onProductDelete={(product) => {
          console.log('ERP - Deleting product:', product);
        }}
      />
    </div>
  );
}

// Quick inventory management component
export function QuickInventoryManager() {
  const erpProducts = useProductsForModule('erp');
  const { updateInventory, reserveInventory, releaseInventory } = useGlobalProductStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[var(--app-text)]">Quick Inventory Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {erpProducts.slice(0, 5).map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 border border-[var(--app-border)] rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-[var(--app-text)]">{product.name}</h4>
                <p className="text-sm text-[var(--app-text-secondary)]">
                  Available: {product.inventory.available} | Reserved: {product.inventory.reserved}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => reserveInventory(product.id, 5, 'erp')}
                  disabled={product.inventory.available < 5}
                >
                  Reserve 5
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => releaseInventory(product.id, 5, 'erp')}
                  disabled={product.inventory.reserved < 5}
                >
                  Release 5
                </Button>
                <Button
                  size="sm"
                  onClick={() => updateInventory(product.id, 50, 'add')}
                >
                  +50
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ErpProductIntegration;
