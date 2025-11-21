# Capital Game - Customization Guide

Want to tweak the game rules or appearance? This guide shows you how to customize Capital to your liking.

## 🎮 Game Rules Customization

All game constants are defined at the top of `game.js`. Here's what you can change:

### Board Configuration
```javascript
// Line 4-6 in game.js
const GRID_ROWS = 9;        // Change board height (default: 9)
const GRID_COLS = 13;       // Change board width (default: 13)
```

**Example:** Make a smaller 7x10 board:
```javascript
const GRID_ROWS = 7;
const GRID_COLS = 10;
```

### Starting Money
```javascript
// Line 9 in game.js
const START_MONEY = 20;     // Starting cash for each player (default: $20)
```

**Example:** Start with more money for longer games:
```javascript
const START_MONEY = 50;
```

### Property Costs & Rent
```javascript
// Lines 11-14 in game.js
const BUY_COST_LEVEL_1 = 5;      // Cost to buy property (default: $5)
const RENT_LEVEL_1 = 1;          // Rent for Level 1 (default: $1)
const ENHANCE_COST_LEVEL_2 = 10; // Cost to upgrade (default: $10)
const RENT_LEVEL_2 = 2;          // Rent for Level 2 (default: $2)
```

**Example:** Make properties more expensive:
```javascript
const BUY_COST_LEVEL_1 = 10;
const RENT_LEVEL_1 = 2;
const ENHANCE_COST_LEVEL_2 = 20;
const RENT_LEVEL_2 = 5;
```

### Ability Costs
```javascript
// Lines 15-16 in game.js
const COST_DIAGONAL = 20;   // Diagonal move ability (default: $20)
const COST_MODIFIER = 20;   // Dice modifier ability (default: $20)
```

**Example:** Make abilities cheaper:
```javascript
const COST_DIAGONAL = 10;
const COST_MODIFIER = 10;
```

### Dice Configuration
```javascript
// Line 8 in game.js
const DICE_SIDES = 6;       // Number of sides on dice (default: 6)
```

**Example:** Use a 10-sided die for more movement:
```javascript
const DICE_SIDES = 10;
```

### Action Cards (Cash Drops)
```javascript
// Lines 31-35 in game.js
const ACTION_CARDS = [
    { totalCash: 5, numTiles: 3, description: "Small Drop: $5 across 3 tiles." },
    { totalCash: 10, numTiles: 3, description: "Medium Drop: $10 across 3 tiles." },
    { totalCash: 20, numTiles: 5, description: "Large Drop: $20 across 5 tiles." }
];
```

**Example:** Add a mega jackpot card:
```javascript
const ACTION_CARDS = [
    { totalCash: 5, numTiles: 3, description: "Small Drop: $5 across 3 tiles." },
    { totalCash: 10, numTiles: 3, description: "Medium Drop: $10 across 3 tiles." },
    { totalCash: 20, numTiles: 5, description: "Large Drop: $20 across 5 tiles." },
    { totalCash: 50, numTiles: 10, description: "MEGA DROP: $50 across 10 tiles!" }
];
```

---

## 🎨 Visual Customization

### Color Scheme

Edit the CSS variables in `styles.css` (lines 5-30):

```css
:root {
    /* Primary Colors */
    --color-primary: #6366f1;        /* Main accent color */
    --color-primary-dark: #4f46e5;   /* Darker shade */
    --color-secondary: #8b5cf6;      /* Secondary accent */
    --color-success: #10b981;        /* Success/green */
    --color-warning: #f59e0b;        /* Warning/yellow */
    --color-danger: #ef4444;         /* Danger/red */
}
```

**Example:** Change to a green theme:
```css
:root {
    --color-primary: #10b981;
    --color-primary-dark: #059669;
    --color-secondary: #14b8a6;
}
```

### Player Colors
```javascript
// Lines 37-42 in game.js
const PLAYER_COLORS = [
    { id: 1, name: 'Red', hex: '#ef4444', text: 'text-red-600', bg: 'bg-red-500' },
    { id: 2, name: 'Blue', hex: '#3b82f6', text: 'text-blue-600', bg: 'bg-blue-500' },
    { id: 3, name: 'Green', hex: '#10b981', text: 'text-green-600', bg: 'bg-green-500' },
    { id: 4, name: 'Yellow', hex: '#f59e0b', text: 'text-yellow-600', bg: 'bg-yellow-500' }
];
```

**Example:** Add a 5th player (purple):
```javascript
const PLAYER_COLORS = [
    { id: 1, name: 'Red', hex: '#ef4444', text: 'text-red-600', bg: 'bg-red-500' },
    { id: 2, name: 'Blue', hex: '#3b82f6', text: 'text-blue-600', bg: 'bg-blue-500' },
    { id: 3, name: 'Green', hex: '#10b981', text: 'text-green-600', bg: 'bg-green-500' },
    { id: 4, name: 'Yellow', hex: '#f59e0b', text: 'text-yellow-600', bg: 'bg-yellow-500' },
    { id: 5, name: 'Purple', hex: '#a855f7', text: 'text-purple-600', bg: 'bg-purple-500' }
];
```

Then update the setup screen in `index.html` to add a "5 Players" button:
```html
<button onclick="startGame(5)" class="player-btn" data-players="5">
    <span class="player-count">5</span>
    <span class="player-label">Players</span>
</button>
```

And add the CSS utility classes in `styles.css`:
```css
.text-purple-600 { color: #a855f7; }
.bg-purple-500 { background-color: #a855f7; }
```

### Tile Colors
```css
/* Lines 22-29 in styles.css */
--tile-property: #f8fafc;
--tile-level-1: #fef08a;
--tile-level-2: #fcd34d;
--tile-bank: #15803d;
--tile-store: #9333ea;
--tile-subway: #374151;
--tile-city-center: #10b981;
--tile-street: #d1d5db;
```

### Fonts
```html
<!-- Line 21 in index.html -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
```

**Example:** Use different fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
```

Then update CSS:
```css
body {
    font-family: 'Poppins', sans-serif;
}

.game-title, .header-title {
    font-family: 'Montserrat', sans-serif;
}
```

---

## 🏗️ Advanced Customization

### Add More Special Tiles

1. **Define new tile type** in `game.js`:
```javascript
// Add to special tiles section (around line 25)
const CASINO_TILES = [10, 20, 30]; // Example positions
```

2. **Update board initialization** (around line 120):
```javascript
if (i === CENTER_INDEX) {
    type = 'city_center';
} else if (BANK_TILES.includes(i)) {
    type = 'bank';
} else if (STORE_TILES.includes(i)) {
    type = 'store';
} else if (CASINO_TILES.includes(i)) {
    type = 'casino'; // NEW
} else if (SUBWAY_TILES.includes(i)) {
    type = 'subway';
}
```

3. **Add tile styling** in `styles.css`:
```css
.tile-casino {
    background: #dc2626;
    color: #fef2f2 !important;
    border: 3px solid #fcd34d;
    font-weight: 700;
}
```

4. **Add tile logic** in `handleLanding()` function:
```javascript
else if (tile.type === 'casino') {
    // Roll dice, win or lose money
    const roll = rollDie();
    if (roll >= 4) {
        const winnings = 10;
        player.money += winnings;
        logMessage += `🎰 ${player.name} won $${winnings} at the Casino!`;
    } else {
        const loss = 5;
        player.money -= loss;
        logMessage += `🎰 ${player.name} lost $${loss} at the Casino!`;
    }
}
```

### Change Interest Rate System

Find `applyInterestAndCheckDebt()` function (around line 700):

**Current:** Progressive (1%, 2%, 3%...)
```javascript
const interestPercent = player.debtRounds;
```

**Option 1:** Fixed rate (5% always)
```javascript
const interestPercent = 5;
```

**Option 2:** Compound interest
```javascript
const interestPercent = Math.min(player.debtRounds * 2, 25); // Doubles each round, max 25%
```

### Add Sound Effects

1. **Download sound files** (MP3 or WAV)
   - dice-roll.mp3
   - buy-property.mp3
   - pay-rent.mp3
   - bankrupt.mp3

2. **Add to project folder**

3. **Create audio manager** in `game.js`:
```javascript
const sounds = {
    roll: new Audio('dice-roll.mp3'),
    buy: new Audio('buy-property.mp3'),
    rent: new Audio('pay-rent.mp3'),
    bankrupt: new Audio('bankrupt.mp3')
};

function playSound(soundName) {
    if (sounds[soundName]) {
        sounds[soundName].currentTime = 0;
        sounds[soundName].play();
    }
}
```

4. **Add sound calls**:
```javascript
// In rollAndMove()
playSound('roll');

// In buyProperty()
playSound('buy');

// In handleLanding() when paying rent
playSound('rent');

// In declareBankrupt()
playSound('bankrupt');
```

### Add Animations

Add to `styles.css`:

```css
/* Dice roll animation */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px) rotate(-5deg); }
    75% { transform: translateX(5px) rotate(5deg); }
}

.btn-primary:active {
    animation: shake 0.3s ease-in-out;
}

/* Property purchase celebration */
@keyframes celebrate {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1) rotate(5deg); }
}

.tile.purchased {
    animation: celebrate 0.5s ease-in-out;
}
```

---

## 🧪 Testing Your Changes

After making changes:

1. **Save all files**
2. **Refresh browser** (Ctrl+Shift+R or Cmd+Shift+R)
3. **Check console** for errors (F12 → Console)
4. **Test gameplay** thoroughly
5. **Try edge cases** (bankruptcy, teleport, etc.)

---

## 💾 Version Control

Before making major changes, create a backup:

```bash
# Copy entire folder
cp -r Capital Capital-backup

# Or use Git
git init
git add .
git commit -m "Initial version"
```

After changes:
```bash
git add .
git commit -m "Describe your changes"
```

---

## 📚 Common Customization Recipes

### Recipe 1: Fast-Paced Game
```javascript
const START_MONEY = 50;
const BUY_COST_LEVEL_1 = 3;
const ENHANCE_COST_LEVEL_2 = 5;
const RENT_LEVEL_2 = 5;
const DICE_SIDES = 8;
```

### Recipe 2: Strategic Long Game
```javascript
const START_MONEY = 100;
const BUY_COST_LEVEL_1 = 15;
const ENHANCE_COST_LEVEL_2 = 30;
const RENT_LEVEL_2 = 10;
const COST_DIAGONAL = 50;
```

### Recipe 3: Chaos Mode
```javascript
const DICE_SIDES = 12;
const ACTION_CARDS = [
    { totalCash: 50, numTiles: 10, description: "MEGA DROP!" },
    { totalCash: 100, numTiles: 20, description: "JACKPOT!" }
];
```

---

## 🔧 Troubleshooting

**Game breaks after changes:**
1. Check browser console for errors
2. Verify all brackets/parentheses match
3. Ensure variable names are consistent
4. Restore from backup if needed

**Styling doesn't update:**
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Check CSS syntax
4. Verify CSS file is linked correctly

---

## 🎉 Share Your Customizations!

Created something cool? Share it with the community!

1. Fork the project on GitHub
2. Make your changes
3. Create a pull request
4. Add screenshots/description

---

Happy customizing! 🎨🎮
