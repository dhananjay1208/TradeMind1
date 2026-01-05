-- Function to automatically update trading_day statistics
-- This function should be called whenever trades are inserted, updated, or deleted
-- to keep the trading_day statistics in sync

CREATE OR REPLACE FUNCTION update_trading_day_stats(day_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_pnl DECIMAL(15,2);
  v_total_trades INTEGER;
  v_winning_trades INTEGER;
  v_losing_trades INTEGER;
  v_max_profit DECIMAL(15,2);
  v_max_loss DECIMAL(15,2);
  v_hit_ratio DECIMAL(5,2);
  v_opening_capital DECIMAL(15,2);
  v_roi_percent DECIMAL(5,2);
BEGIN
  -- Get opening capital for this day
  SELECT opening_capital INTO v_opening_capital
  FROM trading_days
  WHERE id = day_id;

  -- Calculate statistics from trades
  SELECT
    COALESCE(SUM(pnl), 0),
    COUNT(*),
    COUNT(*) FILTER (WHERE is_winner = true),
    COUNT(*) FILTER (WHERE is_winner = false),
    COALESCE(MAX(pnl) FILTER (WHERE pnl > 0), 0),
    COALESCE(MIN(pnl) FILTER (WHERE pnl < 0), 0)
  INTO
    v_total_pnl,
    v_total_trades,
    v_winning_trades,
    v_losing_trades,
    v_max_profit,
    v_max_loss
  FROM trades
  WHERE trading_day_id = day_id
    AND is_closed = true;

  -- Calculate hit ratio
  IF v_total_trades > 0 THEN
    v_hit_ratio := (v_winning_trades::DECIMAL / v_total_trades::DECIMAL) * 100;
  ELSE
    v_hit_ratio := 0;
  END IF;

  -- Calculate ROI percentage
  IF v_opening_capital > 0 THEN
    v_roi_percent := (v_total_pnl / v_opening_capital) * 100;
  ELSE
    v_roi_percent := 0;
  END IF;

  -- Update trading_day record
  UPDATE trading_days
  SET
    total_pnl = v_total_pnl,
    total_trades = v_total_trades,
    winning_trades = v_winning_trades,
    losing_trades = v_losing_trades,
    max_profit = v_max_profit,
    max_loss = v_max_loss,
    hit_ratio = v_hit_ratio,
    roi_percent = v_roi_percent,
    closing_capital = v_opening_capital + v_total_pnl,
    updated_at = NOW()
  WHERE id = day_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_trading_day_stats(UUID) TO authenticated;

-- Comment on function
COMMENT ON FUNCTION update_trading_day_stats IS 'Updates trading day statistics based on associated trades';
