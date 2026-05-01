'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  DollarSign, 
  Box, 
  Eye, 
  Edit, 
  Trash2, 
  Copy,
  MoreVertical,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { GlobalProduct, ModuleId } from '@/store/global-product-store';

interface ProductCardProps {
  product: GlobalProduct;
  currentModule: ModuleId;
  viewMode?: 'grid' | 'list';
  onSelect?: (product: GlobalProduct) => void;
  onEdit?: (product: GlobalProduct) => void;
  onDelete?: (product: GlobalProduct) => void;
  onDuplicate?: (product: GlobalProduct) => void;
  showActions?: boolean;
  className?: string;
}

export const ProductCard = memo(function ProductCard({
  product,
  currentModule,
  viewMode = 'grid',
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  showActions = true,
  className
}: ProductCardProps) {
  const isLowStock = product.inventory.available <= product.inventory.lowStockThreshold;
  const isOutOfStock = product.inventory.available === 0;
  const hasReservedInventory = product.inventory.reserved > 0;

  const getStatusIcon = () => {
    switch (product.status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'draft':
        return <Edit className="w-4 h-4 text-gray-500" />;
      case 'archived':
        return <Package className="w-4 h-4 text-gray-400" />;
      case 'discontinued':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (product.status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'archived':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'discontinued':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = () => {
    switch (product.category) {
      case 'physical':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'digital':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'service':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'subscription':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'license':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCardClick = () => {
    onSelect?.(product);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(product);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(product);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate?.(product);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "group hover:bg-[var(--app-hover-bg)] border border-[var(--app-border)] rounded-lg p-4 cursor-pointer transition-all duration-200",
          "bg-[var(--app-card-bg)]",
          className
        )}
        onClick={handleCardClick}
      >
        <div className="flex items-center gap-4">
          {/* Product Image/Icon */}
          <div className="w-12 h-12 rounded-lg bg-[var(--app-surface-1)] flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 text-[var(--app-text-muted)]" />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-[var(--app-text)] truncate">
                {product.name}
              </h3>
              {getStatusIcon()}
            </div>
            <p className="text-sm text-[var(--app-text-secondary)] truncate mb-2">
              {product.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs">
              <span className="text-[var(--app-text-muted)]">SKU: {product.sku}</span>
              <Badge className={cn("text-xs", getCategoryColor())}>
                {product.category}
              </Badge>
              <Badge className={cn("text-xs", getStatusColor())}>
                {product.status}
              </Badge>
            </div>
          </div>

          {/* Inventory & Price */}
          <div className="text-right shrink-0">
            <div className="text-lg font-semibold text-[var(--app-text)]">
              ${product.price.toFixed(2)}
            </div>
            <div className={cn(
              "text-sm flex items-center gap-1",
              isOutOfStock ? "text-red-500" : isLowStock ? "text-yellow-500" : "text-[var(--app-text-secondary)]"
            )}>
              <Box className="w-3 h-3" />
              {product.inventory.available} available
              {hasReservedInventory && (
                <span className="text-xs text-[var(--app-text-muted)]">
                  ({product.inventory.reserved} reserved)
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group hover:shadow-lg cursor-pointer transition-all duration-200",
        className
      )}
      onClick={handleCardClick}
    >
      <Card className="bg-[var(--app-card-bg)] border-[var(--app-border)] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[var(--app-surface-1)] flex items-center justify-center">
                <Package className="w-5 h-5 text-[var(--app-text-muted)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--app-text)] truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-[var(--app-text-muted)]">
                  {product.sku}
                </p>
              </div>
            </div>
            {getStatusIcon()}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm text-[var(--app-text-secondary)] line-clamp-2 mb-3">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-bold text-[var(--app-text)]">
              ${product.price.toFixed(2)}
            </div>
            <div className={cn(
              "text-sm flex items-center gap-1",
              isOutOfStock ? "text-red-500" : isLowStock ? "text-yellow-500" : "text-[var(--app-text-secondary)]"
            )}>
              <Box className="w-3 h-3" />
              {product.inventory.available}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Badge className={cn("text-xs", getCategoryColor())}>
              {product.category}
            </Badge>
            <Badge className={cn("text-xs", getStatusColor())}>
              {product.status}
            </Badge>
          </div>

          {/* Module Access Indicators */}
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xs text-[var(--app-text-muted)]">Modules:</span>
            <div className="flex gap-1">
              {product.modules.slice(0, 3).map((module) => (
                <div
                  key={module}
                  className="w-5 h-5 rounded bg-[var(--app-accent-light)] text-[var(--app-accent)] text-xs flex items-center justify-center font-medium"
                  title={module}
                >
                  {module.charAt(0).toUpperCase()}
                </div>
              ))}
              {product.modules.length > 3 && (
                <div className="w-5 h-5 rounded bg-[var(--app-surface-1)] text-[var(--app-text-muted)] text-xs flex items-center justify-center font-medium">
                  +{product.modules.length - 3}
                </div>
              )}
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-2 pt-2 border-t border-[var(--app-border)]">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="flex-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Export memoized component
export default ProductCard;
