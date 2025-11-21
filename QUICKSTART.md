# 🎮 Capital - Quick Start Guide

Get playing in 2 minutes!

## 🚀 Play Locally (Right Now!)

1. **Open the game**
   - Double-click `index.html`
   - OR right-click → Open with → Your browser

2. **Select players**
   - Choose 2, 3, or 4 players
   - Click the button

3. **Start playing!**
   - All players start at City Center (middle of board)
   - Red player goes first

## 🎯 Quick Rules

### Your Turn (4 Steps)
1. **Pick direction** - Click arrow (↑ ↓ ← →)
2. **Roll dice** - Click "Roll & Move"
3. **Take action** - Buy property, use bank, etc.
4. **End turn** - Click "Next Turn"

### How to Win
**Be the last player with money!**

### Tile Types
- **🏠 Property** - Buy for $5, upgrade for $10
- **🏦 Bank** - Borrow or repay money
- **🏪 Store** - Buy special abilities ($20 each)
- **🚇 Subway** - Optional teleport to escape or explore
- **🌳 City Center** - Get random cash drops

### Money Rules
- **Start:** $20
- **Buy property:** $5 (earns $1 rent)
- **Upgrade:** $10 (earns $2 rent)
- **Land on opponent's property:** Pay rent
- **Run out of money:** You're bankrupt!

### Debt Warning ⚠️
- Borrow from bank = 1% interest first round
- Interest grows: 2%, 3%, 4%... each round
- At 25% = Must repay or go bankrupt!

## 🎮 Pro Tips

1. **Buy properties early** - They generate income
2. **Avoid debt** - Interest adds up fast!
3. **Use subway strategically** - Escape expensive areas
4. **Buy diagonal movement** - More options = better strategy
5. **Control the center** - High traffic = more rent

## 📱 Play on Mobile

Works great on phones/tablets!
- Tap instead of click
- Pinch to zoom board
- Add to home screen for app-like experience

## 🌐 Play Online

Want to share with friends?

**Easiest way:**
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire Capital folder
3. Share the URL you get!

**More options:** See `DEPLOYMENT.md`

## ❓ Need Help?

- **Game rules:** See `README.md`
- **Customization:** See `CUSTOMIZATION.md`
- **Hosting online:** See `DEPLOYMENT.md`

## 🎲 Example First Turn

**Red Player's Turn:**
1. Direction: Up (↑) is selected by default
2. Click "Roll & Move" → Rolls 4
3. Moves 4 tiles up from City Center
4. Lands on property → Click "Buy ($5)"
5. Property is now Red's (earns $1 when others land)
6. Click "Next Turn"

**Blue Player's Turn:**
1. Select direction: Right (→)
2. Click "Roll & Move" → Rolls 3
3. Moves 3 tiles right
4. Lands on Red's property → Pays $1 rent automatically
5. Turn auto-advances to Red

## 🏆 Winning Strategy

**Early Game (Rounds 1-5):**
- Buy cheap properties
- Avoid debt
- Save for abilities

**Mid Game (Rounds 6-15):**
- Upgrade key properties
- Buy diagonal movement
- Block opponents

**Late Game (Rounds 16+):**
- Force opponents into your properties
- Use subway to avoid their properties
- Manage debt carefully

## 🎨 Customize Your Game

Want different rules? Edit `game.js`:

```javascript
// Line 9 - Starting money
const START_MONEY = 20;  // Change to 50 for easier game

// Line 11 - Property cost
const BUY_COST_LEVEL_1 = 5;  // Change to 10 for harder game

// Line 8 - Dice sides
const DICE_SIDES = 6;  // Change to 10 for more movement
```

Save and refresh browser!

## 🐛 Troubleshooting

**Game won't start:**
- Make sure all files are in same folder
- Try different browser (Chrome, Firefox, Safari)
- Check browser console (F12) for errors

**Looks broken:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Ensure `styles.css` is in same folder

**Can't click buttons:**
- Wait for page to fully load
- Check if JavaScript is enabled
- Try incognito/private mode

## 📊 Game Stats

- **Board size:** 9 rows × 13 columns = 117 tiles
- **Property tiles:** ~80
- **Special tiles:** 7 (2 banks, 2 stores, 3 subways, 1 city center)
- **Average game time:** 15-30 minutes
- **Players:** 2-4 (expandable to 5+)

## 🎉 Have Fun!

Capital is designed to be:
- ✅ Easy to learn
- ✅ Quick to play
- ✅ Strategic and fun
- ✅ Playable anywhere

**Ready? Click `index.html` and start playing!** 🚀

---

Made with ❤️ for board game enthusiasts
