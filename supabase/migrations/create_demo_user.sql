-- Create Demo User for TradeMind
-- Email: demouser@trademind.com
-- Password: password

-- Note: Run this script in your Supabase SQL Editor
-- The user will need to be created via Supabase Auth first

-- Step 1: Create the auth user (you'll need to do this via Supabase Dashboard or API)
-- Go to Authentication > Users > Add User
-- Email: demouser@trademind.com
-- Password: password
-- Or run this if you have admin access:

-- Get the user ID after creation (you'll need to replace 'USER_ID_HERE' below)
-- For now, we'll use a placeholder that you should replace

-- Step 2: Create profile for demo user
-- Replace 'USER_ID_HERE' with the actual UUID from the auth.users table

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
    'USER_ID_HERE'::uuid,  -- Replace with actual user ID
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
    starting_capital = EXCLUDED.starting_capital,
    current_capital = EXCLUDED.current_capital,
    max_daily_loss = EXCLUDED.max_daily_loss,
    max_trade_loss = EXCLUDED.max_trade_loss,
    max_trades_per_day = EXCLUDED.max_trades_per_day,
    daily_target = EXCLUDED.daily_target,
    weekly_target = EXCLUDED.weekly_target,
    monthly_target = EXCLUDED.monthly_target,
    onboarding_completed = EXCLUDED.onboarding_completed;

-- Step 3: Insert default trading rules for demo user
INSERT INTO public.trading_rules (user_id, rule_order, rule_text, category, is_active) VALUES
    ('USER_ID_HERE'::uuid, 1, 'Risk Management First - Never risk more than defined limits', 'Risk Management', true),
    ('USER_ID_HERE'::uuid, 2, 'Always Honor Stop Loss - No moving SL against the trade', 'Risk Management', true),
    ('USER_ID_HERE'::uuid, 3, 'Proper Position Sizing - Size based on SL distance, not conviction', 'Risk Management', true),
    ('USER_ID_HERE'::uuid, 4, 'Be Agile in Booking Profits - Don''t be greedy, book partial profits', 'Profit Taking', true),
    ('USER_ID_HERE'::uuid, 5, 'Never Let a Winner Turn into a Loser - Trail SL to breakeven', 'Profit Taking', true),
    ('USER_ID_HERE'::uuid, 6, 'Be Patient - Wait for Proper Entry - No FOMO trades', 'Discipline', true),
    ('USER_ID_HERE'::uuid, 7, 'Stick to Daily/Weekly/Monthly Targets - Stop when target achieved', 'Discipline', true)
ON CONFLICT DO NOTHING;

-- Step 4: Create some sample trading days
INSERT INTO public.trading_days (
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
    ('USER_ID_HERE'::uuid, CURRENT_DATE - INTERVAL '5 days', 100000, 102500, 2500, 5, 4, 1, 1200, -300, 80.00, 2.50, 'Confident', 'Market looks bullish, good volume in key stocks', true, (CURRENT_DATE - INTERVAL '5 days')::timestamptz + TIME '09:00:00', true),
    ('USER_ID_HERE'::uuid, CURRENT_DATE - INTERVAL '4 days', 102500, 103800, 1300, 4, 3, 1, 800, -200, 75.00, 1.27, 'Calm', 'Consolidation expected, trading only on breakouts', true, (CURRENT_DATE - INTERVAL '4 days')::timestamptz + TIME '09:00:00', true),
    ('USER_ID_HERE'::uuid, CURRENT_DATE - INTERVAL '3 days', 103800, 102900, -900, 6, 2, 4, 500, -450, 33.33, -0.87, 'Anxious', 'Volatile market, need to be careful', true, (CURRENT_DATE - INTERVAL '3 days')::timestamptz + TIME '09:00:00', true),
    ('USER_ID_HERE'::uuid, CURRENT_DATE - INTERVAL '2 days', 102900, 105100, 2200, 5, 4, 1, 1000, -200, 80.00, 2.14, 'Confident', 'Clear trend, good setups available', true, (CURRENT_DATE - INTERVAL '2 days')::timestamptz + TIME '09:00:00', true),
    ('USER_ID_HERE'::uuid, CURRENT_DATE - INTERVAL '1 day', 105100, 105000, -100, 3, 1, 2, 300, -400, 33.33, -0.10, 'Neutral', 'Choppy market, small positions only', true, (CURRENT_DATE - INTERVAL '1 day')::timestamptz + TIME '09:00:00', true)
ON CONFLICT DO NOTHING;

-- Step 5: Create sample trades
-- Get trading_day_id for each day and insert trades
WITH trading_day_ids AS (
    SELECT id, date FROM public.trading_days WHERE user_id = 'USER_ID_HERE'::uuid
)
INSERT INTO public.trades (
    user_id,
    trading_day_id,
    trade_date,
    trade_time,
    symbol,
    trade_type,
    quantity,
    entry_price,
    exit_price,
    pnl,
    is_winner,
    is_closed,
    broker,
    emotion_before,
    emotion_after,
    notes
)
SELECT
    'USER_ID_HERE'::uuid,
    td.id,
    td.date,
    '10:30:00'::time,
    'RELIANCE',
    'LONG',
    50,
    2450.00,
    2474.00,
    1200,
    true,
    true,
    'ZERODHA',
    'Confident',
    'Satisfied',
    'Perfect breakout trade. Followed the plan exactly.'
FROM trading_day_ids td WHERE td.date = CURRENT_DATE - INTERVAL '5 days'
UNION ALL
SELECT 'USER_ID_HERE'::uuid, td.id, td.date, '11:45:00'::time, 'TCS', 'LONG', 30, 3650.00, 3670.00, 600, true, true, 'ZERODHA', 'Planned', 'Satisfied', 'Clean entry and exit.' FROM trading_day_ids td WHERE td.date = CURRENT_DATE - INTERVAL '5 days'
UNION ALL
SELECT 'USER_ID_HERE'::uuid, td.id, td.date, '13:15:00'::time, 'INFY', 'LONG', 40, 1580.00, 1593.00, 520, true, true, 'ZERODHA', 'Confident', 'Satisfied', 'Good momentum trade.' FROM trading_day_ids td WHERE td.date = CURRENT_DATE - INTERVAL '5 days'
UNION ALL
SELECT 'USER_ID_HERE'::uuid, td.id, td.date, '14:30:00'::time, 'HDFC', 'SHORT', 25, 1650.00, 1656.00, -150, false, true, 'ZERODHA', 'FOMO', 'Regretful', 'Should have waited for confirmation.' FROM trading_day_ids td WHERE td.date = CURRENT_DATE - INTERVAL '5 days'
UNION ALL
SELECT 'USER_ID_HERE'::uuid, td.id, td.date, '15:00:00'::time, 'ICICIBANK', 'LONG', 35, 1120.00, 1129.00, 315, true, true, 'ZERODHA', 'Planned', 'Satisfied', 'End of day opportunity, booked quick profit.' FROM trading_day_ids td WHERE td.date = CURRENT_DATE - INTERVAL '5 days'
UNION ALL
SELECT 'USER_ID_HERE'::uuid, td.id, td.date, '10:15:00'::time, 'SBIN', 'LONG', 100, 585.00, 593.00, 800, true, true, 'GROWW', 'Calm', 'Satisfied', 'Patient entry paid off.' FROM trading_day_ids td WHERE td.date = CURRENT_DATE - INTERVAL '4 days'
UNION ALL
SELECT 'USER_ID_HERE'::uuid, td.id, td.date, '12:00:00'::time, 'AXISBANK', 'LONG', 40, 1045.00, 1050.00, 200, true, true, 'GROWW', 'Planned', 'Satisfied', 'Small gain, better than nothing.' FROM trading_day_ids td WHERE td.date = CURRENT_DATE - INTERVAL '4 days'
UNION ALL
SELECT 'USER_ID_HERE'::uuid, td.id, td.date, '14:30:00'::time, 'WIPRO', 'LONG', 60, 465.00, 462.00, -180, false, true, 'GROWW', 'Impulsive', 'Regretful', 'Broke my rule, entered without setup.' FROM trading_day_ids td WHERE td.date = CURRENT_DATE - INTERVAL '4 days'
UNION ALL
SELECT 'USER_ID_HERE'::uuid, td.id, td.date, '10:30:00'::time, 'TATAMOTORS', 'SHORT', 80, 750.00, 745.00, 400, true, true, 'ZERODHA', 'Anxious', 'Relieved', 'Lucky escape from a reversal.' FROM trading_day_ids td WHERE td.date = CURRENT_DATE - INTERVAL '3 days'
UNION ALL
SELECT 'USER_ID_HERE'::uuid, td.id, td.date, '11:30:00'::time, 'MARUTI', 'LONG', 15, 12500.00, 12480.00, -300, false, true, 'ZERODHA', 'Revenge', 'Frustrated', 'Revenge trading after first loss. Big mistake.' FROM trading_day_ids td WHERE td.date = CURRENT_DATE - INTERVAL '3 days'
UNION ALL
SELECT 'USER_ID_HERE'::uuid, td.id, td.date, '13:00:00'::time, 'BAJAJFINANCE', 'LONG', 10, 6850.00, 6820.00, -300, false, true, 'ZERODHA', 'Anxious', 'Frustrated', 'Market too choppy today.' FROM trading_day_ids td WHERE td.date = CURRENT_DATE - INTERVAL '3 days'
UNION ALL
SELECT 'USER_ID_HERE'::uuid, td.id, td.date, '10:00:00'::time, 'NIFTY', 'LONG', 75, 21500.00, 21540.00, 3000, true, true, 'GROWW', 'Confident', 'Satisfied', 'Perfect index trade. Big winner!' FROM trading_day_ids td WHERE td.date = CURRENT_DATE - INTERVAL '2 days'
UNION ALL
SELECT 'USER_ID_HERE'::uuid, td.id, td.date, '12:30:00'::time, 'BANKNIFTY', 'SHORT', 50, 45200.00, 45180.00, 1000, true, true, 'GROWW', 'Planned', 'Satisfied', 'Trend reversal caught perfectly.' FROM trading_day_ids td WHERE td.date = CURRENT_DATE - INTERVAL '2 days'
UNION ALL
SELECT 'USER_ID_HERE'::uuid, td.id, td.date, '10:45:00'::time, 'ASIANPAINT', 'LONG', 25, 2940.00, 2952.00, 300, true, true, 'ZERODHA', 'Neutral', 'Satisfied', 'Small but clean trade.' FROM trading_day_ids td WHERE td.date = CURRENT_DATE - INTERVAL '1 day'
UNION ALL
SELECT 'USER_ID_HERE'::uuid, td.id, td.date, '13:15:00'::time, 'SUNPHARMA', 'LONG', 50, 1580.00, 1572.00, -400, false, true, 'ZERODHA', 'Impulsive', 'Regretful', 'Entered too late in the move.' FROM trading_day_ids td WHERE td.date = CURRENT_DATE - INTERVAL '1 day'
ON CONFLICT DO NOTHING;

-- Display success message
SELECT 'Demo user data created successfully! Replace USER_ID_HERE with the actual UUID from auth.users table.' AS message;
