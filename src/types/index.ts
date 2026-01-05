export interface Profile {
  id: string;
  full_name: string | null;
  starting_capital: number;
  current_capital: number;
  max_daily_loss: number;
  max_trade_loss: number;
  max_trades_per_day: number | null;
  daily_target: number;
  weekly_target: number;
  monthly_target: number;
  target_hit_ratio: number;
  target_roi: number;
  theme: 'light' | 'dark' | 'system';
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TradingRule {
  id: string;
  user_id: string;
  rule_order: number;
  rule_text: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TradingDay {
  id: string;
  user_id: string;
  date: string;
  opening_capital: number | null;
  closing_capital: number | null;
  total_pnl: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  max_profit: number;
  max_loss: number;
  hit_ratio: number;
  roi_percent: number;
  pre_market_mood: string | null;
  pre_market_notes: string | null;
  post_market_notes: string | null;
  discipline_score: number | null;
  rules_acknowledged: boolean;
  rules_acknowledged_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: string;
  user_id: string;
  trading_day_id: string | null;
  trade_date: string;
  trade_time: string | null;
  symbol: string;
  trade_type: 'LONG' | 'SHORT';
  quantity: number;
  entry_price: number;
  exit_price: number | null;
  pnl: number | null;
  is_winner: boolean | null;
  is_closed: boolean;
  broker: 'ZERODHA' | 'GROWW' | 'OTHER';
  emotion_before: string | null;
  emotion_after: string | null;
  notes: string | null;
  screenshot_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  quote_text: string;
  author: string | null;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface WeeklyReview {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  total_pnl: number | null;
  total_trades: number | null;
  winning_trades: number | null;
  losing_trades: number | null;
  hit_ratio: number | null;
  goal_achieved: boolean | null;
  what_worked: string | null;
  what_didnt_work: string | null;
  rule_violations: string | null;
  key_learnings: string | null;
  next_week_plan: string | null;
  discipline_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface MonthlyReview {
  id: string;
  user_id: string;
  month: number;
  year: number;
  total_pnl: number | null;
  total_trades: number | null;
  winning_trades: number | null;
  losing_trades: number | null;
  hit_ratio: number | null;
  avg_profit: number | null;
  avg_loss: number | null;
  max_profit: number | null;
  max_loss: number | null;
  roi_percent: number | null;
  trading_days: number | null;
  green_days: number | null;
  red_days: number | null;
  goal_achieved: boolean | null;
  performance_summary: string | null;
  key_insights: string | null;
  strategy_adjustments: string | null;
  areas_to_improve: string | null;
  satisfaction_rating: number | null;
  created_at: string;
  updated_at: string;
}

export type EmotionBefore = 'Confident' | 'Fearful' | 'FOMO' | 'Revenge' | 'Planned' | 'Impulsive';
export type EmotionAfter = 'Satisfied' | 'Regretful' | 'Relieved' | 'Frustrated' | 'Learning';
export type Mood = 'Confident' | 'Neutral' | 'Anxious' | 'Aggressive' | 'Calm';
