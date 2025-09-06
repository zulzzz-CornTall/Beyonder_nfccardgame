
# Arena Battle Game

A multiplayer card battle game with NFC card scanning capabilities, built with React, TypeScript, and Express.

## Features

- **Multiplayer Battles**: PvP and AI opponent modes
- **NFC Card Integration**: Scan physical cards to bring characters into the game
- **Multiple Languages**: Support for English, Japanese, Spanish, Arabic, Chinese, Indonesian, and Filipino
- **Real-time Combat**: Rock-Paper-Scissors style battle system with character abilities
- **3D Graphics**: Enhanced visual effects using React Three Fiber
- **Responsive Design**: Optimized for both desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Three Fiber** for 3D graphics
- **Zustand** for state management
- **React Query** for server state

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** with PostgreSQL (Neon)
- **WebSocket** support for real-time features

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd rest-express
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` if available
   - Configure your database connection and other required variables

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## Game Modes

### Player vs Player (PvP)
Both players scan their NFC cards and battle in real-time.

### Player vs AI
Battle against computer-controlled opponents with different difficulty levels.

### Character Battle
Quick battles using pre-selected characters.

## NFC Card System

The game supports NFC card scanning for:
- **Character Cards**: Define the player's avatar and base stats
- **Power Cards**: Provide additional abilities and stat boosts

Players can scan up to 3 cards each before battle begins.

## Supported Languages

- English (en)
- Japanese (ja)
- Spanish (es)
- Arabic (ar)
- Chinese (zh)
- Indonesian (id)
- Filipino (tl)

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/           # Utilities and stores
│   │   └── types/         # TypeScript type definitions
├── server/                # Backend Express application
├── shared/                # Shared types and schemas
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
