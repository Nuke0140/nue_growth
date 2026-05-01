'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Grid3X3,
  List,
  Table,
  Download,
  Upload,
  MoreHorizontal,
  X,
  ChevronDown,
  Package,
  DollarSign,
  Box,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useGlobalProductStore, useFilteredProducts, GlobalProduct, ModuleId, ProductCategory, ProductStatus } from '@/store/global-product-store';
import { ProductCard } from './product-card';

interface ProductManagerProps {
  moduleId: ModuleId;
  title?: string;
  showCreateButton?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  showViewToggle?: boolean;
  showExport?: boolean;
  showImport?: boolean;
  allowedActions?: {
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
    duplicate?: boolean;
    export?: boolean;
    import?: boolean;
  };
  onProductSelect?: (product: GlobalProduct) => void;
  onProductCreate?: () => void;
  onProductEdit?: (product: GlobalProduct) => void;
  onProductDelete?: (product: GlobalProduct) => void;
  className?: string;
}

export function ProductManager({
  moduleId,
  title = 'Products',
  showCreateButton = true,
  showFilters = true,
  showSearch = true,
  showViewToggle = true,
  showExport = true,
  showImport = true,
  allowedActions = {
    create: true,
    edit: true,
    delete: true,
    duplicate: true,
    export: true,
    import: true,
  },
  onProductSelect,
  onProductCreate,
  onProductEdit,
  onProductDelete,
  className
}: ProductManagerProps) {
  // Store state
  const {
    isLoading,
    searchQuery,
    filters,
    viewMode,
    sortBy,
    sortOrder,
    setSearchQuery,
    setFilters,
    setViewMode,
    setSorting,
    createProduct,
    deleteProduct,
    duplicateProduct,
    exportProducts,
    importProducts,
    fetchProducts
  } = useGlobalProductStore();

  // Local state
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Get filtered products for this module
  const filteredProducts = useFilteredProducts();
  const moduleProducts = useGlobalProductStore(state => state.getProductsForModule(moduleId));

  // Filter products for current module
  const displayProducts = useMemo(() => {
    return filteredProducts.filter(product => 
      moduleProducts.some(moduleProduct => moduleProduct.id === product.id)
    );
  }, [filteredProducts, moduleProducts]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = displayProducts.length;
    const active = displayProducts.filter(p => p.status === 'active').length;
    const lowStock = displayProducts.filter(p => p.inventory.available <= p.inventory.lowStockThreshold).length;
    const outOfStock = displayProducts.filter(p => p.inventory.available === 0).length;
    const totalValue = displayProducts.reduce((sum, p) => sum + (p.price * p.inventory.available), 0);

    return { total, active, lowStock, outOfStock, totalValue };
  }, [displayProducts]);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle product actions
  const handleProductSelect = (product: GlobalProduct) => {
    onProductSelect?.(product);
  };

  const handleProductEdit = (product: GlobalProduct) => {
    onProductEdit?.(product);
  };

  const handleProductDelete = async (product: GlobalProduct) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      await deleteProduct(product.id);
      onProductDelete?.(product);
    }
  };

  const handleProductDuplicate = async (product: GlobalProduct) => {
    await duplicateProduct(product.id);
  };

  const handleCreateProduct = async () => {
    setIsCreating(true);
    try {
      // In a real app, this would open a modal or navigate to create page
      const newProduct = await createProduct({
        name: 'New Product',
        description: 'Product description',
        category: 'physical',
        status: 'draft',
        price: 0,
        currency: 'USD',
        sku: `NEW-${Date.now()}`,
        inventory: {
          total: 0,
          available: 0,
          reserved: 0,
          lowStockThreshold: 10
        },
        visibility: 'private',
        modules: [moduleId],
        permissions: {
          canView: [moduleId],
          canEdit: [moduleId],
          canDelete: [moduleId],
          canManageInventory: [moduleId],
          canManagePricing: [moduleId]
        },
        metadata: {
          tags: [],
          attributes: {}
        }
      });
      
      onProductCreate?.();
      // In a real app, you might want to edit the newly created product
      handleProductEdit(newProduct);
    } finally {
      setIsCreating(false);
    }
  };

  const handleExport = async () => {
    if (selectedProducts.length > 0) {
      const blob = await exportProducts(selectedProducts);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = await exportProducts();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'all-products.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const result = await importProducts(file);
      if (result.errors.length > 0) {
        alert(`Imported ${result.imported} products with ${result.errors.length} errors`);
      } else {
        alert(`Successfully imported ${result.imported} products`);
      }
    }
  };

  const handleBulkSelect = (productId: string, checked: boolean) => {
    setSelectedProducts(prev => 
      checked 
        ? [...prev, productId]
        : prev.filter(id => id !== productId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedProducts(checked ? displayProducts.map(p => p.id) : []);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const hasActiveFilters = searchQuery || Object.keys(filters).length > 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--app-text)]">{title}</h1>
          <p className="text-[var(--app-text-secondary)]">
            {stats.total} products • {stats.active} active
          </p>
        </div>
        
        {showCreateButton && allowedActions.create && (
          <Button onClick={handleCreateProduct} disabled={isCreating}>
            <Plus className="w-4 h-4 mr-2" />
            {isCreating ? 'Creating...' : 'Add Product'}
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[var(--app-text-muted)]" />
              <div>
                <p className="text-sm text-[var(--app-text-muted)]">Total Products</p>
                <p className="text-lg font-semibold text-[var(--app-text)]">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-[var(--app-text-muted)]">Active</p>
                <p className="text-lg font-semibold text-green-600">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-sm text-[var(--app-text-muted)]">Low Stock</p>
                <p className="text-lg font-semibold text-yellow-600">{stats.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-sm text-[var(--app-text-muted)]">Out of Stock</p>
                <p className="text-lg font-semibold text-red-600">{stats.outOfStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[var(--app-text-muted)]" />
              <div>
                <p className="text-sm text-[var(--app-text-muted)]">Total Value</p>
                <p className="text-lg font-semibold text-[var(--app-text)]">${stats.totalValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {showSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--app-text-muted)]" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
          
          {showFilters && (
            <Button
              variant="outline"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={cn(
                "gap-2",
                hasActiveFilters && "border-[var(--app-accent)] text-[var(--app-accent)]"
              )}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">•</Badge>}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showViewToggle && (
            <div className="flex items-center border border-[var(--app-border)] rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none border-l border-[var(--app-border)]"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-l-none border-l border-[var(--app-border)]"
              >
                <Table className="w-4 h-4" />
              </Button>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {showExport && allowedActions.export && (
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </DropdownMenuItem>
              )}
              {showImport && allowedActions.import && (
                <>
                  <DropdownMenuItem asChild>
                    <label className="cursor-pointer flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleImport}
                        className="hidden"
                      />
                    </label>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFiltersPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[var(--app-card-bg)] border border-[var(--app-border)] rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-[var(--app-text)]">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-[var(--app-text)] mb-2 block">Category</label>
                <Select
                  value={filters.category?.[0] || ''}
                  onValueChange={(value) => setFilters({ category: value ? [value as ProductCategory] : [] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="license">License</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-[var(--app-text)] mb-2 block">Status</label>
                <Select
                  value={filters.status?.[0] || ''}
                  onValueChange={(value) => setFilters({ status: value ? [value as ProductStatus] : [] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium text-[var(--app-text)] mb-2 block">Sort by</label>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSorting(value as any, sortOrder)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="createdAt">Created</SelectItem>
                    <SelectItem value="updatedAt">Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="text-sm font-medium text-[var(--app-text)] mb-2 block">Order</label>
                <Select
                  value={sortOrder}
                  onValueChange={(value) => setSorting(sortBy, value as 'asc' | 'desc')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-[var(--app-surface-1)] rounded mb-2"></div>
                <div className="h-3 bg-[var(--app-surface-1)] rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-[var(--app-surface-1)] rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : displayProducts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-[var(--app-text-muted)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--app-text)] mb-2">No products found</h3>
            <p className="text-[var(--app-text-secondary)] mb-4">
              {hasActiveFilters ? 'Try adjusting your filters' : 'Get started by creating your first product'}
            </p>
            {showCreateButton && allowedActions.create && !hasActiveFilters && (
              <Button onClick={handleCreateProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Create Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
          viewMode === 'list' && "space-y-2",
          viewMode === 'table' && "overflow-x-auto"
        )}>
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currentModule={moduleId}
              viewMode={viewMode === 'table' ? 'list' : viewMode}
              onSelect={handleProductSelect}
              onEdit={allowedActions.edit ? handleProductEdit : undefined}
              onDelete={allowedActions.delete ? handleProductDelete : undefined}
              onDuplicate={allowedActions.duplicate ? handleProductDuplicate : undefined}
              showActions={allowedActions.edit || allowedActions.delete || allowedActions.duplicate}
            />
          ))}
        </div>
      )}

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 right-4 bg-[var(--app-card-bg)] border border-[var(--app-border)] rounded-lg p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--app-text)]">
              {selectedProducts.length} items selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedProducts([])}>
                Clear selection
              </Button>
              {allowedActions.export && (
                <Button variant="outline" size="sm" onClick={handleExport}>
                  Export selected
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default ProductManager;
