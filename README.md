# Doraemon AI Learning Lab 🤖🔔

url- https://vibethon-big-deal-t119.vercel.app/

An interactive web-based learning platform for Artificial Intelligence and Machine Learning concepts, featuring beloved Doraemon characters as learning companions.

## Features

- **🔐 User Authentication** — Sign up, log in, and track personal progress
- **📚 Learning Modules** — Beginner → Intermediate → Advanced progression with unlock system
- **❓ AI Quiz** — Multiple-choice quiz with instant feedback on supervised learning, classification, and more
- **🎮 Mini Games** — 3 interactive games: Fruit Classifier, Feature Split, and Classification Sorting
- **💻 Coding Playground** — Write and run Python code with simulated execution
- **🧪 Real-World Simulation** — Spam Detection model improvement exercise
- **⚠️ Failure Lab** — Learn from common AI/ML mistakes
- **🏆 Leaderboard** — Compete with Doraemon characters for the top rank
- **📊 Dashboard** — Track modules, quiz scores, games, and simulations with progress bars and badges

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Routing**: React Router
- **State**: localStorage for progress persistence

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or bun package manager

### Run Locally

```bash
# Clone the repository
git clone https://github.com/omhajarnis-jpg/-Vibethon-BigDeal-t119.git
cd doraemon-ai-lab-main

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
npm run preview
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import the GitHub repo
4. Framework preset: **Vite**
5. Click Deploy

### Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect the GitHub repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click Deploy

### GitHub Pages

```bash
npm run build
# Deploy the `dist` folder to GitHub Pages
```

## Project Structure

```
src/
├── components/       # Navbar, MentorBubble, UI components
├── hooks/            # use-auth, use-progress, use-toast
├── pages/            # All page components
│   ├── Index.tsx     # Home page
│   ├── Learn.tsx     # Learning modules with levels
│   ├── Quiz.tsx      # AI quiz system
│   ├── MiniGame.tsx  # 3 interactive games
│   ├── Playground.tsx# Coding playground
│   ├── Simulation.tsx# Spam detection simulation
│   ├── FailureLab.tsx# Failure analysis
│   ├── Leaderboard.tsx# Rankings and badges
│   ├── Dashboard.tsx # Progress tracking
│   └── Login.tsx     # Authentication
├── App.tsx           # Routes and providers
└── main.tsx          # Entry point
```

## Team

**BigDeal** — Vibethon Hackathon 2026
