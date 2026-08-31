# AIJobResearcher Frontend

> A modern, enterprise-grade React application for job search with AI-powered recommendations.

## 🚀 Tech Stack (August 2026)

### Core
- **React 19.2** - Latest React with Server Components support
- **TypeScript 5.5** - Type-safe development
- **Webpack 5** - Enterprise-grade bundler with full control
- **Babel 7** - Modern JavaScript transpilation

### State Management & Data Fetching
- **TanStack Query v5** - Server state management with caching and synchronization
- **Zustand v5** - Lightweight client state management
- **Fetch API** - Native HTTP client (no external dependencies)

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **PostCSS** - CSS transformations
- **Autoprefixer** - Browser compatibility

### Forms & Validation
- **React Hook Form v8** - Performant form handling
- **Zod v3** - Runtime TypeScript-first schema validation

### Testing
- **Vitest v1** - Fast unit testing
- **React Testing Library v16** - Component testing via user behavior
- **Playwright v1** - End-to-end testing
- **@testing-library/jest-dom** - DOM matchers

### Code Quality
- **ESLint v9** - Linting with React and TypeScript plugins
- **Prettier v3** - Code formatting
- **Husky v9** - Git hooks
- **lint-staged v15** - Run linters on staged files

## 📁 Project Structure

```
src/
├── api/                    # API client and endpoints
│   └── client.ts          # Fetch-based HTTP client with interceptors
├── components/            # React components
│   ├── common/           # Reusable components (Spinner, ErrorFallback)
│   ├── layout/           # Layout components (Header)
│   └── vacancies/        # Feature-specific components
├── hooks/                 # Custom React hooks
│   ├── useVacancies.ts   # TanStack Query hooks for vacancies
│   └── useInfiniteScroll.ts
├── store/                 # Zustand stores
│   └── vacancyFilterStore.ts
├── schemas/               # Zod validation schemas
│   └── vacancy.ts
├── types/                 # TypeScript type definitions
│   └── vacancy.ts
├── utils/                 # Utility functions
│   ├── constants.ts
│   ├── dateFormatter.ts
│   └── salaryFormatter.ts
├── styles/                # Global styles
│   └── index.css
├── pages/                 # Page components
│   └── HomePage.tsx
├── __tests__/             # Test files
├── App.tsx                # Main app component
├── index.tsx              # Entry point
└── vite-env.d.ts         # Vite types
```

## ✨ Features

### ✅ Current
- 📋 **Browse Job Listings** - Browse vacancies with pagination
- 🔍 **Advanced Filtering** - Filter by title, location, salary, employment type
- 🔎 **Real-time Search** - Debounced search with 500ms delay
- ♾️ **Infinite Scroll** - Load more vacancies as you scroll
- 📱 **Responsive Design** - Two-column on desktop, single column on mobile
- 💾 **URL Persistence** - Filters saved in URL for bookmarking
- ⚡ **Optimized Performance** - Code splitting, lazy loading, caching
- 🎨 **Enterprise UI** - Tailwind CSS with clean, modern design
- 🧪 **Comprehensive Tests** - Unit, component, and E2E tests
- 📊 **Type Safety** - Full TypeScript + Zod runtime validation
- 🛡️ **Error Handling** - Graceful error fallbacks with retry logic

### 🚧 Coming Soon
- 👤 User applications/responses page
- 📚 Learning resources
- 👥 User profile
- 🔔 Notifications
- ❤️ Saved vacancies
- 🤖 AI recommendations

## 🏃 Quick Start

### Prerequisites
- Node.js 18+ (LTS)
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/AIJobResearcher/frontend.git
cd frontend

# Install dependencies
npm install

# Setup git hooks (if needed manually)
npm run prepare
```

### Environment Setup

```bash
# Copy environment template
cp .env.development .env.local

# Update API URL if needed
# VITE_API_URL=http://localhost:8001/api/v1
```

### Development

```bash
# Start development server (opens on http://localhost:3000)
npm run dev

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Watch mode for tests
npm run test:watch

# Generate coverage report
npm run test:coverage

# Type check
npm run type-check
```

### Production Build

```bash
# Build for production
npm run build

# Analyze bundle size
npm run build:analyze

# Preview production build
cd dist && python -m http.server
```

## 🧪 Testing

### Unit & Component Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Files Location
```
src/__tests__/
├── components/
│   └── layout/
│       └── Header.test.tsx
├── hooks/
│   └── useVacancies.test.tsx
├── store/
│   └── vacancyFilterStore.test.ts
└── schemas/
    └── vacancy.test.ts
```

### E2E Tests (Coming Soon)
```bash
npm run test:e2e
```

## 📦 API Integration

### Base URL
```
http://localhost:8001/api/v1
```

### Endpoints

**GET /vacancies**
- List vacancies with filtering and pagination
- Query params: `title`, `country`, `city`, `salary_min`, `salary_max`, `status`, `sort`, `page`, `per_page`
- Response: `{ data: VacancyPreview[], total: number, page: number, per_page: number }`

**GET /vacancies/:id**
- Get detailed vacancy information
- Response: `VacancyDetail`

**POST /vacancies/:id/apply**
- Apply to vacancy (coming soon)
- Response: `{ success: boolean, message: string }`

## 🎯 Architecture Decisions

### Why Webpack over Vite?
- **Enterprise Standard** - More control and customization
- **Plugin Ecosystem** - Mature and extensive
- **Production Proven** - Used by Meta, Netflix, Airbnb
- **Monorepo Support** - Better for scaling

### Why TanStack Query?
- **Server State** - Automatic caching and synchronization
- **Refetching** - Background updates and retry logic
- **DevTools** - Great debugging experience
- **Performance** - Reduces component re-renders

### Why Zustand?
- **Lightweight** - Minimal boilerplate vs Redux
- **TypeScript First** - Great type inference
- **Simple API** - Easier to learn and maintain
- **Perfect for UI State** - Filters, modals, etc.

### Why Tailwind CSS?
- **Modern Standard** - Now industry default
- **Performance** - Minimal CSS bundle
- **Customizable** - Easy to extend theme
- **Developer Experience** - Faster development

## 🔐 Code Quality Standards

### Pre-commit Hooks (Husky + lint-staged)
- ESLint checks on staged TypeScript files
- Prettier formatting on all source files
- Automatic fixes for common issues

### Pre-push Hooks
- Full type checking
- Ensures no type errors reach remote

### ESLint Rules
- React best practices
- React Hooks rules
- TypeScript strict mode
- No console.log in production
- Exhaustive deps checks

## 🚀 Performance Optimization

- **Code Splitting** - Automatic chunk splitting by Webpack
- **Lazy Loading** - React Router dynamic imports
- **Infinite Scroll** - Intersection Observer (no scroll listeners)
- **Debounced Search** - 500ms delay reduces API calls
- **Query Caching** - TanStack Query caches responses
- **CSS Optimization** - Tailwind CSS purging
- **Image Optimization** - Asset handling in webpack

## 🌍 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Modern browsers with ES2020 support

## 📊 Bundle Analysis

```bash
npm run build:analyze
```

Generated stats can be analyzed with webpack-bundle-analyzer.

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Code changes follow ESLint rules
3. Add tests for new functionality
4. Commit follows conventions (pre-commit hooks run)
5. Push triggers type-check (pre-push hooks run)
6. Open Pull Request with clear description

## 📝 Naming Conventions

- **Files**: camelCase for utilities, PascalCase for components
- **Functions**: camelCase
- **Components**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Types**: PascalCase with `Type` suffix (e.g., `VacancyType`)
- **Interfaces**: PascalCase with `I` prefix (optional, e.g., `IVacancy`)

## 🔍 Type Safety

- **Strict Mode**: Enabled in TypeScript
- **Runtime Validation**: Zod schemas for API responses
- **No `any`**: Use `unknown` if needed, always narrow type
- **Explicit Types**: Always add return types to functions

## 📚 Additional Resources

- [React 19 Documentation](https://react.dev)
- [TanStack Query Docs](https://tanstack.com/query)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Webpack Docs](https://webpack.js.org)
- [Vitest Docs](https://vitest.dev)

## 📄 License

See LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check GitHub Issues
2. Review documentation
3. Create new issue with detailed description
4. Include error logs and reproduction steps

---

**Made with ❤️ by AIJobResearcher Team**  
**Last Updated: August 2026**
