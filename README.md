# 🎯 SkillUNO — Learn. Teach. Exchange.

> A premium token-based skill exchange platform where your expertise is your currency.

🌐 **Live Demo:** [skilluno-one.vercel.app](https://skilluno-one.vercel.app)

---

## ✨ Features

### 🔐 Authentication
- Google OAuth login via NextAuth.js
- Session-based JWT authentication
- Protected dashboard routes

### 💰 Token Economy
- Earn tokens by teaching your skills
- Spend tokens to learn from experts
- Wallet with transaction history
- Token purchasing system

### 🎓 Skill Exchange
- Add skills you can teach (category, level, experience)
- Request skills you want to learn
- Smart matching algorithm finds teacher-student pairs
- Session scheduling with status tracking

### 📊 Dashboard
- Real-time stats (balance, sessions, rating)
- Quick action cards
- Activity overview

### 🗺️ Explore
- Browse all available teachers and skills
- Category filtering & search
- Skill cards with teacher info

### 🏆 Leaderboard
- Top rated teachers
- Most active community members
- Platform statistics

### ⚙️ Settings
- Profile management (name, location, languages)
- Account settings
- Danger zone (account deletion)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Auth** | NextAuth.js (Google OAuth) |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **Styling** | CSS (Glassmorphism, Gradients) |
| **Animations** | GSAP, Framer Motion, Lenis |
| **3D** | Three.js, React Three Fiber |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (Supabase recommended)

### Installation

```bash
# Clone the repo
git clone https://github.com/yashsingh-14/SkillUNO.git
cd SkillUNO

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (dashboard)/     # Protected dashboard pages
│   │   ├── dashboard/   # Main dashboard
│   │   ├── explore/     # Browse skills
│   │   ├── skills/      # My skills
│   │   ├── learn/       # Learn new skills
│   │   ├── matches/     # Matched teachers
│   │   ├── requests/    # Session requests
│   │   ├── sessions/    # Active sessions
│   │   ├── wallet/      # Token wallet
│   │   ├── leaderboard/ # Rankings
│   │   └── settings/    # Profile settings
│   ├── api/             # API routes
│   │   ├── auth/        # Authentication
│   │   ├── dashboard/   # Dashboard stats
│   │   ├── explore/     # Explore skills
│   │   ├── matches/     # Matching
│   │   ├── sessions/    # Session management
│   │   ├── wallet/      # Token operations
│   │   └── ...
│   └── auth/            # Login/Signup pages
├── components/
│   ├── dashboard/       # Dashboard components
│   ├── landing/         # Landing page components
│   └── ui/              # Shared UI components
├── lib/                 # Utilities
└── types/               # TypeScript types
```

---

## 🎨 Design System

- **Theme:** Dark mode with glassmorphism
- **Colors:** Purple/Indigo gradient palette
- **Typography:** Geist Sans + Geist Mono
- **Cards:** Glass-card with gradient borders
- **Animations:** Smooth transitions, staggered reveals, micro-interactions

---

## 👤 Author

**Yash Singh**
- GitHub: [@yashsingh-14](https://github.com/yashsingh-14)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
