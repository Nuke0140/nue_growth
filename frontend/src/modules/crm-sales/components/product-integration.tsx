'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, DollarSign, TrendingUp, Plus, Minus } from 'lucide-react';
import { useGlobalProductStore, useProductsForModule, GlobalProduct } from '@/store/global-product-store';
import { ProductManager } from '@/components/global-product/product-manager';
import { cn } from '@/lib/utils';

interface OpportunityProduct {
  product: GlobalProduct;
  quantity: number;
  discount: number;
  totalPrice: number;
}

// CRM-specific product integration component
export function CrmProductIntegration() {
  const { getProductsForModule, canModuleAccessProduct } = useGlobalProductStore();
  const crmProducts = useProductsForModule('crm');
  
  const [opportunityProducts, setOpportunityProducts] = useState<OpportunityProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);

  // Calculate CRM-specific metrics
  const crmMetrics = React.useMemo(() => {
    const totalProducts = crmProducts.length;
    const activeProducts = crmProducts.filter(p => p.status === 'active').length;
    const totalValue = crmProducts.reduce((sum, p) => sum + (p.price * p.inventory.available), 0);
    const averagePrice = crmProducts.length > 0 ? crmProducts.reduce((sum, p) => sum + p.price, 0) / crmProducts.length : 0;

    return {
      totalProducts,
      activeProducts,
      totalValue,
      averagePrice
    };
  }, [crmProducts]);

  const handleAddProduct = () => {
    const product = crmProducts.find(p => p.id === selectedProductId);
    if (!product) return;

    const existingIndex = opportunityProducts.findIndex(op => op.product.id === product.id);
    
    if (existingIndex >= 0) {
      // Update existing product
      const updated = [...opportunityProducts];
      updated[existingIndex].quantity += quantity;
      updated[existingIndex].discount = discount;
      updated[existingIndex].totalPrice = calculateProductPrice(product, quantity, discount);
      setOpportunityProducts(updated);
    } else {
      // Add new product
      const opportunityProduct: OpportunityProduct = {
        product,
        quantity,
        discount,
        totalPrice: calculateProductPrice(product, quantity, discount)
      };
      setOpportunityProducts([...opportunityProducts, opportunityProduct]);
    }

    // Reset form
    setSelectedProductId('');
    setQuantity(1);
    setDiscount(0);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setOpportunityProducts(prev => prev.map(op => {
      if (op.product.id === productId) {
        return {
          ...op,
          quantity: newQuantity,
          totalPrice: calculateProductPrice(op.product, newQuantity, op.discount)
        };
      }
      return op;
    }));
  };

  const handleUpdateDiscount = (productId: string, newDiscount: number) => {
    setOpportunityProducts(prev => prev.map(op => {
      if (op.product.id === productId) {
        return {
          ...op,
          discount: newDiscount,
          totalPrice: calculateProductPrice(op.product, op.quantity, newDiscount)
        };
      }
      return op;
    }));
  };

  const handleRemoveProduct = (productId: string) => {
    setOpportunityProducts(prev => prev.filter(op => op.product.id !== productId));
  };

  const calculateProductPrice = (product: GlobalProduct, qty: number, disc: number): number => {
    const basePrice = product.price * qty;
    const discountAmount = basePrice * (disc / 100);
    return basePrice - discountAmount;
  };

  const calculateOpportunityTotal = (): number => {
    return opportunityProducts.reduce((sum, op) => sum + op.totalPrice, 0);
  };

  const selectedProduct = crmProducts.find(p => p.id === selectedProductId);

  return (
    <div className="space-y-6">
      {/* CRM Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--app-text-muted)]">Available Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[var(--app-structural)]" />
              <span className="text-2xl font-bold text-[var(--app-text)]">{crmMetrics.totalProducts}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--app-text-muted)]">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{crmMetrics.activeProducts}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--app-text-muted)]">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-500" />
              <span className="text-2xl font-bold text-[var(--app-text)]">${crmMetrics.totalValue.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--app-text-muted)]">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-500" />
              <span className="text-2xl font-bold text-[var(--app-text)]">${crmMetrics.averagePrice.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opportunity Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[var(--app-text)]">Opportunity Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Product Selection */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="product-select">Product</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {crmProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{product.name}</span>
                          <span className="text-sm text-[var(--app-text-muted)] ml-2">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              
              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Product Preview */}
            {selectedProduct && (
              <div className="p-4 bg-[var(--app-surface-1)] rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[var(--app-text)]">{selectedProduct.name}</h4>
                    <p className="text-sm text-[var(--app-text-secondary)]">{selectedProduct.description}</p>
                    <p className="text-sm text-[var(--app-text-muted)] mt-1">
                      Unit Price: ${selectedProduct.price.toFixed(2)} | Available: {selectedProduct.inventory.available}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-[var(--app-text)]">
                      ${calculateProductPrice(selectedProduct, quantity, discount).toFixed(2)}
                    </p>
                    <p className="text-xs text-[var(--app-text-muted)]">
                      {quantity} × ${selectedProduct.price.toFixed(2)}
                      {discount > 0 && ` - ${discount}%`}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleAddProduct}
                  className="w-full mt-3"
                  disabled={!selectedProduct || quantity < 1}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Opportunity
                </Button>
              </div>
            )}

            {/* Opportunity Products */}
            {opportunityProducts.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-[var(--app-text)]">Opportunity Products</h3>
                {opportunityProducts.map((op) => (
                  <div key={op.product.id} className="p-4 border border-[var(--app-border)] rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-[var(--app-text)]">{op.product.name}</h4>
                        <p className="text-sm text-[var(--app-text-secondary)]">SKU: {op.product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[var(--app-text)]">${op.totalPrice.toFixed(2)}</p>
                        <p className="text-xs text-[var(--app-text-muted)]">
                          ${op.product.price.toFixed(2)} × {op.quantity}
                          {op.discount > 0 && ` - ${op.discount}%`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Qty:</Label>
                        <div className="flex items-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateQuantity(op.product.id, Math.max(1, op.quantity - 1))}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={op.quantity}
                            onChange={(e) => handleUpdateQuantity(op.product.id, parseInt(e.target.value) || 1)}
                            className="w-16 mx-2 text-center"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateQuantity(op.product.id, op.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Discount:</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={op.discount}
                          onChange={(e) => handleUpdateDiscount(op.product.id, parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                        />
                        <span className="text-sm text-[var(--app-text-muted)]">%</span>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveProduct(op.product.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Opportunity Total */}
                <div className="p-4 bg-[var(--app-surface-2)] rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-[var(--app-text)]">Opportunity Total:</span>
                    <span className="text-xl font-bold text-[var(--app-accent)]">
                      ${calculateOpportunityTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Full Product Manager */}
      <ProductManager
        moduleId="crm"
        title="CRM Product Catalog"
        showCreateButton={false} // CRM typically doesn't create products
        showFilters={true}
        showSearch={true}
        showViewToggle={true}
        showExport={true}
        showImport={false}
        allowedActions={{
          create: false,
          edit: false,
          delete: false,
          duplicate: false,
          export: true,
          import: false,
        }}
        onProductSelect={(product) => {
          console.log('CRM - Selected product for opportunity:', product);
          setSelectedProductId(product.id);
        }}
      />
    </div>
  );
}

// Product recommendation component for CRM
export function ProductRecommendations({ customerId }: { customerId?: string }) {
  const crmProducts = useProductsForModule('crm');
  
  // Mock recommendation logic
  const recommendedProducts = React.useMemo(() => {
    return crmProducts
      .filter(p => p.status === 'active')
      .sort((a, b) => b.price - a.price) // Recommend higher-priced products first
      .slice(0, 3);
  }, [crmProducts]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[var(--app-text)]">Recommended Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendedProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-[var(--app-surface-1)] rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-[var(--app-text)]">{product.name}</h4>
                <p className="text-sm text-[var(--app-text-secondary)] line-clamp-1">{product.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="text-xs bg-[var(--app-accent-light)] text-[var(--app-accent)]">
                    {product.category}
                  </Badge>
                  <span className="text-sm text-[var(--app-text-muted)]">
                    {product.inventory.available} available
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[var(--app-text)]">${product.price.toFixed(2)}</p>
                <Button size="sm" className="mt-1">
                  Add to Deal
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CrmProductIntegration;
