# Module Architecture Guide

This document outlines the architecture and patterns used in the Users module, serving as a blueprint for creating consistent, maintainable CRUD modules throughout the application.

## Overview

The Users module demonstrates a complete CRUD implementation with advanced features like filtering, sorting, pagination, file uploads, and role-based access control. This architecture ensures scalability, type safety, and excellent developer/user experience.

## File Structure

```
app/(pages)/(private)/users/
├── page.tsx                    # Main listing page with filters
├── UsersTable.tsx             # Data table with sorting/pagination
├── [userId]/
│   ├── page.tsx               # User details view
│   └── update-user/page.tsx   # User update form
└── create-user/page.tsx       # User creation form
```

## Core Components

### 1. Main Listing Page (`page.tsx`)

**Purpose**: Entry point for the module with filtering and data display.

**Key Features**:
- Clean header with title, description, and action buttons
- Responsive filter section with multiple filter types
- Integration with data table component

**Code Structure**:
```tsx
// Header with navigation
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
      User Management
    </h1>
    <p className="text-muted-foreground">Manage Users and their Access</p>
  </div>
  <Button asChild>
    <Link href="/users/create-user">Add New User</Link>
  </Button>
</div>

// Filters section
<div className="flex flex-col gap-4 mb-6">
  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
    <div className="flex flex-col sm:flex-row gap-4 flex-1">
      <SearchFilter paramName="searchTerm" placeholder="Search users by name" />
      <StatusFilter filters={verificationFilters} paramName="isVerified" />
      <StatusFilter filters={activeStatusFilters} paramName="isActive" />
      <RoleFilter paramName="role" />
    </div>
    <ClearAllFiltersButton />
  </div>
</div>

// Data table
<UsersTable />
```

### 2. Data Table (`UsersTable.tsx`)

**Purpose**: Displays data with sorting, pagination, and actions.

**Key Features**:
- URL-based state management for all interactions
- Sortable columns with visual indicators
- Skeleton loading states
- Pagination with customizable limits
- Status indicators and action buttons

**URL State Management**:
```tsx
// Parse URL parameters
const page = parseInt(searchParams.get('page') || '1');
const limit = parseInt(searchParams.get('limit') || '10');
const searchTerm = searchParams.get('searchTerm') || '';
const isVerified = searchParams.get('isVerified') || '';
const isActive = searchParams.get('isActive') || '';
const role = searchParams.get('role') || '';
```

**Sorting Implementation**:
```tsx
const handleSort = (column: string) => {
  if (sortBy === column) {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  } else {
    setSortBy(column);
    setSortOrder('asc');
  }
};

// Sortable header
<TableHead onClick={() => handleSort('name')}>
  <div className="flex items-center justify-between">
    <span>Name</span>
    <div className="flex flex-col">
      <ChevronUp className={`w-3 h-3 ${sortBy === 'name' && sortOrder === 'asc' ? 'text-foreground' : 'opacity-50'}`} />
      <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'name' && sortOrder === 'desc' ? 'text-foreground' : 'opacity-50'}`} />
    </div>
  </div>
</TableHead>
```

### 3. Detail View (`[userId]/page.tsx`)

**Purpose**: Display comprehensive information about a single entity.

**Key Features**:
- Breadcrumb navigation
- Information organized in cards
- Conditional rendering for optional data
- Action buttons for related operations

**Information Organization**:
```tsx
// Main details card
<Card>
  <CardContent className="space-y-6">
    {/* Profile image and basic info */}
    <div className="flex items-start gap-4">
      <Avatar>
        <ProfileImage image={user.detail?.image} />
      </Avatar>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic fields */}
      </div>
    </div>

    {/* Status fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Role, verification, active status */}
    </div>

    {/* Conditional sections */}
    {(user.detail?.address || user.detail?.city) && (
      <div className="space-y-4">
        <Separator />
        <div>
          <h3>Address Information</h3>
          {/* Address fields */}
        </div>
      </div>
    )}
  </CardContent>
</Card>

// Metadata card
<Card>
  <CardContent>
    {/* Timestamps, creator info */}
  </CardContent>
</Card>
```

### 4. Form Pages (Create/Update)

**Purpose**: Handle data creation and modification.

**Key Features**:
- React Hook Form with Zod validation
- Controlled components with proper state management
- File upload handling
- Loading states and error handling

**Form Setup**:
```tsx
const {
  register,
  handleSubmit,
  reset,
  control,
  formState: { errors, isDirty },
} = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    // Pre-populate from existing data
    name: user?.name || '',
    // ... other fields
  },
});

// Update form when data loads
React.useEffect(() => {
  if (user) {
    reset({
      name: user.name,
      // ... other fields
    });
  }
}, [user, reset]);
```

## Hooks Architecture

### Query Hooks
```tsx
export const useUsers = (filters: UserFilters = {}) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      // Build query parameters from filters
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      // ... other filters

      const response = await axiosPrivate.get<UserListResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user?${params.toString()}`
      );
      return response.data;
    },
  });
};
```

### Mutation Hooks
```tsx
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRequest }) => {
      const formData = new FormData();
      // Build FormData for multipart requests
      if (data.name) formData.append('name', data.name);
      if (data.file) formData.append('file', data.file);

      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
};
```

## Type System

### Interface Layers
```tsx
// Backend interface (raw API data)
export interface IUser {
  id: number;
  name: string;
  email: string;
  // ... other fields
}

// Frontend interface (processed data)
export interface User {
  id: string;
  name: string;
  email: string;
  // ... transformed fields
}

// Request/Response types
export interface CreateUserRequest {
  name: string;
  email: string;
  file?: File;
}

export interface UserListResponse {
  data: IUser[];
  meta: { count: number; page: number; limit: number };
  message: string;
  statusCode: number;
  success: boolean;
}
```

### Filter Types
```tsx
export interface UserFilters {
  searchTerm?: string;
  isVerified?: string;
  isActive?: string;
  role?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

## Validation

### Schema Structure
```tsx
// Reusable validators
const nameValidator = (fieldName: string) =>
  z.string()
    .min(2, `${fieldName} must be at least 2 characters`)
    .max(50, `${fieldName} must not exceed 50 characters`)
    .regex(/^[a-zA-Z\s'-]+$/, `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);

// Operation schemas
export const createUserSchema = z.object({
  name: nameValidator('Name'),
  email: emailValidator,
  phoneNumber: phoneValidator,
  role: z.enum(['admin', 'user']),
  password: passwordValidator,
});

export const updateUserSchema = z.object({
  name: nameValidator('Name').optional(),
  phoneNumber: phoneValidator.optional(),
  role: z.enum(['admin', 'user']).optional(),
  isActive: z.boolean().optional(),
});
```

## Key Patterns & Best Practices

### 1. URL-Centric State Management
- All filters, pagination, and sorting stored in URL parameters
- Enables browser back/forward navigation
- Shareable URLs with current state
- Server-side rendering friendly

### 2. Component Composition
- Small, focused components for reusability
- Consistent prop interfaces
- Separation of concerns (UI vs business logic)

### 3. Data Flow Architecture
- React Query for server state management
- React Hook Form for client-side form state
- Optimistic updates for better UX
- Proper error boundaries and loading states

### 4. Error Handling
- User-friendly error messages
- Retry mechanisms for failed operations
- Graceful degradation for missing data
- Type-safe error responses

### 5. Loading States
- Skeleton loaders for better perceived performance
- Progressive loading for large datasets
- Disabled states during form submission
- Loading indicators for async operations

### 6. Type Safety
- Full TypeScript coverage
- Zod schemas for runtime validation
- Consistent interface definitions
- Type-safe API interactions

## Implementation Checklist for New Modules

### File Structure Setup
- [ ] Create module folder in `app/(pages)/(private)/`
- [ ] Add main `page.tsx` with filters and table
- [ ] Create `[id]/page.tsx` for details view
- [ ] Add `create/page.tsx` for creation form
- [ ] Create `[id]/update/page.tsx` for edit form

### Type Definitions
- [ ] Define backend interface (`IEntity`)
- [ ] Create frontend interface (`Entity`)
- [ ] Add request/response types
- [ ] Define filter interfaces

### Hooks Implementation
- [ ] `useEntities` - List with filters/pagination
- [ ] `useEntity` - Single entity by ID
- [ ] `useCreateEntity` - Create new entity
- [ ] `useUpdateEntity` - Update existing entity
- [ ] `useDeleteEntity` - Delete entity

### Validation Schemas
- [ ] Create operation-specific Zod schemas
- [ ] Add reusable field validators
- [ ] Define proper error messages

### Components
- [ ] EntityTable with sorting/pagination
- [ ] Filter components (reuse existing ones)
- [ ] Form components with proper validation
- [ ] Loading states and error boundaries

### Testing Checklist
- [ ] CRUD operations work correctly
- [ ] Filtering and sorting function properly
- [ ] Pagination handles edge cases
- [ ] Form validation prevents invalid data
- [ ] Error states display appropriate messages
- [ ] Loading states provide good UX

## Reusable Components

### Filter Components
- `SearchFilter` - Text search across fields
- `StatusFilter` - Boolean/dropdown status filters
- `RoleFilter` - Role-based filtering
- `DateRangeFilter` - Date range selection
- `ClearAllFiltersButton` - Reset all filters

### Form Components
- `TextInput` - Text field with validation
- `Select` - Dropdown selection
- `FileUpload` - File upload with preview
- `Switch` - Boolean toggle
- `PhoneNumberInput` - Phone number formatting

### UI Components
- `PaginationTable` - Pagination controls
- `ScreenLoader` - Full-screen loading
- `ProfileImage` - Image display with fallbacks

## Performance Considerations

### Query Optimization
- Implement proper React Query caching
- Use appropriate staleTime and cacheTime
- Prefetch related data when possible
- Debounce search inputs

### Bundle Optimization
- Lazy load route components
- Code-split large forms
- Optimize image loading
- Minimize re-renders with memoization

### Database Optimization
- Implement proper indexing on filtered fields
- Use pagination limits appropriately
- Optimize complex queries
- Cache frequently accessed data

This architecture provides a solid foundation for building consistent, scalable CRUD modules with excellent developer and user experience.
