# AIJobResearcher Frontend

Frontend service for AIJobResearcher - a job search platform with AI-powered recommendations, application management, and learning resources.

## Features

✨ **Key Features:**
- 📋 Browse job listings with advanced filtering and search
- 🔍 Real-time search with debouncing
- 🌍 Filter by location, salary, employment type, and more
- ♾️ Infinite scroll for seamless browsing
- 📱 Fully responsive design (desktop, tablet, mobile)
- 🎨 Clean, LinkedIn-inspired UI with light theme
- ⚡ Built with React 18, TypeScript, and Vite
- 🏗️ Clean architecture with separation of concerns

## Tech Stack

- **React** 18.3+ - UI library
- **TypeScript** 5.x - Type safety
- **React Router** 6.x - Client-side routing
- **Axios** - HTTP client with interceptors
- **Bootstrap** 5.3+ - CSS utilities
- **Vite** - Build tool and dev server

## Project Structure

```
src/
├── api/                 # API client and endpoints
│   ├── client.ts       # Axios instance with interceptors
│   └── vacancies.ts    # Vacancy API functions
├── components/          # React components
│   ├── common/         # Reusable components (Spinner, ErrorFallback)
│   ├── layout/         # Layout components (Header)
│   └── vacancies/      # Vacancy-specific components
├── hooks/              # Custom React hooks
│   ├── useVacancies.ts
│   ├── useVacancyDetail.ts
│   └── useInfiniteScroll.ts
├── types/              # TypeScript interfaces
│   └── vacancy.ts
├── utils/              # Utility functions
│   ├── dateFormatter.ts
│   ├── salaryFormatter.ts
│   └── constants.ts
├── styles/             # Global styles
├── pages/              # Page components
│   └── HomePage.tsx
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── vite-env.d.ts       # Vite type definitions
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AIJobResearcher/frontend.git
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your API endpoint:
   ```
   REACT_APP_API_URL=http://localhost:3001/api/v1
   ```

### Development

Start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:3000`.

### Build

Build for production:

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

### Linting & Formatting

Run ESLint:

```bash
npm run lint
```

Format code with Prettier:

```bash
npm run format
```

## Features Documentation

### 1. Vacancy List with Filters

**Filters:**
- Search by title or keyword
- Filter by country and city
- Salary range (min/max)
- Status (open/closed)
- Sort options (latest, salary ascending/descending)

All filters are synced to the URL for bookmarkability and sharing.

### 2. Infinite Scroll

The vacancy list automatically loads more items when you scroll to the bottom. Uses the native Intersection Observer API for optimal performance.

### 3. Vacancy Details

Click any vacancy to view full details:
- Company information with description
- Contact details (website, phone, email)
- Job description and requirements
- Employment type and workplace type
- Salary range
- Apply button (feature coming soon)

### 4. Responsive Design

- **Desktop (≥ 992px):** Two-column layout (list + details)
- **Tablet (768-991px):** Two columns with adjusted sizing
- **Mobile (< 768px):** Single column with details below

### 5. Error Handling

Graceful error handling with retry buttons for:
- Failed vacancy list loads
- Failed vacancy detail loads
- Network errors

## API Integration

### Base URL

```
http://localhost:3001/api/v1
```

### Endpoints Used

**GET /vacancies**
- List vacancies with pagination and filtering
- Query params: `title`, `country`, `city`, `salary_min`, `salary_max`, `status`, `sort`, `page`, `per_page`

**GET /vacancies/:id**
- Get detailed vacancy information

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## Code Standards

- **TypeScript:** No `any` types (except in rare cases with comments)
- **React:** Functional components with hooks
- **Naming:** camelCase for variables/functions, PascalCase for components
- **Comments:** Use for complex logic and hooks
- **Imports:** Organized with `@/` path aliases

## Future Features

- ✅ Vacancy listing (current)
- 📱 User applications/responses page
- 🎓 Learning resources page
- 👤 User profile page
- 🔔 Notifications
- 💾 Saved vacancies
- 🤖 AI recommendations

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:3001/api/v1` |

## Performance Considerations

- React.memo used for vacancy cards in large lists
- Debounced search input (500ms)
- Intersection Observer for infinite scroll (no scroll event listeners)
- Optimized bundle with Vite

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

See LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub.
