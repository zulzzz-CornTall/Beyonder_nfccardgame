# Overview

NFC Fighter is a React-based card battle game featuring a roulette-style combat system with real NFC card integration. Players scan physical NFC cards containing character data to battle in turn-based combat where attack selection is combined with roulette spinning to determine outcomes. The game includes a rock-paper-scissors style effectiveness system with three attack types (burst, guts, slash) and provides an engaging visual experience with 3D elements and audio feedback.

## Recent Changes (August 20, 2025)
- **NFC Card Integration**: Added real NFC scanning functionality using Web NFC API
- **Card Data Format**: Implemented parser for specific NFC text format (Imgurl, Name, HP, B, G, S)
- **Enhanced UI**: Updated card display to show HP and individual attack values (B/G/S)
- **Graceful Fallback**: Mock scanning for devices without NFC support
- **Auto Permission**: Automatic NFC permission request with user feedback

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Main frontend framework using functional components and hooks
- **Vite**: Build tool and development server providing fast hot module replacement
- **Tailwind CSS**: Utility-first CSS framework for styling with custom design system
- **Radix UI**: Comprehensive component library providing accessible UI primitives
- **React Three Fiber**: 3D rendering capabilities using Three.js for enhanced visual effects
- **Zustand**: Lightweight state management with subscription middleware for game state

## State Management
- **Game State Store**: Manages overall game phases (ready, playing, ended)
- **Fighting State Store**: Handles battle mechanics, player data, and combat resolution
- **Audio State Store**: Controls sound effects and background music with mute functionality
- **React Query**: Server state management and API caching (infrastructure prepared but minimal usage)

## Component Structure
- **Game Components**: Modular battle system with attack selection, roulette mechanics, and result display
- **UI Components**: Extensive shadcn/ui component library with custom game-specific components
- **3D Components**: React Three Fiber integration for enhanced visual effects

## Game Logic Architecture
- **Combat System**: Rock-paper-scissors effectiveness chart determining damage multipliers
- **Roulette Mechanics**: Random value generation for turn order determination
- **Player Management**: Health tracking, attack selection, and NFC card integration
- **Round Resolution**: Sequential battle processing with damage calculation and win conditions
- **NFC Integration**: Web NFC API implementation with text parsing for card data (Imgurl, Name, HP, B/G/S format)
- **Card Management**: Dynamic character loading from physical NFC cards with graceful fallback to mock data

## Backend Architecture
- **Express.js Server**: RESTful API server with middleware for logging and error handling
- **Development Setup**: Vite integration for seamless full-stack development
- **Route Structure**: Modular route registration with placeholder for API endpoints
- **Storage Interface**: Abstracted storage layer with in-memory implementation for user management

## Data Storage
- **Drizzle ORM**: Type-safe database interactions with PostgreSQL dialect
- **Neon Database**: Cloud PostgreSQL database for production data storage
- **Schema Design**: User management tables with authentication fields
- **Migration System**: Database schema versioning and deployment automation

## Development Tools
- **TypeScript Configuration**: Strict type checking with path mapping for clean imports
- **ESBuild**: Fast bundling for production builds
- **Hot Reload**: Development server with automatic refresh and error overlay
- **GLSL Support**: Shader loading capabilities for advanced 3D effects

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Three Fiber for 3D rendering
- **Vite**: Development server and build tool with React plugin
- **TypeScript**: Type safety and development experience

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Radix UI**: Complete set of accessible UI primitives and components
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating type-safe component variants

## State Management and Data
- **Zustand**: Lightweight state management with middleware support
- **React Query (TanStack Query)**: Server state management and caching
- **React Hook Form**: Form handling and validation

## Database and Backend
- **Drizzle ORM**: Type-safe database toolkit with schema management
- **Neon Database**: Cloud PostgreSQL service via @neondatabase/serverless
- **Express.js**: Web application framework for API endpoints
- **Connect PG Simple**: PostgreSQL session store for Express

## Audio and 3D Graphics
- **React Three Drei**: Helper library for React Three Fiber
- **React Three Postprocessing**: Post-processing effects for 3D scenes
- **Vite Plugin GLSL**: Shader file support for advanced graphics

## Development and Build Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server
- **Replit Vite Plugin**: Runtime error modal for development
- **PostCSS**: CSS processing with Autoprefixer support