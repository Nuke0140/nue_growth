# Global Product System Documentation

## Overview

The Global Product System is a comprehensive, module-agnostic product management solution designed to work seamlessly across all modules in the NueEra Growth OS. It provides a unified way to manage products, inventory, pricing, and permissions across the entire application.

## Architecture

### Core Components

1. **Global Product Store** (`/src/store/global-product-store.ts`)
   - Central state management for all product data
   - Module-specific access control
   - Inventory management across modules
   - Bulk operations and filtering

2. **Global Product Service** (`/src/services/global-product-service.ts`)
   - API layer for all product operations
   - Business logic and data transformation
   - Error handling and response formatting

3. **Product Components** (`/src/components/global-product/`)
   - Reusable UI components for product management
   - Module-agnostic product cards and managers
   - Consistent design system across modules

## Key Features

### 🔄 Module Integration
- Each module can access products based on permissions
- Module-specific inventory tracking
- Cross-module product visibility control

### 📦 Inventory Management
- Real-time inventory tracking
- Module-specific inventory reservation
- Low stock alerts and notifications
- Bulk inventory operations

### 💰 Pricing Control
- Module-specific pricing permissions
- Price history tracking
- Bulk price updates
- Currency support

### 🔐 Permission System
- Granular access control per module
- View, edit, delete permissions
- Inventory and pricing management permissions
- Role-based access control

### 📊 Analytics & Metrics
- Product performance metrics
- Module-specific analytics
- Inventory turnover tracking
- Revenue analysis

## Data Model

### GlobalProduct Interface

```typescript
interface GlobalProduct {
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
  modules: ModuleId[];
  permissions: ProductPermissions;
}
```

### Module Integration

Each module can integrate with the global product system by:

1. **Defining Module Access**
   ```typescript
   const moduleProducts = {
     erp: ['prod_001', 'prod_002'], // Products accessible by ERP
     crm: ['prod_001', 'prod_003'], // Products accessible by CRM
     marketing: ['prod_002', 'prod_003'] // Products accessible by Marketing
   };
   ```

2. **Using Product Components**
   ```typescript
   import { ProductManager } from '@/components/global-product/product-manager';
   
   <ProductManager
     moduleId="erp"
     title="ERP Product Management"
     showCreateButton={true}
     onProductSelect={handleProductSelect}
   />
   ```

3. **Accessing Store Data**
   ```typescript
   import { useGlobalProductStore, useProductsForModule } from '@/store/global-product-store';
   
   // Get products for current module
   const products = useProductsForModule('erp');
   
   // Access store methods
   const { updateInventory, reserveInventory } = useGlobalProductStore();
   ```

## Module-Specific Integrations

### ERP Module
- **Focus**: Inventory management, stock control, procurement
- **Features**: 
  - Real-time inventory tracking
  - Stock reservation for orders
  - Low stock alerts
  - Bulk inventory operations
- **Example**: See `/src/modules/erp/components/product-integration.tsx`

### CRM Module
- **Focus**: Sales opportunities, product recommendations, deal management
- **Features**:
  - Opportunity builder with products
  - Product recommendations based on customer data
  - Deal-specific pricing
  - Cross-sell and up-sell suggestions
- **Example**: See `/src/modules/crm-sales/components/product-integration.tsx`

### Marketing Module
- **Focus**: Campaign management, product promotion, analytics
- **Features**:
  - Campaign product selection
  - Marketing analytics
  - Promotion management
  - Performance tracking

### Finance Module
- **Focus**: Pricing control, revenue tracking, cost analysis
- **Features**:
  - Price management
  - Revenue analytics
  - Cost tracking
  - Financial reporting

## API Endpoints

### Product Management
- `GET /api/products` - List products with filtering
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/duplicate` - Duplicate product

### Inventory Management
- `PATCH /api/products/:id/inventory` - Update inventory
- `PATCH /api/products/inventory/bulk` - Bulk inventory update
- `GET /api/products/:id/inventory/history` - Inventory history

### Module Integration
- `GET /api/modules/:moduleId/products` - Get products for module
- `PATCH /api/products/:id/modules` - Update module access
- `GET /api/modules/:moduleId/products/:id/access` - Check access permissions

### Analytics
- `GET /api/products/:id/metrics` - Product metrics
- `POST /api/products/metrics/bulk` - Bulk metrics
- `GET /api/products/export` - Export products

## Usage Examples

### Basic Product Management

```typescript
// In any module component
import { ProductManager } from '@/components/global-product/product-manager';

function MyModuleProducts() {
  return (
    <ProductManager
      moduleId="my-module"
      title="Product Catalog"
      showCreateButton={true}
      showFilters={true}
      onProductSelect={(product) => {
        console.log('Selected product:', product);
      }}
    />
  );
}
```

### Custom Product Integration

```typescript
import { useGlobalProductStore } from '@/store/global-product-store';
import { ProductCard } from '@/components/global-product/product-card';

function CustomProductList({ moduleId }: { moduleId: string }) {
  const { getProductsForModule, updateInventory } = useGlobalProductStore();
  const products = getProductsForModule(moduleId);

  const handleInventoryUpdate = async (productId: string, quantity: number) => {
    await updateInventory(productId, quantity, 'add');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          currentModule={moduleId}
          onSelect={handleProductSelect}
          onEdit={handleProductEdit}
        />
      ))}
    </div>
  );
}
```

### Service Integration

```typescript
import { globalProductService } from '@/services/global-product-service';

async function createNewProduct() {
  try {
    const newProduct = await globalProductService.createProduct({
      name: 'New Product',
      description: 'Product description',
      category: 'physical',
      status: 'active',
      price: 99.99,
      currency: 'USD',
      sku: 'NEW-001',
      inventory: {
        total: 100,
        lowStockThreshold: 10
      },
      visibility: 'public',
      modules: ['erp', 'crm'],
      metadata: {
        tags: ['new', 'featured'],
        attributes: { color: 'blue' }
      }
    });
    
    console.log('Product created:', newProduct);
  } catch (error) {
    console.error('Failed to create product:', error);
  }
}
```

## Permissions System

The global product system uses a comprehensive permission system:

### Permission Types
- **canView**: Can view product details
- **canEdit**: Can edit product information
- **canDelete**: Can delete products
- **canManageInventory**: Can update inventory levels
- **canManagePricing**: Can update pricing

### Module-Based Permissions
```typescript
const permissions: ProductPermissions = {
  canView: ['erp', 'crm', 'finance'],
  canEdit: ['erp', 'crm'],
  canDelete: ['erp'],
  canManageInventory: ['erp'],
  canManagePricing: ['finance']
};
```

## Best Practices

### 1. Module Integration
- Always specify the correct `moduleId` when using components
- Check module permissions before performing actions
- Use the provided hooks for accessing module-specific data

### 2. Performance Optimization
- Use the `useProductsForModule` hook for filtered data
- Implement proper loading states
- Cache product data when possible

### 3. Error Handling
- Always wrap API calls in try-catch blocks
- Provide user-friendly error messages
- Implement proper loading and error states

### 4. UI Consistency
- Use the provided ProductCard component for consistency
- Follow the established design patterns
- Maintain responsive design principles

## Migration Guide

### From Module-Specific Products
1. Export existing product data to CSV
2. Use the import functionality to migrate data
3. Update module-specific components to use global components
4. Configure module permissions and access
5. Test all functionality thoroughly

### Data Mapping
- Map existing product fields to GlobalProduct interface
- Configure module access based on current usage
- Set up appropriate permissions for each module
- Migrate inventory data and history

## Troubleshooting

### Common Issues

1. **Products not showing in module**
   - Check module permissions
   - Verify module access configuration
   - Ensure products are assigned to correct modules

2. **Inventory not updating**
   - Check inventory permissions
   - Verify API connectivity
   - Check for concurrent updates

3. **Performance issues**
   - Implement proper filtering
   - Use pagination for large datasets
   - Optimize component re-renders

### Debug Tools
- Use browser dev tools to inspect store state
- Check network requests for API issues
- Verify permission configurations
- Monitor console for error messages

## Future Enhancements

### Planned Features
- Real-time inventory synchronization
- Advanced product recommendations
- Multi-warehouse support
- Advanced pricing rules
- Product lifecycle management
- Integration with external systems

### API v2
- GraphQL support
- Real-time subscriptions
- Advanced filtering and search
- Bulk operation improvements
- Enhanced analytics endpoints

## Support

For questions or issues related to the Global Product System:
1. Check this documentation first
2. Review the component examples
3. Check the API documentation
4. Contact the development team

---

*Last updated: March 2026*
