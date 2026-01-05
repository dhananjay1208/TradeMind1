# TradeMind - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Start the App
```bash
npm run dev
```

### Step 2: Open Your Browser
Go to: **http://localhost:3000**

### Step 3: Create Your Account
1. Click "Sign Up"
2. Enter your email, password, and name
3. Click "Create Account"

---

## 📋 First-Time Setup (Onboarding)

You'll go through a 4-step wizard:

### Step 1: Profile
- **Full Name:** Your name
- **Starting Capital:** ₹100,000 (or your amount)
- Click "Next"

### Step 2: Risk Limits
- **Max Daily Loss:** ₹5,000 (max you're willing to lose per day)
- **Max Loss Per Trade:** ₹1,000 (max per single trade)
- **Max Trades Per Day:** 10 (to avoid overtrading)
- Click "Next"

### Step 3: Trading Rules
- Review the 7 default rules
- Check/uncheck rules you want active
- Edit any rule by clicking "Edit"
- Reorder with up/down arrows
- Click "Next"

### Step 4: Goals
- **Daily Target:** ₹3,000
- **Weekly Target:** ₹15,000
- **Monthly Target:** ₹50,000
- Click "Finish"

✅ **You're all set!** You'll be redirected to the dashboard.

---

## 🏠 Using the Dashboard (Home Screen)

### Morning Ritual (Before Trading)

1. **Read the Quote** - Get motivated!

2. **Check All Rules** - Click each checkbox to acknowledge your trading rules

3. **Review Risk Limits** - See your max daily loss and other limits

4. **Select Your Mood** - How are you feeling today?
   - 😊 Confident
   - 😐 Neutral
   - 😰 Anxious
   - 😤 Aggressive
   - 🧘 Calm

5. **Add Market Notes** (Optional) - Any observations about today's market

6. **Click "I Am Ready to Trade"** - This starts your trading day!

### During Trading

After you click "I Am Ready to Trade", you'll see:

- **Today's P&L Card** - Your profit/loss in real-time
- **Risk Meter** - How much of your daily loss limit you've used
  - Green (0-50%) = Safe
  - Yellow (50-75%) = Caution
  - Red (75-100%) = Danger!
- **Target Progress** - How close you are to your daily goal
- **Quick Stats** - Trades, wins, losses, hit ratio

---

## 📝 Logging Trades (Journal)

### Desktop:
1. Click "Journal" in the header
2. Fill in the trade entry form on the left
3. Click "Save Trade"

### Mobile:
1. Tap "Journal" in the bottom nav
2. Tap "Add Trade" tab
3. Fill in the form
4. Tap "Save Trade"

### Trade Entry Fields:

**Required:**
- **Date** - Trade date (defaults to today)
- **Time** - When you entered (e.g., 10:30)
- **Symbol** - Stock name (e.g., RELIANCE, NIFTY)
  - Start typing for suggestions!
- **Type** - LONG or SHORT
- **Quantity** - Number of shares (e.g., 100)
- **Entry Price** - Your buy/sell price
- **Exit Price** - Your exit price
- **Broker** - Zerodha, Groww, or Other

**Optional but Recommended:**
- **Emotion Before** - How did you feel entering?
- **Emotion After** - How did you feel after?
- **Notes** - What did you learn?

**Auto-Calculated:**
- **P&L** - Calculated automatically based on type:
  - LONG: (Exit - Entry) × Quantity
  - SHORT: (Entry - Exit) × Quantity

### Example Trade:
```
Date: Jan 05, 2026
Time: 10:30
Symbol: RELIANCE
Type: LONG
Quantity: 50
Entry: 2,450.00
Exit: 2,478.50
Broker: Zerodha
Emotion Before: Planned
Emotion After: Satisfied
Notes: Perfect breakout trade. Followed my entry rule.

→ P&L: ₹1,425 ✅
```

---

## 📅 Calendar View

### View Your Trading Month

1. Click "Calendar" in the header
2. See your entire month at a glance:
   - **Green days** = Profitable
   - **Red days** = Losses
   - **Gray days** = Breakeven
   - **White days** = No trading

3. **Click any day** to see:
   - All trades for that day
   - Day summary (total P&L, wins, losses)
   - Your pre-market mood
   - Your market notes

4. **Navigate months:**
   - ← Previous month
   - Today (jump to current month)
   - Next month →

---

## 📊 Analytics Dashboard

### View Your Performance

1. Click "Analytics" in the header

2. **Overview Tab** shows:
   - P&L summary (Today, Week, Month, All Time)
   - Statistics (Hit ratio, Avg profit/loss, Risk-reward)
   - Charts (Equity curve, Daily P&L)
   - Your best/worst days and trades

3. **Detailed Stats Tab** shows:
   - Complete statistics table
   - Compare across time periods

4. **Filter by Date Range:**
   - All Time (default)
   - Last 30 Days
   - Last 90 Days
   - Last 180 Days

---

## ⚙️ Settings

### Update Your Configuration

1. Click "Settings" in the header
2. Choose a tab:

**Profile:**
- Update your name
- Adjust starting capital
- Click "Save Profile"

**Risk:**
- Change max daily loss
- Change max loss per trade
- Change max trades per day
- Click "Save Risk Limits"

**Rules:**
- Toggle rules on/off
- Edit rule text
- Reorder with ↑ ↓ buttons
- Add new rule
- Delete rules
- Click "Save Rules"

**Goals:**
- Update daily target
- Update weekly target
- Update monthly target
- Click "Save Goals"

**Security:**
- Change your password
- Enter new password (6+ characters)
- Confirm new password
- Click "Change Password"

---

## 🌙 Dark Mode

Click the sun/moon icon in the header to toggle:
- ☀️ Light mode
- 🌙 Dark mode
- 💻 System (follows your OS setting)

---

## 📱 Mobile App

TradeMind is fully mobile-responsive!

**Navigation:**
- Bottom bar with 5 icons:
  - 🏠 Dashboard
  - 📝 Journal
  - 📅 Calendar
  - 📊 Analytics
  - ⚙️ Settings

**Tips for Mobile:**
- Swipe to navigate calendar months
- Tap any card to expand details
- Forms are optimized for touch
- All features work the same as desktop

---

## 🎯 Daily Workflow Example

### Morning (9:00 AM):
1. Open TradeMind
2. Read motivational quote
3. Check all trading rules
4. Select mood: 😊 Confident
5. Add note: "Bank Nifty looks bullish"
6. Click "I Am Ready to Trade"

### During Market (9:30 AM - 3:30 PM):
1. Execute trades as per your strategy
2. After each trade, log it in Journal
3. Monitor risk meter on Dashboard
4. Get alerts if approaching limits

### Evening (4:00 PM):
1. Review Calendar - see today's result
2. Check Analytics - view hit ratio trend
3. Update Notes in trades with learnings

### Weekly (Sunday):
1. Review Calendar for the week
2. Check Analytics for weekly P&L
3. Adjust Goals/Rules if needed in Settings

---

## 🚨 Alerts & Notifications

You'll receive automatic toast notifications for:

- ⚠️ **50% Risk Limit** - "You've used 50% of your daily loss limit. Trade carefully!"
- 🚨 **75% Risk Limit** - "Caution! 75% of daily loss limit reached."
- 🛑 **100% Risk Limit** - "STOP TRADING! Daily loss limit exceeded."
- 🎉 **Target Achieved** - "Congratulations! You've reached your daily profit target!"

---

## 💡 Pro Tips

### Discipline:
- ✅ Always complete the morning ritual
- ✅ Log trades immediately after closing
- ✅ Review your calendar weekly
- ✅ Update your learnings in notes

### Risk Management:
- ✅ Never ignore the risk meter
- ✅ Stop trading when you hit your daily loss limit
- ✅ Adjust limits based on your capital

### Performance:
- ✅ Focus on hit ratio, not just P&L
- ✅ Review your worst trades to learn
- ✅ Track emotional patterns
- ✅ Set realistic, achievable goals

### Analytics:
- ✅ Use the equity curve to spot trends
- ✅ Check which days of the week you perform best
- ✅ Monitor your risk-reward ratio
- ✅ Aim for consistency over big wins

---

## ❓ Common Questions

**Q: Can I edit a trade after saving?**
A: Yes! Click the trade in Journal, then click "Edit" in the detail modal.

**Q: Can I delete a trade?**
A: Yes! Click the trade, then "Delete" in the detail modal. Confirm to delete.

**Q: What if I forget to do the morning ritual?**
A: You can still access all features, but the ritual helps build discipline!

**Q: Can I change my starting capital later?**
A: Yes! Go to Settings → Profile → Update Starting Capital.

**Q: What's the difference between starting capital and current capital?**
A: Starting capital is your initial amount. Current capital includes all your profits/losses.

**Q: Can I export my data?**
A: Not in Phase 1, but Excel/PDF export is coming in Phase 2!

**Q: Can I connect to Zerodha automatically?**
A: Not yet! Zerodha API integration is planned for Phase 2.

---

## 🎓 Learn More

- Read the full **README.md** for detailed feature explanations
- Check **DEPLOYMENT_GUIDE.md** to deploy your own instance
- Review **IMPLEMENTATION_SUMMARY.md** for technical details

---

**Happy Trading! 📈**

Remember: *"Discipline is the bridge between trading goals and trading results."*
