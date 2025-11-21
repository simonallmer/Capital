# Capital (Prototype)

A modern, dynamic Monopoly-style board game with multi-directional movement, banks, stores, and strategic gameplay.

## 🎮 Features

### Core Gameplay
- **9x13 Grid Board** - 117 tiles with diverse property types
- **Multi-Directional Movement** - Move in 8 directions (with diagonal upgrade)
- **Dynamic Turn-Based Play** - 2-4 players in local hotseat mode
- **Progressive Interest System** - Debt grows at 1%, 2%, 3%... each round
- **Action Cards** - Random cash drops across the board from City Center

### Special Tiles
- **🏦 Banks** - Borrow money or repay debt
- **🏪 Stores** - Purchase permanent abilities
- **🚇 Subway Stations** - Optional teleport to major destinations
- **🌳 City Center** - Trigger action cards for cash distribution
- **🏠 Properties** - Buy and enhance for rental income

### Abilities
- **Diagonal Movement** - Unlock 4 additional movement directions ($20)
- **Dice Modifier** - Adjust your roll by ±1 after seeing the result ($20)

### Win Conditions
- Be the last player standing
- Drive opponents into bankruptcy through strategic property ownership

## 🚀 Getting Started

### Local Development

1. **Clone or download** this repository
2. **Open `index.html`** in a modern web browser
3. **Select player count** (2-4 players)
4. **Start playing!**

### Hosting Online

#### Option 1: GitHub Pages
1. Create a new GitHub repository
2. Upload all files (`index.html`, `styles.css`, `game.js`)
3. Go to Settings → Pages
4. Select main branch as source
5. Your game will be live at `https://yourusername.github.io/capital`

#### Option 2: Netlify
1. Drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop)
2. Get instant hosting with a custom URL

#### Option 3: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

#### Option 4: Simple HTTP Server
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server
```

Then visit `http://localhost:8000`

## 🎯 How to Play

### Setup
1. All players start at the **City Center** (Tile 58)
2. Each player receives **$20** starting money
3. The bank starts with total player funds

### Turn Structure
1. **Choose Direction** - Select from available movement directions
2. **Roll Dice** - Roll a 6-sided die (modify if you have the ability)
3. **Move** - Travel in chosen direction for rolled steps
4. **Land Action** - Interact with the tile you land on
5. **End Turn** - Pass to next player

### Tile Actions

#### Properties
- **Unowned**: Buy for $5 (Level 1, $1 rent)
- **Your Property**: Enhance for $10 (Level 2, $2 rent)
- **Opponent's Property**: Pay rent or go bankrupt

#### Banks
- **Borrow**: Take money from the bank (1% interest first round)
- **Repay**: Pay back debt to avoid increasing interest
- **Critical Debt**: At 25% interest, you must repay or face bankruptcy

#### Stores
- **Diagonal Move**: Unlock diagonal movement ($20)
- **Dice Modifier**: Adjust rolls by ±1 ($20)

#### Subway Stations
- **Optional Teleport**: Choose to jump to any other subway or City Center, or stay
- **Collect Cash**: Pick up any cash drops at destination
- **Strategic Choice**: Use to escape expensive areas or stay put

#### City Center
- **Action Card**: Randomly distributes $5-$20 across 3-5 properties
- **Safe Zone**: No rent, no penalties

### Bankruptcy
You go bankrupt if:
- You can't pay rent to another player
- Interest charges drop you below $0
- You fail to repay debt during the 25% critical grace round

## 🎨 Design Features

- **Dark Theme** - Modern, eye-friendly interface
- **Smooth Animations** - Polished micro-interactions
- **Responsive Layout** - Works on desktop and mobile
- **Real-time Updates** - Live game log and player stats
- **Visual Feedback** - Color-coded tiles and player tokens

## 🛠️ Technical Stack

- **HTML5** - Semantic structure
- **CSS3** - Custom design system with CSS variables
- **Vanilla JavaScript** - No dependencies, pure ES6+
- **Google Fonts** - Inter & Outfit typefaces

## 📝 Game Rules Summary

### Money Management
- Starting money: $20
- Buy property: $5 (Level 1)
- Enhance property: $10 (Level 2)
- Rent Level 1: $1
- Rent Level 2: $2
- Abilities: $20 each

### Debt System
- Interest starts at 1% per round
- Increases by 1% each round (2%, 3%, 4%...)
- At 25%, you get one grace round to repay
- Failure to repay = instant bankruptcy

### Movement
- Standard: 4 directions (up, down, left, right)
- With Diagonal: 8 directions
- Dice: 1-6 (modifiable with ability)
- Boundaries: Can't move off the grid

## 🎮 Strategy Tips

1. **Control the Center** - Properties near City Center get more traffic
2. **Manage Debt Carefully** - Interest compounds quickly
3. **Invest in Abilities Early** - Diagonal movement opens strategic options
4. **Block Opponents** - Create property walls to force rent payments
5. **Use Subways Wisely** - Teleport to avoid expensive properties

## 📄 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Feel free to fork, modify, and enhance the game! Some ideas:
- Add more tile types
- Implement online multiplayer
- Create custom board layouts
- Add sound effects and music
- Develop AI opponents

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Enjoy playing Capital!** 🎲🏠💰
