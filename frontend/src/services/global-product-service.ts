'use client';

import { apiClient } from '@/lib/http';
import { GlobalProduct, ProductCategory, ProductStatus, ModuleId } from '@/store/global-product-store';

// API Types
export interface CreateProductRequest {
  name: string;
  description: string;
  category: ProductCategory;
  status: ProductStatus;
  price: number;
  currency: string;
  sku: string;
  inventory: {
    total: number;
    lowStockThreshold: number;
  };
  visibility: 'public' | 'private' | 'restricted';
  modules: ModuleId[];
  metadata: {
    tags?: string[];
    attributes?: Record<string, any>;
  };
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  category?: ProductCategory;
  status?: ProductStatus;
  price?: number;
  currency?: string;
  sku?: string;
  inventory?: {
    total?: number;
    lowStockThreshold?: number;
  };
  visibility?: 'public' | 'private' | 'restricted';
  modules?: ModuleId[];
  metadata?: {
    tags?: string[];
    attributes?: Record<string, any>;
  };
}

export interface ProductListResponse {
  products: GlobalProduct[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ProductMetrics {
  totalViews: number;
  totalOrders: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  inventoryTurnover: number;
  lastActivity: string;
}

export interface InventoryOperation {
  productId: string;
  quantity: number;
  operation: 'add' | 'subtract' | 'set' | 'reserve' | 'release';
  moduleId?: ModuleId;
  reason?: string;
  referenceId?: string;
}

// Global Product Service
export class GlobalProductService {
  private static instance: GlobalProductService;

  public static getInstance(): GlobalProductService {
    if (!GlobalProductService.instance) {
      GlobalProductService.instance = new GlobalProductService();
    }
    return GlobalProductService.instance;
  }

  // Product CRUD Operations
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: ProductCategory[];
    status?: ProductStatus[];
    modules?: ModuleId[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ProductListResponse> {
    const response = await apiClient.get<ProductListResponse>('/api/products', { params });
    return response.data;
  }

  async getProduct(id: string): Promise<GlobalProduct> {
    const response = await apiClient.get<GlobalProduct>(`/api/products/${id}`);
    return response.data;
  }

  async createProduct(data: CreateProductRequest): Promise<GlobalProduct> {
    const response = await apiClient.post<GlobalProduct>('/api/products', data);
    return response.data;
  }

  async updateProduct(id: string, data: UpdateProductRequest): Promise<GlobalProduct> {
    const response = await apiClient.patch<GlobalProduct>(`/api/products/${id}`, data);
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/api/products/${id}`);
  }

  async duplicateProduct(id: string, overrides?: Partial<CreateProductRequest>): Promise<GlobalProduct> {
    const response = await apiClient.post<GlobalProduct>(`/api/products/${id}/duplicate`, { overrides });
    return response.data;
  }

  // Inventory Management
  async updateInventory(operation: InventoryOperation): Promise<GlobalProduct> {
    const response = await apiClient.patch<GlobalProduct>(`/api/products/${operation.productId}/inventory`, operation);
    return response.data;
  }

  async bulkUpdateInventory(operations: InventoryOperation[]): Promise<GlobalProduct[]> {
    const response = await apiClient.patch<GlobalProduct[]>('/api/products/inventory/bulk', { operations });
    return response.data;
  }

  async getInventoryHistory(productId: string, params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    history: Array<{
      id: string;
      productId: string;
      operation: string;
      quantity: number;
      previousQuantity: number;
      newQuantity: number;
      reason?: string;
      moduleId?: string;
      createdAt: string;
      createdBy: string;
    }>;
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await apiClient.get(`/api/products/${productId}/inventory/history`, { params });
    return response.data;
  }

  // Product Metrics and Analytics
  async getProductMetrics(productId: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ProductMetrics> {
    const response = await apiClient.get<ProductMetrics>(`/api/products/${productId}/metrics`, { params });
    return response.data;
  }

  async getBulkProductMetrics(productIds: string[], params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<Record<string, ProductMetrics>> {
    const response = await apiClient.post<Record<string, ProductMetrics>>('/api/products/metrics/bulk', {
      productIds,
      ...params
    });
    return response.data;
  }

  // Module Integration
  async getProductsForModule(moduleId: ModuleId, params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ProductListResponse> {
    const response = await apiClient.get<ProductListResponse>(`/api/modules/${moduleId}/products`, { params });
    return response.data;
  }

  async updateProductModuleAccess(productId: string, modules: ModuleId[]): Promise<GlobalProduct> {
    const response = await apiClient.patch<GlobalProduct>(`/api/products/${productId}/modules`, { modules });
    return response.data;
  }

  async checkModuleAccess(moduleId: ModuleId, productId: string): Promise<{
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canManageInventory: boolean;
    canManagePricing: boolean;
  }> {
    const response = await apiClient.get(`/api/modules/${moduleId}/products/${productId}/access`);
    return response.data;
  }

  // Bulk Operations
  async bulkUpdateProducts(productIds: string[], updates: UpdateProductRequest): Promise<GlobalProduct[]> {
    const response = await apiClient.patch<GlobalProduct[]>('/api/products/bulk', {
      productIds,
      updates
    });
    return response.data;
  }

  async bulkDeleteProducts(productIds: string[]): Promise<void> {
    await apiClient.delete('/api/products/bulk', { data: { productIds } });
  }

  // Import/Export
  async exportProducts(params?: {
    productIds?: string[];
    format?: 'csv' | 'xlsx' | 'json';
    includeMetrics?: boolean;
  }): Promise<Blob> {
    const response = await apiClient.get('/api/products/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }

  async importProducts(file: File, options?: {
    format?: 'csv' | 'xlsx' | 'json';
    skipDuplicates?: boolean;
    updateExisting?: boolean;
  }): Promise<{
    imported: number;
    updated: number;
    errors: string[];
    skipped: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const response = await apiClient.post('/api/products/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  // Search and Filtering
  async searchProducts(query: string, params?: {
    limit?: number;
    category?: ProductCategory[];
    status?: ProductStatus[];
    modules?: ModuleId[];
  }): Promise<GlobalProduct[]> {
    const response = await apiClient.get<GlobalProduct[]>('/api/products/search', {
      params: { query, ...params }
    });
    return response.data;
  }

  async getProductSuggestions(query: string, limit: number = 10): Promise<GlobalProduct[]> {
    const response = await apiClient.get<GlobalProduct[]>('/api/products/suggestions', {
      params: { query, limit }
    });
    return response.data;
  }

  // Product Variants
  async getProductVariants(productId: string): Promise<GlobalProduct['metadata']['variants']> {
    const response = await apiClient.get<GlobalProduct['metadata']['variants']>(`/api/products/${productId}/variants`);
    return response.data;
  }

  async createProductVariant(productId: string, variant: Omit<GlobalProduct['metadata']['variants'][0], 'id'>): Promise<GlobalProduct['metadata']['variants'][0]> {
    const response = await apiClient.post<GlobalProduct['metadata']['variants'][0]>(`/api/products/${productId}/variants`, variant);
    return response.data;
  }

  async updateProductVariant(productId: string, variantId: string, updates: Partial<GlobalProduct['metadata']['variants'][0]>): Promise<GlobalProduct['metadata']['variants'][0]> {
    const response = await apiClient.patch<GlobalProduct['metadata']['variants'][0]>(`/api/products/${productId}/variants/${variantId}`, updates);
    return response.data;
  }

  async deleteProductVariant(productId: string, variantId: string): Promise<void> {
    await apiClient.delete(`/api/products/${productId}/variants/${variantId}`);
  }

  // Product Categories and Tags
  async getProductCategories(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    productCount: number;
  }>> {
    const response = await apiClient.get('/api/products/categories');
    return response.data;
  }

  async getProductTags(): Promise<Array<{
    tag: string;
    count: number;
  }>> {
    const response = await apiClient.get('/api/products/tags');
    return response.data;
  }

  // Product Lifecycle
  async archiveProduct(productId: string): Promise<GlobalProduct> {
    const response = await apiClient.patch<GlobalProduct>(`/api/products/${productId}/archive`);
    return response.data;
  }

  async activateProduct(productId: string): Promise<GlobalProduct> {
    const response = await apiClient.patch<GlobalProduct>(`/api/products/${productId}/activate`);
    return response.data;
  }

  async discontinueProduct(productId: string): Promise<GlobalProduct> {
    const response = await apiClient.patch<GlobalProduct>(`/api/products/${productId}/discontinue`);
    return response.data;
  }

  // Product Pricing
  async updateProductPrice(productId: string, price: number, currency?: string): Promise<GlobalProduct> {
    const response = await apiClient.patch<GlobalProduct>(`/api/products/${productId}/price`, {
      price,
      currency
    });
    return response.data;
  }

  async getProductPriceHistory(productId: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<Array<{
    id: string;
    productId: string;
    oldPrice: number;
    newPrice: number;
    currency: string;
    reason?: string;
    createdAt: string;
    createdBy: string;
  }>> {
    const response = await apiClient.get(`/api/products/${productId}/price/history`, { params });
    return response.data;
  }

  // Product Relationships
  async getRelatedProducts(productId: string, limit: number = 10): Promise<GlobalProduct[]> {
    const response = await apiClient.get<GlobalProduct[]>(`/api/products/${productId}/related`, {
      params: { limit }
    });
    return response.data;
  }

  async getCrossSellProducts(productId: string, limit: number = 10): Promise<GlobalProduct[]> {
    const response = await apiClient.get<GlobalProduct[]>(`/api/products/${productId}/cross-sell`, {
      params: { limit }
    });
    return response.data;
  }

  async getUpSellProducts(productId: string, limit: number = 10): Promise<GlobalProduct[]> {
    const response = await apiClient.get<GlobalProduct[]>(`/api/products/${productId}/up-sell`, {
      params: { limit }
    });
    return response.data;
  }
}

// Export singleton instance
export const globalProductService = GlobalProductService.getInstance();

// Export types for use in components
export type {
  CreateProductRequest,
  UpdateProductRequest,
  ProductListResponse,
  ProductMetrics,
  InventoryOperation
};
