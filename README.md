# GlowNatura Admin Panel

Professional admin dashboard for GlowNatura e-commerce platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.x (strict mode)
- **Styling:** Tailwind CSS v3
- **Components:** shadcn/ui
- **HTTP Client:** Axios
- **Validation:** Zod
- **Forms:** React Hook Form
- **Notifications:** Sonner
- **Icons:** Lucide React
- **Deployment:** Cloudflare Pages
- **Backend:** Express.js 5.1.0 (deployed on Render)

## Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── app/                 # Next.js App Router (Presentation Layer)
├── core/                # Domain Layer (Business Logic)
│   ├── entities/        # Domain entities
│   ├── use-cases/       # Business operations
│   └── ports/           # Interfaces (contracts)
├── infrastructure/      # Infrastructure Layer (Adapters)
│   ├── api/             # HTTP client
│   ├── repositories/    # Repository implementations
│   └── config/          # Configuration
├── presentation/        # Presentation Layer (UI)
│   ├── components/      # React components
│   ├── hooks/           # Custom hooks
│   ├── context/         # React context
│   └── validators/      # Zod schemas
└── shared/              # Shared utilities
    ├── utils/           # Helper functions
    └── types/           # Shared types
```

## Features

- ✅ Authentication with JWT
- ✅ Responsive design (mobile-first)
- ✅ Product management
- ✅ Category management
- ✅ Review management
- ✅ Order management
- ✅ Media library
- ✅ Settings management
- ✅ Dashboard with statistics

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd AdminGlowNaturas
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your backend API URL:
```
NEXT_PUBLIC_API_URL=https://glownatura-backend.onrender.com
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check
- `npm run format` - Format code with Prettier

## Deployment to Cloudflare Pages

1. Build the project:
```bash
npm run build
```

2. Deploy using Wrangler CLI:
```bash
npm install -g wrangler
wrangler login
wrangler pages deploy out --project-name=glownatura-admin
```

Or connect your GitHub repository to Cloudflare Pages with these settings:
- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Environment variables:** Set in Cloudflare dashboard

## Project Principles

This project adheres to professional software development principles:

- **SOLID Principles** - Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **DRY (Don't Repeat Yourself)** - Zero code duplication through reusable components and utilities
- **KISS (Keep It Simple, Stupid)** - Simple, readable, and maintainable code
- **Clean Architecture** - Clear separation of domain, infrastructure, and presentation layers
- **Type Safety** - TypeScript strict mode with zero `any` types
- **Responsive Design** - Mobile-first approach, works on all devices
- **Accessibility** - WCAG AA compliant

## Environment Variables

```
NEXT_PUBLIC_API_URL        # Backend API URL
NEXT_PUBLIC_APP_NAME       # Application name
NEXT_PUBLIC_APP_URL        # Application URL
```

## Code Quality

- Zero TypeScript errors
- Zero ESLint errors
- Zero console warnings
- 100% type coverage
- Comprehensive error handling
- Loading states everywhere
- Responsive on all devices (320px - 3840px)

## License

Private and confidential. All rights reserved.

