# TradeMind - Trading Discipline & Performance Tracker

A comprehensive web application to help intraday traders maintain discipline, track performance, manage risk, and improve consistency.

## Features (Phase 1 MVP)

### ✅ Completed Features

1. **Authentication System**
   - Email/password signup and login
   - Secure session management with Supabase
   - Protected routes

2. **Onboarding Flow**
   - Step 1: Profile Setup (Name, Starting Capital)
   - Step 2: Risk Limits Configuration (Max Daily Loss, Max Loss Per Trade, Max Trades Per Day)
   - Step 3: Trading Rules Setup (7 default rules with edit/reorder functionality)
   - Step 4: Goals Setup (Daily, Weekly, Monthly profit targets)

3. **Daily Discipline Ritual (Dashboard)**
   - Pre-trading ritual with motivational quotes
   - Trading rules checklist
   - Risk limits display
   - Mood selector (5 options with emojis)
   - Market notes textarea
   - "I Am Ready to Trade" confirmation button
   - Live trading dashboard with real-time P&L
   - Risk meter with color-coded zones (Safe, Caution, Danger, Stop)
   - Target progress bars
   - Auto-alerts at 50%, 75%, 100% risk limit usage

4. **Trade Journal**
   - Manual trade entry form with all required fields
   - Auto-calculation of P&L based on LONG/SHORT trade type
   - Symbol suggestions for Indian stocks
   - Emotion tracking (before and after trade)
   - Trade list with filtering and sorting
   - Trade detail modal with full information
   - Edit and delete functionality
   - Real-time statistics (Total P&L, Win Rate, etc.)

5. **Calendar View**
   - Monthly calendar grid with P&L color coding
   - Green gradient for profit days
   - Red gradient for loss days
   - Day detail modal showing all trades
   - Monthly summary with comprehensive statistics
   - Month navigation

6. **Analytics Dashboard**
   - P&L summary cards (Today, Week, Month, All Time)
   - Trading statistics (Hit Ratio, Avg Profit/Loss, Risk-Reward Ratio)
   - Extremes cards (Max Profit/Loss, Best/Worst Day)
   - Equity curve chart (cumulative P&L over time)
   - Daily P&L bar chart (last 30 days)
   - Comprehensive statistics table
   - Date range filtering

7. **Settings Page**
   - Profile settings (name, starting capital)
   - Risk limits configuration
   - Trading rules manager (add, edit, delete, reorder)
   - Goals settings
   - Password change
   - Mobile responsive with tabbed layout

8. **Additional Features**
   - Dark/Light/System theme toggle
   - Mobile-responsive design
   - Real-time Supabase subscriptions
   - INR currency formatting (₹)
   - Toast notifications
   - Loading states throughout
   - Header with navigation
   - Mobile bottom navigation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Date Management**: date-fns
- **State Management**: React Hooks + Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project created
- Database tables created (see Database Setup below)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://hjibkptyxbjnkyzoavtl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

The database schema has already been created in Supabase. Make sure you run the migration for the `update_trading_day_stats` function:

```sql
-- See: supabase/migrations/20260104_update_trading_day_stats_function.sql
```

This function automatically updates trading day statistics when trades are added, updated, or deleted.

## Project Structure

```
TradeMind/
├── src/
│   ├── app/                      # Next.js 14 app router pages
│   │   ├── analytics/           # Analytics dashboard
│   │   ├── calendar/            # Calendar view
│   │   ├── dashboard/           # Main dashboard (home)
│   │   ├── journal/             # Trade journal
│   │   ├── login/               # Login page
│   │   ├── onboarding/          # Onboarding flow
│   │   ├── settings/            # Settings page
│   │   ├── signup/              # Signup page
│   │   └── layout.tsx           # Root layout
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── analytics/           # Analytics components
│   │   ├── calendar/            # Calendar components
│   │   ├── dashboard/           # Dashboard components
│   │   ├── journal/             # Journal components
│   │   ├── layout/              # Layout components (Header, Nav, Theme)
│   │   ├── onboarding/          # Onboarding step components
│   │   └── settings/            # Settings components
│   │
│   ├── hooks/
│   │   ├── useAuth.ts           # Authentication hook
│   │   └── use-toast.ts         # Toast notifications hook
│   │
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client
│   │   └── utils.ts             # Utility functions
│   │
│   └── types/
│       └── index.ts             # TypeScript type definitions
│
├── .env.local                    # Environment variables
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## Usage Guide

### First Time Setup

1. **Sign Up**: Create an account at `/signup`
2. **Onboarding**: Complete the 4-step onboarding wizard
   - Enter your name and starting capital
   - Configure risk limits
   - Review and customize trading rules
   - Set profit targets
3. **Dashboard**: You'll be redirected to the dashboard

### Daily Workflow

1. **Morning Ritual** (Dashboard):
   - Read the motivational quote
   - Check all trading rules
   - Review your risk limits
   - Select your pre-market mood
   - Add market notes (optional)
   - Click "I Am Ready to Trade"

2. **During Trading** (Dashboard):
   - Monitor your P&L in real-time
   - Watch the risk meter
   - Track progress toward daily target
   - Get alerts when approaching risk limits

3. **Log Trades** (Journal):
   - Navigate to Journal page
   - Fill in trade details
   - Add emotions and notes
   - Save trade (auto-calculates P&L)

4. **Review Performance**:
   - **Calendar**: View monthly performance at a glance
   - **Analytics**: Deep dive into statistics and charts
   - Click any day to see detailed trades

5. **Adjust Settings** (Settings):
   - Update profile information
   - Modify risk limits as needed
   - Edit trading rules
   - Adjust profit targets

## Key Features Explained

### Risk Management

- **Risk Meter**: Visual indicator showing daily loss usage
  - Green (0-50%): Safe zone
  - Yellow (50-75%): Caution zone
  - Red (75-100%): Danger zone
  - Dark Red (>100%): STOP TRADING!

- **Automatic Alerts**: Toast notifications at key thresholds
  - 50% of daily loss limit
  - 75% of daily loss limit
  - 100% of daily loss limit reached
  - Daily target achieved

### Trade Tracking

- **Auto-Calculations**:
  - LONG: P&L = (Exit - Entry) × Quantity
  - SHORT: P&L = (Entry - Exit) × Quantity
  - Is Winner = P&L > 0

- **Filtering & Sorting**:
  - Filter by symbol, win/loss, broker, date range
  - Sort by date, P&L, symbol

### Analytics

- **Time Periods**: Today, This Week, This Month, All Time
- **Key Metrics**:
  - Total P&L and ROI
  - Win Rate (Hit Ratio)
  - Average Profit/Loss per trade
  - Risk-Reward Ratio
  - Profit Factor
  - Max Profit/Loss
  - Best/Worst Day

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Future Enhancements (Phase 2 & 3)

- Zerodha/Groww API integration for automatic trade import
- Screenshot upload with OCR for trade extraction
- Weekly and monthly review system
- Export to Excel/PDF
- Advanced analytics and insights
- Mobile app (React Native)

## Support

For issues or questions, please refer to the specification document: `trademind-spec.md`

## License

Private project - All rights reserved

---

**Built with discipline for disciplined traders** 📈
