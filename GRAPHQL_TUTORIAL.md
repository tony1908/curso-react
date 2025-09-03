# GraphQL Integration Tutorial - Airbnb Clone React App

This tutorial demonstrates how to integrate GraphQL with Apollo Client into a React application, specifically implementing property queries and mutations for an Airbnb-like platform.

## Table of Contents

1. [Project Overview](#project-overview)
2. [GraphQL Backend Schema](#graphql-backend-schema)
3. [Dependencies Installation](#dependencies-installation)
4. [Apollo Client Setup](#apollo-client-setup)
5. [GraphQL Queries and Mutations](#graphql-queries-and-mutations)
6. [Updating Property Details Page](#updating-property-details-page)
7. [Creating Add Property Form](#creating-add-property-form)
8. [Routing Configuration](#routing-configuration)
9. [Navigation Integration](#navigation-integration)
10. [Testing the Implementation](#testing-the-implementation)

## Project Overview

This implementation integrates GraphQL functionality into a React Airbnb clone application, replacing REST API calls with GraphQL queries and mutations. The key features include:

- Fetching property details by ID using GraphQL queries
- Adding new properties using GraphQL mutations
- Form validation with React Hook Form
- Proper loading and error handling
- TypeScript integration

## GraphQL Backend Schema

The backend GraphQL schema (from the Java Spring Boot example) includes:

```graphql
type Property {
  id: Int!
  image: String!
  title: String!
  type: String!
  location: String!
  details: String!
  host: String!
  price: Int!
  rating: Int!
}

input PropertyInput {
  image: String!
  title: String!
  type: String!
  location: String!
  details: String!
  host: String!
  price: Int!
  rating: Int!
}

type Query {
  hello: String
  greet(name: String!): String
  properties: [Property!]!
  property(id: Int!): Property
}

type Mutation {
  addProperty(input: PropertyInput!): Property!
}
```

## Dependencies Installation

First, install the required dependencies:

```bash
npm install @apollo/client graphql react-hook-form
```

### Dependencies Breakdown:

- **@apollo/client**: Complete GraphQL client with caching, error handling, and React integration
- **graphql**: JavaScript implementation of GraphQL for query parsing and execution
- **react-hook-form**: Performant form library with built-in validation

## Apollo Client Setup

### 1. Create GraphQL Client Configuration

Create `src/shared/graphql/client.ts`:

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql', // Your GraphQL endpoint
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
});
```

### 2. Update Main Application Entry Point

Update `src/app/main.tsx` to provide Apollo Client:

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react'
import App from './App.tsx'
import { apolloClient } from '../shared/graphql/client.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
```

## GraphQL Queries and Mutations

### 1. Create Query and Mutation Definitions

Create `src/shared/graphql/queries.ts`:

```typescript
import { gql } from '@apollo/client';

export const GET_PROPERTIES = gql`
  query GetProperties {
    properties {
      id
      image
      title
      type
      location
      details
      host
      price
      rating
    }
  }
`;

export const GET_PROPERTY = gql`
  query GetProperty($id: Int!) {
    property(id: $id) {
      id
      image
      title
      type
      location
      details
      host
      price
      rating
    }
  }
`;

export const ADD_PROPERTY = gql`
  mutation AddProperty($input: PropertyInput!) {
    addProperty(input: $input) {
      id
      image
      title
      type
      location
      details
      host
      price
      rating
    }
  }
`;
```

### 2. Create TypeScript Type Definitions

Create `src/shared/graphql/types.ts`:

```typescript
export interface PropertyInput {
  image: string;
  title: string;
  type: string;
  location: string;
  details: string;
  host: string;
  price: number;
  rating: number;
}

export interface GetPropertyVariables {
  id: number;
}

export interface AddPropertyVariables {
  input: PropertyInput;
}
```

## Updating Property Details Page

Transform the existing `PropertyDetailsPage.tsx` to use GraphQL:

### Before (Using Store):
```typescript
const properties = usePropertiesStore((state) => state.properties)
const propertyId = parseInt(id || '0', 10)
const property = properties.find((p: Property) => p.id === propertyId)
```

### After (Using GraphQL):
```typescript
import { useQuery } from '@apollo/client'
import { GET_PROPERTY } from '../shared/graphql/queries'
import { type GetPropertyVariables } from '../shared/graphql/types'

const propertyId = parseInt(id || '0', 10)
const { data, loading, error } = useQuery<{ property: Property }, GetPropertyVariables>(GET_PROPERTY, {
    variables: { id: propertyId },
    skip: !propertyId
})

const property = data?.property
```

### Add Loading and Error Handling:

```typescript
if (loading) {
    return (
        <div className="property-details-container">
            <div className="property-not-found">
                <h2>Loading...</h2>
                <p>Loading property details...</p>
            </div>
        </div>
    )
}

if (error) {
    return (
        <div className="property-details-container">
            <div className="property-not-found">
                <h2>Error Loading Property</h2>
                <p>An error occurred while loading the property: {error.message}</p>
                <Link to="/" className="back-home-link">
                    ← Back to Properties
                </Link>
            </div>
        </div>
    )
}
```

## Creating Add Property Form

### 1. Create AddPropertyPage Component

Create `src/pages/AddPropertyPage.tsx`:

```typescript
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { ADD_PROPERTY } from '../shared/graphql/queries';
import { type AddPropertyVariables, type PropertyInput } from '../shared/graphql/types';
import { type Property } from '../features/properties/model/types';
import './AddPropertyPage.css';

function AddPropertyPage() {
    const navigate = useNavigate();
    const [addProperty, { loading, error }] = useMutation<{ addProperty: Property }, AddPropertyVariables>(ADD_PROPERTY);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<PropertyInput>();

    const onSubmit = async (data: PropertyInput) => {
        try {
            const result = await addProperty({
                variables: { input: data }
            });
            
            if (result.data) {
                console.log('Property added successfully:', result.data.addProperty);
                reset();
                navigate(`/property/${result.data.addProperty.id}`);
            }
        } catch (err) {
            console.error('Error adding property:', err);
        }
    };

    // Form JSX with validation...
}
```

### 2. Form Fields with Validation

Key form fields with React Hook Form validation:

```typescript
// Title field with validation
<input
    id="title"
    type="text"
    {...register('title', {
        required: 'Property title is required',
        minLength: { value: 1, message: 'Title must be at least 1 character' },
        maxLength: { value: 100, message: 'Title must be less than 100 characters' }
    })}
    className={errors.title ? 'error' : ''}
/>
{errors.title && <span className="error-message">{errors.title.message}</span>}

// Price field with number validation
<input
    id="price"
    type="number"
    min="1"
    {...register('price', {
        required: 'Price is required',
        valueAsNumber: true,
        min: { value: 1, message: 'Price must be at least $1' }
    })}
    className={errors.price ? 'error' : ''}
/>

// Select field for property type
<select
    id="type"
    {...register('type', { required: 'Property type is required' })}
    className={errors.type ? 'error' : ''}
>
    <option value="">Select a type</option>
    <option value="Apartment">Apartment</option>
    <option value="House">House</option>
    <option value="Villa">Villa</option>
    <option value="Condo">Condo</option>
    <option value="Studio">Studio</option>
</select>
```

### 3. Create Styling

Create `src/pages/AddPropertyPage.css` with comprehensive styling for forms, buttons, and responsive design.

## Routing Configuration

Update `src/app/App.tsx` to include the new route:

```typescript
// Add lazy import
const AddPropertyPage = lazy(() => import('../pages/AddPropertyPage'))

// Add route in Routes component
<Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/property/:id" element={<PropertyDetailsPage />} />
    <Route path="/add-property" element={<AddPropertyPage />} />
    {/* Other routes... */}
</Routes>
```

## Navigation Integration

Add navigation link to the SearchBar component:

### Update SearchBar Component

```typescript
// Add import
import { Link } from 'react-router-dom';

// Add link in JSX
<Link to="/add-property" className="add-property-link">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    Add Property
</Link>
```

### Add CSS Styling

```css
.add-property-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: #ff5a5f;
    color: white;
    text-decoration: none;
    border-radius: 28px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
}

.add-property-link:hover {
    background-color: #e04e53;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(255, 90, 95, 0.3);
}
```

## Testing the Implementation

### 1. Start Your Backend Server

Ensure your GraphQL backend server is running on `http://localhost:8080/graphql`.

### 2. Test Property Details Page

1. Navigate to `/property/1` or `/property/2`
2. Verify that the property data loads via GraphQL
3. Check loading states and error handling

### 3. Test Add Property Form

1. Navigate to `/add-property`
2. Fill out the form with validation
3. Submit and verify redirection to the new property page
4. Check that the property was created successfully

### 4. GraphQL Developer Tools

Use browser developer tools to inspect GraphQL network requests:

- Check Network tab for GraphQL queries
- Verify query variables and responses
- Use Apollo DevTools browser extension for advanced debugging

## Key Benefits Achieved

### 1. **Type Safety**
- Full TypeScript integration with GraphQL schema
- Compile-time validation of queries and mutations

### 2. **Performance**
- Efficient data fetching with Apollo Client caching
- Automatic loading and error states

### 3. **Developer Experience**
- Clear separation of concerns
- Reusable GraphQL operations
- Comprehensive error handling

### 4. **User Experience**
- Smooth loading states
- Form validation with instant feedback
- Responsive design across devices

## Troubleshooting Common Issues

### 1. **CORS Issues**
If you encounter CORS errors, ensure your backend server allows requests from your React app's origin.

### 2. **GraphQL Endpoint Not Found**
Verify the GraphQL endpoint URL in `client.ts` matches your backend server configuration.

### 3. **Type Mismatches**
Ensure your TypeScript types match the GraphQL schema exactly, particularly for number vs string types.

### 4. **Form Validation Errors**
Check that form field names match the PropertyInput interface exactly.

## Next Steps

1. **Add Optimistic Updates**: Implement optimistic UI updates for better user experience
2. **Implement Caching Strategies**: Fine-tune Apollo Client caching for better performance
3. **Add Real-time Updates**: Implement GraphQL subscriptions for live property updates
4. **Error Boundary**: Add React Error Boundaries for better error handling
5. **Testing**: Implement unit and integration tests for GraphQL operations

This implementation provides a solid foundation for a GraphQL-powered React application with proper type safety, error handling, and user experience considerations.