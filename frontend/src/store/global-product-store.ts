'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Global Product Types
export interface GlobalProduct {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  status: ProductStatus;
  price: number;
  currency: string;
  sku: string;
  inventory: {
    total: number;
    available: number;
    reserved: number;
    lowStockThreshold: number;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    tags: string[];
    attributes: Record<string, any>;
    variants?: ProductVariant[];
  };
  visibility: ProductVisibility;
  modules: ModuleId[]; // Which modules can access this product
  permissions: ProductPermissions;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  inventory: number;
  attributes: Record<string, any>;
}

export type ProductCategory = 
  | 'physical'
  | 'digital'
  | 'service'
  | 'subscription'
  | 'license';

export type ProductStatus = 
  | 'active'
  | 'inactive'
  | 'draft'
  | 'archived'
  | 'discontinued';

export type ProductVisibility = 
  | 'public'
  | 'private'
  | 'restricted';

export type ModuleId = 
  | 'crm'
  | 'erp'
  | 'marketing'
  | 'sales'
  | 'finance'
  | 'growth'
  | 'analytics'
  | 'automation'
  | 'settings';

export interface ProductPermissions {
  canView: ModuleId[];
  canEdit: ModuleId[];
  canDelete: ModuleId[];
  canManageInventory: ModuleId[];
  canManagePricing: ModuleId[];
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

// Global Product State Interface
interface GlobalProductState {
  // Product Data
  products: GlobalProduct[];
  selectedProduct: GlobalProduct | null;
  productMetrics: Record<string, ProductMetrics>;
  
  // UI State
  isLoading: boolean;
  searchQuery: string;
  filters: ProductFilters;
  viewMode: 'grid' | 'list' | 'table';
  sortBy: ProductSortField;
  sortOrder: 'asc' | 'desc';
  
  // Module-specific data
  moduleProducts: Record<ModuleId, string[]>; // Product IDs accessible by each module
  moduleInventory: Record<ModuleId, Record<string, number>>; // Inventory counts per module
  
  // Actions
  fetchProducts: () => Promise<void>;
  createProduct: (product: Omit<GlobalProduct, 'id'> & { metadata?: Partial<GlobalProduct['metadata']> }) => Promise<GlobalProduct>;
  updateProduct: (id: string, updates: Partial<GlobalProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  duplicateProduct: (id: string) => Promise<GlobalProduct>;
  
  // Inventory Management
  updateInventory: (productId: string, quantity: number, operation: 'add' | 'subtract' | 'set') => Promise<void>;
  reserveInventory: (productId: string, quantity: number, moduleId: ModuleId) => Promise<void>;
  releaseInventory: (productId: string, quantity: number, moduleId: ModuleId) => Promise<void>;
  
  // Module Integration
  getProductsForModule: (moduleId: ModuleId) => GlobalProduct[];
  canModuleAccessProduct: (moduleId: ModuleId, productId: string) => boolean;
  updateProductModuleAccess: (productId: string, modules: ModuleId[]) => Promise<void>;
  
  // UI Actions
  setSelectedProduct: (product: GlobalProduct | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  setViewMode: (mode: 'grid' | 'list' | 'table') => void;
  setSorting: (field: ProductSortField, order: 'asc' | 'desc') => void;
  
  // Bulk Operations
  bulkUpdate: (productIds: string[], updates: Partial<GlobalProduct>) => Promise<void>;
  bulkDelete: (productIds: string[]) => Promise<void>;
  exportProducts: (productIds?: string[]) => Promise<Blob>;
  importProducts: (file: File) => Promise<{ imported: number; errors: string[] }>;
}

export interface ProductFilters {
  category?: ProductCategory[];
  status?: ProductStatus[];
  visibility?: ProductVisibility[];
  priceRange?: [number, number];
  inventoryRange?: [number, number];
  tags?: string[];
  modules?: ModuleId[];
  createdBy?: string[];
}

export type ProductSortField = 
  | 'name'
  | 'createdAt'
  | 'updatedAt'
  | 'price'
  | 'inventory'
  | 'status'
  | 'category';

// Mock data for development
const mockProducts: GlobalProduct[] = [
  {
    id: 'prod_001',
    name: 'Premium Analytics Dashboard',
    description: 'Advanced analytics dashboard with real-time insights and custom reporting',
    category: 'digital',
    status: 'active',
    price: 299.99,
    currency: 'USD',
    sku: 'DIG-001',
    inventory: {
      total: 999999,
      available: 999999,
      reserved: 0,
      lowStockThreshold: 100
    },
    metadata: {
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-03-10T15:30:00Z',
      createdBy: 'admin',
      tags: ['analytics', 'dashboard', 'premium'],
      attributes: {
        features: ['real-time', 'custom-reports', 'api-access'],
        license: 'subscription'
      }
    },
    visibility: 'public',
    modules: ['crm', 'analytics', 'marketing'],
    permissions: {
      canView: ['crm', 'analytics', 'marketing'],
      canEdit: ['crm', 'analytics'],
      canDelete: ['crm'],
      canManageInventory: ['erp'],
      canManagePricing: ['finance']
    }
  },
  {
    id: 'prod_002',
    name: 'Enterprise CRM Suite',
    description: 'Complete customer relationship management solution for enterprise teams',
    category: 'subscription',
    status: 'active',
    price: 999.00,
    currency: 'USD',
    sku: 'SUB-002',
    inventory: {
      total: 999999,
      available: 999999,
      reserved: 0,
      lowStockThreshold: 50
    },
    metadata: {
      createdAt: '2024-02-01T09:00:00Z',
      updatedAt: '2024-03-15T14:20:00Z',
      createdBy: 'admin',
      tags: ['crm', 'enterprise', 'subscription'],
      attributes: {
        tier: 'enterprise',
        maxUsers: 1000,
        supportLevel: 'premium'
      }
    },
    visibility: 'public',
    modules: ['crm', 'sales', 'analytics'],
    permissions: {
      canView: ['crm', 'sales', 'analytics'],
      canEdit: ['crm', 'sales'],
      canDelete: ['crm'],
      canManageInventory: ['erp'],
      canManagePricing: ['finance']
    }
  },
  {
    id: 'prod_003',
    name: 'Marketing Automation Pro',
    description: 'Advanced marketing automation with AI-powered campaign optimization',
    category: 'service',
    status: 'active',
    price: 499.99,
    currency: 'USD',
    sku: 'SVC-003',
    inventory: {
      total: 100,
      available: 87,
      reserved: 13,
      lowStockThreshold: 20
    },
    metadata: {
      createdAt: '2024-01-20T11:00:00Z',
      updatedAt: '2024-03-12T16:45:00Z',
      createdBy: 'marketing_team',
      tags: ['marketing', 'automation', 'ai'],
      attributes: {
        serviceType: 'saas',
        billingCycle: 'monthly'
      }
    },
    visibility: 'public',
    modules: ['marketing', 'automation', 'analytics'],
    permissions: {
      canView: ['marketing', 'automation', 'analytics'],
      canEdit: ['marketing', 'automation'],
      canDelete: ['marketing'],
      canManageInventory: ['erp'],
      canManagePricing: ['finance']
    }
  }
];

// Create the store
export const useGlobalProductStore = create<GlobalProductState>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    products: mockProducts,
    selectedProduct: null,
    productMetrics: {},
    isLoading: false,
    searchQuery: '',
    filters: {},
    viewMode: 'grid',
    sortBy: 'name',
    sortOrder: 'asc',
    moduleProducts: {
      crm: ['prod_001', 'prod_002'],
      erp: ['prod_001', 'prod_002', 'prod_003'],
      marketing: ['prod_001', 'prod_003'],
      sales: ['prod_002'],
      finance: ['prod_001', 'prod_002', 'prod_003'],
      growth: ['prod_001'],
      analytics: ['prod_001', 'prod_002', 'prod_003'],
      automation: ['prod_003'],
      settings: []
    },
    moduleInventory: {},

    // Actions
    fetchProducts: async () => {
      set({ isLoading: true });
      try {
        // In a real app, this would be an API call
        // const { data } = await apiClient.get('/api/products');
        // set({ products: data });
        
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ isLoading: false });
      } catch (error) {
        console.error('Failed to fetch products:', error);
        set({ isLoading: false });
      }
    },

    createProduct: async (productData) => {
      const newProduct: GlobalProduct = {
        ...productData,
        id: `prod_${Date.now()}`,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'current_user',
          tags: productData.metadata?.tags || [],
          attributes: productData.metadata?.attributes || {},
          variants: productData.metadata?.variants || []
        }
      };

      set((state) => ({
        products: [...state.products, newProduct]
      }));

      return newProduct;
    },

    updateProduct: async (id, updates) => {
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id
            ? {
                ...product,
                ...updates,
                metadata: {
                  ...product.metadata,
                  ...updates.metadata,
                  updatedAt: new Date().toISOString()
                }
              }
            : product
        )
      }));
    },

    deleteProduct: async (id) => {
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct
      }));
    },

    duplicateProduct: async (id) => {
      const original = get().products.find(p => p.id === id);
      if (!original) throw new Error('Product not found');

      const duplicated: GlobalProduct = {
        ...original,
        id: `prod_${Date.now()}`,
        name: `${original.name} (Copy)`,
        sku: `${original.sku}-COPY`,
        metadata: {
          ...original.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'current_user'
        }
      };

      set((state) => ({
        products: [...state.products, duplicated]
      }));

      return duplicated;
    },

    // Inventory Management
    updateInventory: async (productId, quantity, operation) => {
      set((state) => ({
        products: state.products.map((product) => {
          if (product.id !== productId) return product;

          let newAvailable = product.inventory.available;
          let newReserved = product.inventory.reserved;

          switch (operation) {
            case 'add':
              newAvailable += quantity;
              break;
            case 'subtract':
              newAvailable = Math.max(0, newAvailable - quantity);
              break;
            case 'set':
              newAvailable = quantity;
              break;
          }

          return {
            ...product,
            inventory: {
              ...product.inventory,
              available: newAvailable,
              reserved: newReserved,
              total: newAvailable + newReserved
            }
          };
        })
      }));
    },

    reserveInventory: async (productId, quantity, moduleId) => {
      set((state) => {
        const moduleInventory = { ...state.moduleInventory };
        if (!moduleInventory[moduleId]) {
          moduleInventory[moduleId] = {};
        }
        moduleInventory[moduleId][productId] = (moduleInventory[moduleId][productId] || 0) + quantity;

        return {
          moduleInventory,
          products: state.products.map((product) => {
            if (product.id !== productId) return product;

            return {
              ...product,
              inventory: {
                ...product.inventory,
                available: Math.max(0, product.inventory.available - quantity),
                reserved: product.inventory.reserved + quantity
              }
            };
          })
        };
      });
    },

    releaseInventory: async (productId, quantity, moduleId) => {
      set((state) => {
        const moduleInventory = { ...state.moduleInventory };
        if (moduleInventory[moduleId] && moduleInventory[moduleId][productId]) {
          moduleInventory[moduleId][productId] = Math.max(
            0,
            moduleInventory[moduleId][productId] - quantity
          );
        }

        return {
          moduleInventory,
          products: state.products.map((product) => {
            if (product.id !== productId) return product;

            return {
              ...product,
              inventory: {
                ...product.inventory,
                available: product.inventory.available + quantity,
                reserved: Math.max(0, product.inventory.reserved - quantity)
              }
            };
          })
        };
      });
    },

    // Module Integration
    getProductsForModule: (moduleId) => {
      const state = get();
      const accessibleProductIds = state.moduleProducts[moduleId] || [];
      return state.products.filter(product => 
        accessibleProductIds.includes(product.id) || 
        product.modules.includes(moduleId)
      );
    },

    canModuleAccessProduct: (moduleId, productId) => {
      const state = get();
      const product = state.products.find(p => p.id === productId);
      if (!product) return false;
      
      return product.modules.includes(moduleId) || 
             state.moduleProducts[moduleId]?.includes(productId) ||
             product.visibility === 'public';
    },

    updateProductModuleAccess: async (productId, modules) => {
      set((state) => ({
        products: state.products.map((product) =>
          product.id === productId
            ? { ...product, modules }
            : product
        )
      }));
    },

    // UI Actions
    setSelectedProduct: (product) => set({ selectedProduct: product }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
    setViewMode: (mode) => set({ viewMode: mode }),
    setSorting: (field, order) => set({ sortBy: field, sortOrder: order }),

    // Bulk Operations
    bulkUpdate: async (productIds, updates) => {
      set((state) => ({
        products: state.products.map((product) =>
          productIds.includes(product.id)
            ? {
                ...product,
                ...updates,
                metadata: {
                  ...product.metadata,
                  ...updates.metadata,
                  updatedAt: new Date().toISOString()
                }
              }
            : product
        )
      }));
    },

    bulkDelete: async (productIds) => {
      set((state) => ({
        products: state.products.filter((product) => !productIds.includes(product.id)),
        selectedProduct: state.selectedProduct && productIds.includes(state.selectedProduct.id) 
          ? null 
          : state.selectedProduct
      }));
    },

    exportProducts: async (productIds) => {
      const state = get();
      const productsToExport = productIds 
        ? state.products.filter(p => productIds.includes(p.id))
        : state.products;
      
      const csv = [
        ['ID', 'Name', 'SKU', 'Category', 'Status', 'Price', 'Inventory', 'Modules'],
        ...productsToExport.map(p => [
          p.id,
          p.name,
          p.sku,
          p.category,
          p.status,
          p.price,
          p.inventory.available,
          p.modules.join(';')
        ])
      ].map(row => row.join(',')).join('\n');

      return new Blob([csv], { type: 'text/csv' });
    },

    importProducts: async (file) => {
      // In a real app, this would parse the CSV and create products
      return { imported: 0, errors: ['Import not implemented yet'] };
    }
  }))
);

// Selectors for common use cases
export const useProductsForModule = (moduleId: ModuleId) => {
  return useGlobalProductStore(state => state.getProductsForModule(moduleId));
};

export const useCanModuleAccessProduct = (moduleId: ModuleId, productId: string) => {
  return useGlobalProductStore(state => state.canModuleAccessProduct(moduleId, productId));
};

export const useFilteredProducts = () => {
  return useGlobalProductStore(state => {
    let filtered = [...state.products];

    // Apply search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.metadata.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (state.filters.category?.length) {
      filtered = filtered.filter(product =>
        state.filters.category!.includes(product.category)
      );
    }

    // Apply status filter
    if (state.filters.status?.length) {
      filtered = filtered.filter(product =>
        state.filters.status!.includes(product.status)
      );
    }

    // Apply price range filter
    if (state.filters.priceRange) {
      const [min, max] = state.filters.priceRange;
      filtered = filtered.filter(product =>
        product.price >= min && product.price <= max
      );
    }

    // Apply inventory filter
    if (state.filters.inventoryRange) {
      const [min, max] = state.filters.inventoryRange;
      filtered = filtered.filter(product =>
        product.inventory.available >= min && product.inventory.available <= max
      );
    }

    // Apply tags filter
    if (state.filters.tags?.length) {
      filtered = filtered.filter(product =>
        state.filters.tags!.some(tag => product.metadata.tags.includes(tag))
      );
    }

    // Apply module filter
    if (state.filters.modules?.length) {
      filtered = filtered.filter(product =>
        state.filters.modules!.some(module => product.modules.includes(module))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[state.sortBy];
      const bValue = b[state.sortBy];
      
      if (aValue < bValue) return state.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return state.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  });
};
