# Tutsin Digital Marketing Agency Website

## Overview

This is a full-stack web application for Tutsin, a digital marketing agency offering web design, SEO, social media marketing, and hosting services. The application features a modern React frontend with a Node.js/Express backend, PostgreSQL database integration via Drizzle ORM, and comprehensive content management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state and React Context for authentication
- **Build Tool**: Vite with custom aliases and hot reload
- **Theme System**: Dark/light mode toggle with CSS custom properties

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with structured error handling
- **Authentication**: Session-based auth with bcrypt password hashing
- **Storage Layer**: Abstracted storage interface supporting both in-memory and database implementations

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Management**: Code-first approach with migrations
- **Key Entities**:
  - Users (admin authentication)
  - Clients (customer accounts with sessions)
  - Blog posts (content management)
  - Contact submissions (lead capture)
  - Analytics (page views and website metrics)

### Authentication & Authorization
- **Client Authentication**: JWT-like session tokens with expiration
- **Password Security**: bcrypt hashing with salt rounds
- **Session Management**: Database-stored sessions with cleanup
- **Admin Access**: Simple password-based admin panel access

### API Structure
- **Client Auth**: `/api/auth/*` - registration, login, profile management
- **Blog Management**: `/api/blog/*` - CRUD operations for blog posts
- **Contact Forms**: `/api/contact` - lead submission handling
- **Analytics**: `/api/analytics/*` - website metrics and page views
- **Admin Panel**: `/api/admin/*` - content and submission management

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL via Neon Database serverless
- **UI Framework**: Radix UI primitives for accessible components
- **Icons**: Font Awesome for iconography
- **Fonts**: Google Fonts (Inter, JetBrains Mono, DM Sans, etc.)

### Development Tools
- **Type Safety**: Zod for runtime validation and schema inference
- **Code Quality**: ESBuild for production bundling
- **Development**: tsx for TypeScript execution, Vite dev server
- **Replit Integration**: Custom plugins for development environment

### Third-Party Services
- **Image Hosting**: Unsplash for placeholder images
- **Analytics**: Custom analytics implementation
- **Email**: Contact form submissions (no external email service integrated)

### Build & Deployment
- **Production Build**: Vite for frontend, ESBuild for backend
- **Database Migrations**: Drizzle Kit for schema management
- **Environment**: Configurable for development/production modes