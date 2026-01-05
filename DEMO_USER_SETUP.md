# Demo User Setup Guide

## Quick Setup (2 Steps)

### Step 1: Create Auth User in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (hjibkptyxbjnkyzoavtl)
3. Navigate to **Authentication** → **Users**
4. Click **"Add User"**
5. Fill in:
   - **Email:** `demouser@trademind.com`
   - **Password:** `password`
   - Click **"Create User"**
6. **IMPORTANT:** Copy the User ID (UUID) that appears - you'll need it for Step 2

### Step 2: Run SQL Script

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the complete script below
4. **REPLACE** `USER_ID_HERE` with the actual UUID from Step 1 (do a find & replace)
5. Click **"Run"**

```sql
-- ========================================
-- TradeMind Demo User Complete Setup
-- ========================================
-- IMPORTANT: Replace USER_ID_HERE with the actual UUID from the auth.users table
-- Example: '550e8400-e29b-41d4-a716-446655440000'

-- Step 1: Create/Update Profile
INSERT INTO public.profiles (
    id,
    full_name,
    starting_capital,
    current_capital,
    max_daily_loss,
    max_trade_loss,
    max_trades_per_day,
    daily_target,
    weekly_target,
    monthly_target,
    target_hit_ratio,
    target_roi,
    theme,
    onboarding_completed,
    created_at,
    updated_at
) VALUES (
    'USER_ID_HERE'::uuid,
    'Demo User',
    100000,
    105000,
    5000,
    1000,
    10,
    3000,
    15000,
    50000,
    65,
    5,
    'system',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    onboarding_completed = true;

-- Step 2: Insert Trading Rules
DELETE FROM public.trading_rules WHERE user_id = 'USER_ID_HERE'::uuid;

INSERT INTO public.trading_rules (user_id, rule_order, rule_text, category, is_active) VALUES
    ('USER_ID_HERE'::uuid, 1, 'Risk Management First - Never risk more than defined limits', 'Risk Management', true),
    ('USER_ID_HERE'::uuid, 2, 'Always Honor Stop Loss - No moving SL against the trade', 'Risk Management', true),
    ('USER_ID_HERE'::uuid, 3, 'Proper Position Sizing - Size based on SL distance, not conviction', 'Risk Management', true),
    ('USER_ID_HERE'::uuid, 4, 'Be Agile in Booking Profits - Don''t be greedy, book partial profits', 'Profit Taking', true),
    ('USER_ID_HERE'::uuid, 5, 'Never Let a Winner Turn into a Loser - Trail SL to breakeven', 'Profit Taking', true),
    ('USER_ID_HERE'::uuid, 6, 'Be Patient - Wait for Proper Entry - No FOMO trades', 'Discipline', true),
    ('USER_ID_HERE'::uuid, 7, 'Stick to Daily/Weekly/Monthly Targets - Stop when target achieved', 'Discipline', true);

-- Step 3: Delete existing sample data (if any)
DELETE FROM public.trades WHERE user_id = 'USER_ID_HERE'::uuid;
DELETE FROM public.trading_days WHERE user_id = 'USER_ID_HERE'::uuid;

-- Step 4: Create Sample Trading Days
INSERT INTO public.trading_days (
    id,
    user_id,
    date,
    opening_capital,
    closing_capital,
    total_pnl,
    total_trades,
    winning_trades,
    losing_trades,
    max_profit,
    max_loss,
    hit_ratio,
    roi_percent,
    pre_market_mood,
    pre_market_notes,
    rules_acknowledged,
    rules_acknowledged_at,
    is_active
) VALUES
    (gen_random_uuid(), 'USER_ID_HERE'::uuid, CURRENT_DATE - 5, 100000, 102500, 2500, 5, 4, 1, 1200, -300, 80.00, 2.50, 'Confident', 'Market looks bullish, good volume in key stocks', true, (CURRENT_DATE - 5 + TIME '09:00:00')::timestamptz, true),
    (gen_random_uuid(), 'USER_ID_HERE'::uuid, CURRENT_DATE - 4, 102500, 103800, 1300, 4, 3, 1, 800, -200, 75.00, 1.27, 'Calm', 'Consolidation expected, trading only on breakouts', true, (CURRENT_DATE - 4 + TIME '09:00:00')::timestamptz, true),
    (gen_random_uuid(), 'USER_ID_HERE'::uuid, CURRENT_DATE - 3, 103800, 102900, -900, 6, 2, 4, 500, -450, 33.33, -0.87, 'Anxious', 'Volatile market, need to be careful', true, (CURRENT_DATE - 3 + TIME '09:00:00')::timestamptz, true),
    (gen_random_uuid(), 'USER_ID_HERE'::uuid, CURRENT_DATE - 2, 102900, 105100, 2200, 5, 4, 1, 1000, -200, 80.00, 2.14, 'Confident', 'Clear trend, good setups available', true, (CURRENT_DATE - 2 + TIME '09:00:00')::timestamptz, true),
    (gen_random_uuid(), 'USER_ID_HERE'::uuid, CURRENT_DATE - 1, 105100, 105000, -100, 3, 1, 2, 300, -400, 33.33, -0.10, 'Neutral', 'Choppy market, small positions only', true, (CURRENT_DATE - 1 + TIME '09:00:00')::timestamptz, true);

-- Step 5: Create Sample Trades
WITH day_ids AS (
    SELECT id, date FROM public.trading_days WHERE user_id = 'USER_ID_HERE'::uuid ORDER BY date
)
INSERT INTO public.trades (user_id, trading_day_id, trade_date, trade_time, symbol, trade_type, quantity, entry_price, exit_price, pnl, is_winner, is_closed, broker, emotion_before, emotion_after, notes)
SELECT 'USER_ID_HERE'::uuid, id, date, '10:30:00'::time, 'RELIANCE', 'LONG', 50, 2450.00, 2474.00, 1200, true, true, 'ZERODHA', 'Confident', 'Satisfied', 'Perfect breakout trade. Followed the plan exactly.' FROM day_ids WHERE date = CURRENT_DATE - 5
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '11:45:00'::time, 'TCS', 'LONG', 30, 3650.00, 3670.00, 600, true, true, 'ZERODHA', 'Planned', 'Satisfied', 'Clean entry and exit.' FROM day_ids WHERE date = CURRENT_DATE - 5
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '13:15:00'::time, 'INFY', 'LONG', 40, 1580.00, 1593.00, 520, true, true, 'ZERODHA', 'Confident', 'Satisfied', 'Good momentum trade.' FROM day_ids WHERE date = CURRENT_DATE - 5
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '14:30:00'::time, 'HDFC', 'SHORT', 25, 1650.00, 1656.00, -150, false, true, 'ZERODHA', 'FOMO', 'Regretful', 'Should have waited for confirmation.' FROM day_ids WHERE date = CURRENT_DATE - 5
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '15:00:00'::time, 'ICICIBANK', 'LONG', 35, 1120.00, 1129.00, 315, true, true, 'ZERODHA', 'Planned', 'Satisfied', 'End of day opportunity, booked quick profit.' FROM day_ids WHERE date = CURRENT_DATE - 5
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '10:15:00'::time, 'SBIN', 'LONG', 100, 585.00, 593.00, 800, true, true, 'GROWW', 'Calm', 'Satisfied', 'Patient entry paid off.' FROM day_ids WHERE date = CURRENT_DATE - 4
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '12:00:00'::time, 'AXISBANK', 'LONG', 40, 1045.00, 1050.00, 200, true, true, 'GROWW', 'Planned', 'Satisfied', 'Small gain, better than nothing.' FROM day_ids WHERE date = CURRENT_DATE - 4
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '14:30:00'::time, 'WIPRO', 'LONG', 60, 465.00, 462.00, -180, false, true, 'GROWW', 'Impulsive', 'Regretful', 'Broke my rule, entered without setup.' FROM day_ids WHERE date = CURRENT_DATE - 4
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '14:45:00'::time, 'HCLTECH', 'LONG', 45, 1380.00, 1392.00, 540, true, true, 'GROWW', 'Planned', 'Satisfied', 'Tech sector doing well today.' FROM day_ids WHERE date = CURRENT_DATE - 4
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '10:00:00'::time, 'TATAMOTORS', 'SHORT', 80, 750.00, 745.00, 400, true, true, 'ZERODHA', 'Anxious', 'Relieved', 'Lucky escape from a reversal.' FROM day_ids WHERE date = CURRENT_DATE - 3
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '10:45:00'::time, 'MARUTI', 'LONG', 15, 12500.00, 12480.00, -300, false, true, 'ZERODHA', 'Revenge', 'Frustrated', 'Revenge trading after first loss. Big mistake.' FROM day_ids WHERE date = CURRENT_DATE - 3
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '11:30:00'::time, 'BAJAJFINANCE', 'LONG', 10, 6850.00, 6820.00, -300, false, true, 'ZERODHA', 'Anxious', 'Frustrated', 'Market too choppy today.' FROM day_ids WHERE date = CURRENT_DATE - 3
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '13:00:00'::time, 'LT', 'LONG', 30, 3520.00, 3505.00, -450, false, true, 'ZERODHA', 'FOMO', 'Frustrated', 'Worst trade of the day. Emotional trading.' FROM day_ids WHERE date = CURRENT_DATE - 3
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '14:00:00'::time, 'COALINDIA', 'LONG', 80, 415.00, 421.00, 480, true, true, 'ZERODHA', 'Calm', 'Satisfied', 'Finally a winner to end the day.' FROM day_ids WHERE date = CURRENT_DATE - 3
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '15:00:00'::time, 'NTPC', 'LONG', 100, 320.00, 318.00, -200, false, true, 'ZERODHA', 'Impulsive', 'Regretful', 'Should have stopped trading for the day.' FROM day_ids WHERE date = CURRENT_DATE - 3
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '10:00:00'::time, 'NIFTY', 'LONG', 75, 21500.00, 21540.00, 3000, true, true, 'GROWW', 'Confident', 'Satisfied', 'Perfect index trade. Big winner!' FROM day_ids WHERE date = CURRENT_DATE - 2
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '11:30:00'::time, 'BANKNIFTY', 'SHORT', 50, 45200.00, 45180.00, 1000, true, true, 'GROWW', 'Planned', 'Satisfied', 'Trend reversal caught perfectly.' FROM day_ids WHERE date = CURRENT_DATE - 2
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '13:00:00'::time, 'ITC', 'LONG', 150, 450.00, 454.00, 600, true, true, 'ZERODHA', 'Calm', 'Satisfied', 'Steady gainer as expected.' FROM day_ids WHERE date = CURRENT_DATE - 2
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '14:30:00'::time, 'HINDUNILVR', 'LONG', 20, 2480.00, 2470.00, -200, false, true, 'ZERODHA', 'Impulsive', 'Regretful', 'Chased the price, bad entry.' FROM day_ids WHERE date = CURRENT_DATE - 2
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '15:15:00'::time, 'BHARTIARTL', 'LONG', 100, 1580.00, 1590.00, 1000, true, true, 'ZERODHA', 'Planned', 'Satisfied', 'Good end of day move.' FROM day_ids WHERE date = CURRENT_DATE - 2
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '10:45:00'::time, 'ASIANPAINT', 'LONG', 25, 2940.00, 2952.00, 300, true, true, 'ZERODHA', 'Neutral', 'Satisfied', 'Small but clean trade.' FROM day_ids WHERE date = CURRENT_DATE - 1
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '13:15:00'::time, 'SUNPHARMA', 'LONG', 50, 1580.00, 1572.00, -400, false, true, 'ZERODHA', 'Impulsive', 'Regretful', 'Entered too late in the move.' FROM day_ids WHERE date = CURRENT_DATE - 1
UNION ALL SELECT 'USER_ID_HERE'::uuid, id, date, '15:00:00'::time, 'DRREDDY', 'LONG', 15, 5850.00, 5840.00, -150, false, true, 'ZERODHA', 'FOMO', 'Frustrated', 'Should have avoided trading today.' FROM day_ids WHERE date = CURRENT_DATE - 1;

-- Verification Query
SELECT
    'Setup Complete!' as status,
    COUNT(DISTINCT td.id) as trading_days,
    COUNT(t.id) as total_trades,
    SUM(CASE WHEN t.is_winner THEN 1 ELSE 0 END) as winning_trades,
    SUM(t.pnl) as total_pnl
FROM public.trading_days td
LEFT JOIN public.trades t ON t.trading_day_id = td.id
WHERE td.user_id = 'USER_ID_HERE'::uuid;
```

---

## Demo Account Details

After setup, you can login with:

- **Email:** `demouser@trademind.com`
- **Password:** `password`

### What You'll See:

**Profile:**
- Name: Demo User
- Starting Capital: ₹1,00,000
- Current Capital: ₹1,05,000
- Max Daily Loss: ₹5,000
- Max Loss Per Trade: ₹1,000
- Max Trades Per Day: 10

**Trading History:**
- 5 days of trading data
- 22 total trades
- Mix of winning and losing trades
- Various stocks (RELIANCE, TCS, NIFTY, BANKNIFTY, etc.)
- Different emotions and trading notes
- Both ZERODHA and GROWW brokers

**Performance Summary:**
- Total P&L: ₹5,000 profit
- Starting: ₹1,00,000 → Current: ₹1,05,000
- Multiple green and red days
- Win rate around 60%
- Realistic trading patterns

---

## Alternative: Manual Creation

If you prefer not to use SQL:

1. **Create user via Supabase Dashboard** (as above)
2. **Login to TradeMind** with `demouser@trademind.com` / `password`
3. **Complete onboarding** manually
4. **Add a few trades** through the Journal page

---

## Troubleshooting

**Issue:** "User already exists"
- Solution: Delete the existing user in Supabase Auth and try again

**Issue:** SQL error "relation does not exist"
- Solution: Make sure you've run the main database migration first

**Issue:** Can't login
- Solution: Check that you confirmed the email in Supabase or disabled email confirmation

---

## Security Note

**IMPORTANT:** Change the demo password before deploying to production!

You can change it in Supabase:
1. Go to Authentication → Users
2. Click on the demo user
3. Click "Reset Password"
4. Or delete the demo user entirely

---

**Ready to test!** 🚀

Login at: http://localhost:3000/login
Email: demouser@trademind.com
Password: password
