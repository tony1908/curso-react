# Module Federation with Vite - Complete Tutorial

This guide walks you through setting up Module Federation in a React + Vite application, transforming your monolithic app into a microfrontend shell that can host and coordinate multiple independent applications.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [What is Module Federation?](#what-is-module-federation)
3. [Setting up the Shell App](#setting-up-the-shell-app)
4. [Creating Your First Remote App](#creating-your-first-remote-app)
5. [Consuming Remotes in Shell](#consuming-remotes-in-shell)
6. [Advanced Configuration](#advanced-configuration)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 16+ installed
- Existing React + Vite project (like this Airbnb clone)
- Basic understanding of React and TypeScript

## What is Module Federation?

Module Federation allows you to:
- Split your application into independently deployable microfrontends
- Share dependencies between applications
- Load remote applications dynamically at runtime
- Enable different teams to work on separate parts of the same application

### Architecture Overview

```
Shell App (airbnb-shell)
├── Shared Dependencies (React, Router, etc.)
├── Core Layout & Navigation
├── Authentication Context
└── Remote Apps
    ├── Property Service (listings, search, details)
    ├── Chat Service (messaging functionality)
    └── User Service (profile, preferences)
```

## Setting up the Shell App

### Step 1: Install Module Federation Plugin

```bash
npm install @originjs/vite-plugin-federation --save-dev
```

### Step 2: Configure Vite for Module Federation

Update your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'airbnb-shell',
      remotes: {
        // Remote apps will be added here
        // propertyService: 'http://localhost:3001/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  server: {
    port: 5173
  }
})
```

### Step 3: Test the Shell Setup

```bash
# Test development server
npm run dev

# Test production build
npm run build
```

You should see federation assets generated in the `dist/assets/` folder with names like `__federation_shared_react-*.js`.

## Creating Your First Remote App

Let's create a Properties microfrontend as an example.

### Step 1: Create New Vite Project

```bash
# In a separate directory
npm create vite@latest property-service -- --template react-ts
cd property-service
npm install
```

### Step 2: Install Module Federation

```bash
npm install @originjs/vite-plugin-federation --save-dev
```

### Step 3: Configure the Remote App

Create/update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'propertyService',
      filename: 'remoteEntry.js',
      exposes: {
        './PropertyApp': './src/PropertyApp.tsx',
        './PropertyList': './src/components/PropertyList.tsx'
      },
      shared: ['react', 'react-dom']
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  server: {
    port: 3001
  }
})
```

### Step 4: Create Exposed Components

Create `src/PropertyApp.tsx`:

```typescript
import React from 'react'
import PropertyList from './components/PropertyList'

const PropertyApp: React.FC = () => {
  return (
    <div>
      <h2>Properties Microfrontend</h2>
      <PropertyList />
    </div>
  )
}

export default PropertyApp
```

Create `src/components/PropertyList.tsx`:

```typescript
import React, { useState, useEffect } from 'react'

interface Property {
  id: string
  title: string
  price: number
  location: string
}

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    // Mock data - replace with actual API call
    setProperties([
      { id: '1', title: 'Cozy Apartment', price: 120, location: 'Downtown' },
      { id: '2', title: 'Beach House', price: 250, location: 'Coast' }
    ])
  }, [])

  return (
    <div>
      <h3>Available Properties</h3>
      {properties.map(property => (
        <div key={property.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h4>{property.title}</h4>
          <p>Price: ${property.price}/night</p>
          <p>Location: {property.location}</p>
        </div>
      ))}
    </div>
  )
}

export default PropertyList
```

### Step 5: Build and Test Remote

```bash
# Build the remote app
npm run build

# Start development server
npm run dev
```

The remote should be available at `http://localhost:3001` with a `remoteEntry.js` file at `http://localhost:3001/assets/remoteEntry.js`.

## Consuming Remotes in Shell

### Step 1: Update Shell Configuration

In your shell app's `vite.config.ts`, add the remote:

```typescript
federation({
  name: 'airbnb-shell',
  remotes: {
    propertyService: 'http://localhost:3001/assets/remoteEntry.js'
  },
  shared: ['react', 'react-dom', 'react-router-dom']
})
```

### Step 2: Create Remote Component Wrapper

Create `src/components/RemotePropertyApp.tsx`:

```typescript
import React, { Suspense } from 'react'

// @ts-ignore
const PropertyApp = React.lazy(() => import('propertyService/PropertyApp'))

const RemotePropertyApp: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading Property Service...</div>}>
      <PropertyApp />
    </Suspense>
  )
}

export default RemotePropertyApp
```

### Step 3: Add Route for Remote App

Update your `src/app/App.tsx`:

```typescript
import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoadingSpinner from '../shared/ui/LoadingSpinner'
import RemotePropertyApp from '../components/RemotePropertyApp'

// ... other imports

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner/>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties-remote" element={<RemotePropertyApp />} />
            {/* ... other routes */}
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  )
}
```

### Step 4: Add TypeScript Definitions

Create `src/types/federation.d.ts`:

```typescript
declare module 'propertyService/PropertyApp' {
  const PropertyApp: React.ComponentType
  export default PropertyApp
}

declare module 'propertyService/PropertyList' {
  const PropertyList: React.ComponentType
  export default PropertyList
}
```

### Step 5: Test Integration

1. Start the remote app: `cd property-service && npm run dev`
2. Start the shell app: `npm run dev`
3. Navigate to `http://localhost:5173/properties-remote`

## Advanced Configuration

### Shared Dependencies with Versions

```typescript
federation({
  name: 'airbnb-shell',
  shared: {
    'react': {
      singleton: true,
      requiredVersion: '^18.0.0'
    },
    'react-dom': {
      singleton: true,
      requiredVersion: '^18.0.0'
    }
  }
})
```

### Environment-Specific Remote URLs

```typescript
const remotes = {
  propertyService: process.env.NODE_ENV === 'production' 
    ? 'https://property-service.example.com/assets/remoteEntry.js'
    : 'http://localhost:3001/assets/remoteEntry.js'
}

federation({
  name: 'airbnb-shell',
  remotes,
  shared: ['react', 'react-dom', 'react-router-dom']
})
```

### Exposing Shell Utilities

Your shell can also expose utilities to remotes:

```typescript
// In shell vite.config.ts
federation({
  name: 'airbnb-shell',
  exposes: {
    './AuthContext': './src/shared/hooks/AuthContext.tsx',
    './ApiClient': './src/shared/api/client.ts'
  },
  remotes: { /* ... */ },
  shared: ['react', 'react-dom', 'react-router-dom']
})
```

## Best Practices

### 1. Dependency Management
- Keep shared dependencies minimal and stable
- Use exact versions for critical shared libraries
- Avoid sharing frequently changing internal libraries

### 2. Error Boundaries
Create error boundaries for remote components:

```typescript
import React from 'react'

class RemoteErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with the remote component.</div>
    }

    return this.props.children
  }
}
```

### 3. Type Safety
- Create shared type definitions
- Use TypeScript declaration files for remote modules
- Implement runtime type checking for remote props

### 4. Performance
- Implement proper loading states
- Use React.lazy() with Suspense for code splitting
- Monitor bundle sizes and avoid duplicate dependencies

## Troubleshooting

### Common Issues

**1. "Module not found" errors**
- Ensure remote app is running and accessible
- Check that remoteEntry.js is generated and available
- Verify network connectivity between apps

**2. TypeScript errors for remote imports**
- Create proper declaration files in `src/types/`
- Use `// @ts-ignore` temporarily for testing
- Ensure shared dependencies have compatible versions

**3. Runtime errors with shared dependencies**
- Check version compatibility in package.json files
- Use singleton: true for React to avoid multiple instances
- Verify build targets are compatible (esnext)

**4. CORS issues in development**
- Ensure both apps run on different ports
- Check Vite proxy configuration if needed
- Consider using same-origin development setup

### Debug Commands

```bash
# Check if remoteEntry.js is generated
curl http://localhost:3001/assets/remoteEntry.js

# Build with verbose output
npm run build -- --mode development

# Check shared modules
ls -la dist/assets/*federation*
```

## Next Steps

1. **Create More Remotes**: Follow the same pattern for chat, user profile, etc.
2. **Implement Routing**: Use dynamic routing to load remotes based on URL
3. **Add Authentication**: Share auth context between shell and remotes
4. **Deploy Strategy**: Set up CI/CD for independent deployments
5. **Monitoring**: Add error tracking and performance monitoring

## Resources

- [Vite Plugin Federation Documentation](https://github.com/originjs/vite-plugin-federation)
- [Module Federation Examples](https://github.com/module-federation/module-federation-examples)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)

---

*This tutorial is based on the Airbnb clone project setup with Vite + React + TypeScript.*