// ===================================
// GLOBAL VARIABLES & CONFIGURATION
// ===================================
const GRID_ROWS = 9;
const GRID_COLS = 13;
const TOTAL_TILES = GRID_ROWS * GRID_COLS; // 117

const DICE_SIDES = 6;
const START_MONEY = 20;

const BUY_COST_LEVEL_1 = 5;
const RENT_LEVEL_1 = 1;
const ENHANCE_COST_LEVEL_2 = 10;
const RENT_LEVEL_2 = 2;
const COST_DIAGONAL = 20;
const COST_MODIFIER = 20;
const COST_PROPERTY_LINK = 5;
const COST_SUBWAY = 20;
const COST_SUBWAY_CENTER = 30;
const SUBWAY_FEE = 1;

// Center Definition for 9x13 grid
const CENTER_ROW = 4; // (9 / 2)
const CENTER_COL = 6; // (13 / 2)
const CENTER_INDEX = CENTER_ROW * GRID_COLS + CENTER_COL; // 58 (City Center)

// Special Tile Definitions
const BANK_TILES = [0, TOTAL_TILES - 1];
const STORE_TILES = [GRID_COLS - 1, (GRID_ROWS - 1) * GRID_COLS];

const SUBWAY_TILES = [
    CENTER_COL,
    (GRID_ROWS - 1) * GRID_COLS + CENTER_COL,
    CENTER_ROW * GRID_COLS,
    CENTER_ROW * GRID_COLS + (GRID_COLS - 1)
];

const MAJOR_DESTINATIONS = [...SUBWAY_TILES, CENTER_INDEX];

// City Center Action Cards (Cash Drop)
const ACTION_CARDS = [
    { totalCash: 5, numTiles: 3, description: "Small Drop: $5 dropped across 3 random property tiles." },
    { totalCash: 10, numTiles: 3, description: "Medium Drop: $10 dropped across 3 random property tiles." },
    { totalCash: 20, numTiles: 5, description: "Large Drop: $20 dropped across 5 random property tiles." }
];

const PLAYER_COLORS = [
    { id: 1, name: 'Red', hex: '#ef4444', text: 'text-red-600', bg: 'bg-red-500' },
    { id: 2, name: 'Blue', hex: '#3b82f6', text: 'text-blue-600', bg: 'bg-blue-500' },
    { id: 3, name: 'Green', hex: '#10b981', text: 'text-green-600', bg: 'bg-green-500' },
    { id: 4, name: 'Yellow', hex: '#f59e0b', text: 'text-yellow-600', bg: 'bg-yellow-500' }
];

// Token positioning for multiple players on a single tile
const TOKEN_POSITIONS = [
    { bottom: '2px', right: '2px', z: 10 },
    { top: '2px', right: '2px', z: 10 },
    { bottom: '2px', left: '2px', z: 10 },
    { top: '2px', left: '2px', z: 10 }
];

const MOVE_DIRECTIONS = {
    'up': { dr: -1, dc: 0, symbol: '↑' },
    'down': { dr: 1, dc: 0, symbol: '↓' },
    'left': { dr: 0, dc: -1, symbol: '←' },
    'right': { dr: 0, dc: 1, symbol: '→' },
    'up-left': { dr: -1, dc: -1, symbol: '↖' },
    'up-right': { dr: -1, dc: 1, symbol: '↗' },
    'down-left': { dr: 1, dc: -1, symbol: '↙' },
    'down-right': { dr: 1, dc: 1, symbol: '↘' }
};

let gameState = null;
let hasRolled = false;
let rollResult = 0;
let modifierActive = false;

const elements = {
    setupOverlay: document.getElementById('setup-overlay'),
    gameContainer: document.getElementById('game-container'),
    turnIndicator: document.getElementById('turn-indicator'),
    rollMoveBtn: document.getElementById('roll-move-btn'),
    diceModifierBtn: document.getElementById('dice-modifier-btn'),
    lastRoll: document.getElementById('last-roll'),
    buyPropertyBtn: document.getElementById('buy-property-btn'),
    specialActionBtn: document.getElementById('special-action-btn'),
    nextTurnBtn: document.getElementById('next-turn-btn'),
    board: document.getElementById('board'),
    playerCardsContainer: document.getElementById('player-cards-container'),
    bankMoney: document.getElementById('bank-money'),
    gameLog: document.getElementById('game-log'),
    directionalControls: document.getElementById('directional-controls'),
    modal: document.getElementById('generic-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalMessage: document.getElementById('modal-message'),
    modalCustomContent: document.getElementById('modal-custom-content'),
    modalInputContainer: document.getElementById('modal-input-container'),
    modalInput: document.getElementById('modal-input'),
    modalCancelBtn: document.getElementById('modal-cancel-btn'),
    modalConfirmBtn: document.getElementById('modal-confirm-btn'),
    tradeBtn: document.getElementById('trade-btn'),
};

// ===================================
// UTILITIES
// ===================================

window.closeModal = () => {
    elements.modal.classList.add('hidden');

    elements.modalCustomContent.innerHTML = '';
    elements.modalCustomContent.classList.add('hidden');
    elements.modalInputContainer.classList.add('hidden');
    elements.modalInput.value = '';

    elements.modalConfirmBtn.classList.add('hidden');
    elements.modalCancelBtn.classList.remove('hidden');
    elements.modalCancelBtn.textContent = 'Cancel';
    elements.modalCancelBtn.onclick = closeModal;
};

const showModal = (title, message, isInput = false, confirmCallback = null, customContentHtml = null) => {
    closeModal();

    elements.modalTitle.textContent = title;
    elements.modalMessage.innerHTML = message;

    elements.modalCancelBtn.textContent = 'Close';
    elements.modalCancelBtn.onclick = closeModal;

    if (customContentHtml) {
        elements.modalCustomContent.innerHTML = customContentHtml;
        elements.modalCustomContent.classList.remove('hidden');
    }

    if (isInput) {
        elements.modalInputContainer.classList.remove('hidden');
        elements.modalCancelBtn.textContent = 'Cancel';
    }

    if (confirmCallback) {
        elements.modalConfirmBtn.classList.remove('hidden');
        elements.modalConfirmBtn.textContent = 'Confirm';
        elements.modalConfirmBtn.onclick = () => {
            confirmCallback(isInput ? parseFloat(elements.modalInput.value) : null);
            closeModal();
        };
    }

    elements.modal.classList.remove('hidden');
};

const rollDie = () => {
    return Math.floor(Math.random() * DICE_SIDES) + 1;
};

const getGridCoords = (index) => {
    const row = Math.floor(index / GRID_COLS);
    const col = index % GRID_COLS;
    return { row, col };
};

const getIndexFromCoords = (row, col) => {
    if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) {
        return -1;
    }
    return row * GRID_COLS + col;
};



// ===================================
// GAME SETUP AND START
// ===================================

const initializeGame = (playerCount) => {
    const initialBankMoney = playerCount * START_MONEY;

    const initialBoard = Array.from({ length: TOTAL_TILES }, (_, i) => {
        const { row, col } = getGridCoords(i);
        let type = 'property';
        let isStreetAxis = (col === CENTER_COL || row === CENTER_ROW);

        if (i === CENTER_INDEX) {
            type = 'city_center';
        } else if (BANK_TILES.includes(i)) {
            type = 'bank';
        } else if (STORE_TILES.includes(i)) {
            type = 'store';
        } else if (SUBWAY_TILES.includes(i)) {
            type = 'subway';
        } else if (isStreetAxis) {
            type = 'street_segment';
        }

        return {
            id: i,
            owner: 0,
            level: 0,
            fee: 0,
            cashDrop: 0,
            type,
            hasPropertyLink: false,
            earnings: 0,
        };
    });

    const activePlayerTemplates = PLAYER_COLORS.slice(0, playerCount);

    const initialPlayers = activePlayerTemplates.map((p) => ({
        id: p.id,
        name: p.name,
        money: START_MONEY,
        position: CENTER_INDEX,
        color: p.hex,
        isBankrupt: false,
        debt: 0,
        debtRounds: 0,
        isGraceRound: false,
        hasDiagonalMove: false,
        hasDiceModifier: false,
        propertyLinks: 0,
    }));

    gameState = {
        players: initialPlayers,
        bankMoney: initialBankMoney,
        board: initialBoard,
        currentPlayerIndex: 0,
        isGameRunning: true,
        setupPhase: 'playing',
        gameLog: [{ time: Date.now(), message: `🎮 Game started with ${playerCount} players. All players start at the City Center (Tile ${CENTER_INDEX}).` }]
    };

    hasRolled = false;
    rollResult = 0;
    modifierActive = false;
};

window.startGame = (playerCount) => {
    initializeGame(playerCount);
    elements.setupOverlay.classList.add('hidden');
    elements.gameContainer.classList.remove('hidden');
    syncGameState();
};

const declareBankrupt = (player, reason) => {
    if (player.isBankrupt) return;

    player.isBankrupt = true;
    player.money = 0;
    player.debt = 0;
    player.debtRounds = 0;
    player.isGraceRound = false;

    gameState.board.forEach(t => {
        if (t.owner === player.id) {
            t.owner = 0;
            t.level = 0;
            t.fee = 0;
        }
    });

    gameState.gameLog.push({ time: Date.now(), message: `🛑 ${player.name} is bankrupt! (${reason}) All properties returned to the Bank.` });

    gameState.isGameRunning = gameState.players.filter(p => !p.isBankrupt).length > 1;
    if (!gameState.isGameRunning) {
        const winner = gameState.players.find(p => !p.isBankrupt);
        if (winner) showModal("🏆 Game Over!", `${winner.name} won The Capital Game!`);
    }
};

// ===================================
// CORE GAME LOGIC
// ===================================

const distributeCash = (totalCash, numTiles) => {
    const eligibleTiles = gameState.board.filter(t =>
        t.type === 'property' && t.id !== CENTER_INDEX
    );

    if (eligibleTiles.length === 0) return;

    const selectedTiles = [];
    for (let i = 0; i < numTiles && eligibleTiles.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * eligibleTiles.length);
        selectedTiles.push(eligibleTiles.splice(randomIndex, 1)[0]);
    }

    let cashPerTile = Math.floor(totalCash / selectedTiles.length);
    let remainder = totalCash - (cashPerTile * selectedTiles.length);

    selectedTiles.forEach((tile, index) => {
        let amount = cashPerTile;
        if (index === 0) amount += remainder;

        const boardTile = gameState.board.find(t => t.id === tile.id);
        if (boardTile) {
            boardTile.cashDrop += amount;
        }
    });

    const tileIds = selectedTiles.map(t => t.id).join(', ');
    return `Cash dropped: $${totalCash} distributed to tiles ${tileIds}.`;
};

const activateActionCard = (player) => {
    const card = ACTION_CARDS[Math.floor(Math.random() * ACTION_CARDS.length)];
    let logMessage = `${player.name} landed on the **City Center**! They drew the card: **${card.description}**`;

    const dropMessage = distributeCash(card.totalCash, card.numTiles);
    logMessage += ` (Effect: ${dropMessage})`;

    gameState.gameLog.push({ time: Date.now(), message: logMessage });
};

const teleportToSubway = (player, currentTileIndex) => {
    const otherDestinations = MAJOR_DESTINATIONS.filter(index => index !== currentTileIndex);

    const choices = otherDestinations.map(index => {
        let name = `Tile ${index}`;
        if (index === CENTER_INDEX) name = 'City Center';
        return { index, name };
    });

    // Create minimap HTML
    let minimapHtml = '<p style="color: var(--color-text-muted); margin-bottom: 0.5rem; font-size: 0.875rem; text-align: center;">Click on a highlighted destination to ride the subway there</p>';
    minimapHtml += '<div class="subway-minimap">';

    for (let i = 0; i < TOTAL_TILES; i++) {
        const tile = gameState.board[i];
        let tileClass = 'minimap-tile';
        let tileContent = '';

        // Highlight current position
        if (i === currentTileIndex) {
            tileClass += ' current-position';
            tileContent = '📍';
        }
        // Highlight destinations
        else if (otherDestinations.includes(i)) {
            tileClass += ' destination';
            if (i === CENTER_INDEX) {
                tileContent = '🌳';
            } else {
                tileContent = '🚇';
            }
        }
        // Show tile type
        else if (tile.type === 'bank') {
            tileContent = '';
        } else if (tile.type === 'store') {
            tileContent = '';
        }

        const clickable = otherDestinations.includes(i);
        minimapHtml += `<div class="${tileClass}" ${clickable ? `data-destination="${i}" style="cursor: pointer;"` : ''}>${tileContent}</div>`;
    }

    minimapHtml += '</div>';
    minimapHtml += '<p style="color: var(--color-text-muted); margin-top: 0.5rem; font-size: 0.75rem; text-align: center;">📍 = Your current location | 🚇 = Subway | 🌳 = City Center</p>';

    showModal(
        `${player.name}: Ride the Subway`,
        `Select a destination on the map below.`,
        false,
        null,
        minimapHtml
    );

    elements.modalCancelBtn.textContent = 'Cancel';
    elements.modalCancelBtn.onclick = closeModal;
    elements.modalConfirmBtn.classList.add('hidden');

    // Add click handlers to destination tiles
    setTimeout(() => {
        document.querySelectorAll('.minimap-tile.destination').forEach(tile => {
            tile.onclick = (e) => {
                const destination = parseInt(e.currentTarget.dataset.destination);

                player.position = destination;

                gameState.gameLog.push({ time: Date.now(), message: `${player.name} rode the subway from Tile ${currentTileIndex} to Tile ${destination}.` });

                // Use handleLanding to process the arrival (fees, cash drops, action cards)
                handleLanding(player, destination);

                closeModal();
                // syncGameState is handled by handleLanding
            };
        });
    }, 100);
};

const calculateNewPosition = (currentPos, direction, steps) => {
    let { row, col } = getGridCoords(currentPos);
    let current1DIndex = currentPos;

    const vector = MOVE_DIRECTIONS[direction];
    if (!vector) return { newPos: currentPos, stepsTaken: 0 };

    let stepsTaken = 0;
    const path = [];
    for (let i = 0; i < steps; i++) {
        let newRow = row + vector.dr;
        let newCol = col + vector.dc;

        if (newRow < 0 || newRow >= GRID_ROWS || newCol < 0 || newCol >= GRID_COLS) {
            break;
        }

        row = newRow;
        col = newCol;
        current1DIndex = getIndexFromCoords(row, col);
        stepsTaken++;
        path.push(current1DIndex);
    }

    return { newPos: current1DIndex, stepsTaken: stepsTaken, path: path };
};

window.rollAndMove = () => {
    if (!gameState.isGameRunning || hasRolled || gameState.setupPhase !== 'playing') return;

    const player = gameState.players[gameState.currentPlayerIndex];
    const direction = document.querySelector('input[name="direction"]:checked')?.value;

    if (!direction) {
        showModal("⚠️ Move Error", "Please select a direction before rolling.");
        return;
    }

    rollResult = rollDie();
    let effectiveRoll = rollResult;

    elements.lastRoll.textContent = `🎲 Rolled a ${rollResult}. Move direction selected: ${direction}.`;

    if (player.hasDiceModifier && !modifierActive) {
        elements.diceModifierBtn.classList.remove('hidden');
        elements.diceModifierBtn.disabled = false;
        elements.rollMoveBtn.disabled = true;
        return;
    }

    if (modifierActive) {
        effectiveRoll = parseInt(elements.lastRoll.dataset.effectiveRoll);
    }

    const { newPos, stepsTaken, path } = calculateNewPosition(player.position, direction, effectiveRoll);
    player.position = newPos;

    // Collect cash along the path
    if (path && path.length > 0) {
        path.forEach(tileIndex => {
            const tile = gameState.board[tileIndex];
            if (tile.cashDrop > 0) {
                const amount = tile.cashDrop;
                player.money = parseFloat((player.money + amount).toFixed(2));
                gameState.gameLog.push({ time: Date.now(), message: `💰 ${player.name} collected **$${amount.toFixed(2)}** in cash while passing Tile ${tileIndex}!` });
                tile.cashDrop = 0;
            }
        });
    }

    hasRolled = true;
    rollResult = 0;
    modifierActive = false;

    handleLanding(player, newPos);

    gameState.gameLog.push({ time: Date.now(), message: `${player.name} chose ${direction}, rolled ${effectiveRoll} (Base: ${rollResult || effectiveRoll}), and moved ${stepsTaken} steps to Tile ${newPos}.` });
    syncGameState();
};

window.toggleDiceModifier = () => {
    if (!gameState.isGameRunning || hasRolled || gameState.setupPhase !== 'playing' || !rollResult) return;

    const player = gameState.players[gameState.currentPlayerIndex];

    let newRoll;
    let modifierText;

    if (!modifierActive) {
        if (rollResult + 1 <= DICE_SIDES + 1) {
            newRoll = rollResult + 1;
            modifierText = ` (+1)`;
        } else if (rollResult - 1 >= 1) {
            newRoll = rollResult - 1;
            modifierText = ` (-1)`;
        } else {
            newRoll = rollResult;
            modifierText = ` (No change)`;
        }
    }

    elements.lastRoll.textContent = `🎲 Rolled ${rollResult}. Modified Roll: ${newRoll}${modifierText}.`;
    elements.lastRoll.dataset.effectiveRoll = newRoll;
    modifierActive = true;

    elements.rollMoveBtn.disabled = false;
    elements.rollMoveBtn.textContent = 'Move';
    elements.diceModifierBtn.classList.add('hidden');

    window.rollAndMove();
};

const checkAutoNextTurn = (player, tile) => {
    if (!hasRolled) return false;

    if (player.isBankrupt) return true;

    if (tile.type === 'bank' || tile.type === 'store' || tile.type === 'subway' || tile.type === 'city_center') {
        return false;
    }

    if (tile.type === 'property') {
        if (tile.owner !== 0 && tile.owner !== player.id) {
            return true;
        }
        if (tile.owner === 0) {
            if (player.money < BUY_COST_LEVEL_1) {
                gameState.gameLog.push({ time: Date.now(), message: `${player.name} cannot afford to buy Tile ${tile.id}. Turn auto-advances.` });
                return true;
            }
            return false;
        }
        if (tile.owner === player.id) {
            if (tile.level === 2) {
                return true;
            }
            if (tile.level === 1 && player.money < ENHANCE_COST_LEVEL_2) {
                gameState.gameLog.push({ time: Date.now(), message: `${player.name} cannot afford to enhance Tile ${tile.id}. Turn auto-advances.` });
                return true;
            }
            return false;
        }
    }

    if (tile.type === 'street_segment') {
        return true;
    }

    return false;
};

const handleLanding = (player, newPos) => {
    const tile = gameState.board[newPos];
    let logMessage = '';

    if (tile.cashDrop > 0) {
        player.money = parseFloat((player.money + tile.cashDrop).toFixed(2));
        logMessage += `💰 ${player.name} collected **$${tile.cashDrop.toFixed(2)}** in cash from the tile! `;
        player.money = parseFloat((player.money + tile.cashDrop).toFixed(2));
        tile.cashDrop = 0;
    }

    if (newPos === CENTER_INDEX) {
        logMessage += `${player.name} landed on the **City Center (Park)**! Drawing an Action Card...`;
        gameState.gameLog.push({ time: Date.now(), message: logMessage });
        activateActionCard(player);
    } else if (tile.type === 'subway') {
        logMessage += `🚇 ${player.name} landed on a Subway station (Tile ${newPos}).`;

        if (tile.owner !== 0 && tile.owner !== player.id) {
            const owner = gameState.players.find(p => p.id === tile.owner);
            const fee = tile.fee; // Should be SUBWAY_FEE

            if (player.money >= fee) {
                player.money = parseFloat((player.money - fee).toFixed(2));
                owner.money = parseFloat((owner.money + fee).toFixed(2));
                logMessage += ` Paid $${fee} fee to ${owner.name}.`;
            } else {
                // Handle bankruptcy for subway fee
                const paidAmount = player.money;
                owner.money = parseFloat((owner.money + paidAmount).toFixed(2));
                player.money = 0;

                const reason = `Could not afford $${fee} subway fee to ${owner.name}`;
                declareBankrupt(player, reason);
                logMessage += ` ${player.name} is bankrupt! Paid $${paidAmount.toFixed(2)} to ${owner.name}.`;
            }
        }

        logMessage += ` You can teleport to another station if you wish.`;
    } else if (tile.type === 'bank') {
        logMessage += `🏦 ${player.name} landed on the Bank. You can borrow or repay debt.`;
    } else if (tile.type === 'store') {
        logMessage += `🏪 ${player.name} landed on the Store. You can buy upgrades.`;
    } else if (tile.type === 'street_segment') {
        logMessage += `${player.name} landed on a neutral segment (Tile ${newPos}).`;
    } else if (tile.owner !== 0 && tile.owner !== player.id) {
        const owner = gameState.players.find(p => p.id === tile.owner);
        let rent = tile.fee;
        let linkedTiles = [newPos];

        // Check for linked properties
        if (tile.hasPropertyLink) {
            const allLinked = getLinkedProperties(newPos, tile.owner);
            linkedTiles = allLinked;
            // Calculate total rent from all linked properties
            rent = allLinked.reduce((total, tileId) => {
                return total + gameState.board[tileId].fee;
            }, 0);
        }

        if (owner && !owner.isBankrupt) {
            if (player.money >= rent) {
                player.money = parseFloat((player.money - rent).toFixed(2));
                owner.money = parseFloat((owner.money + rent).toFixed(2));
                if (linkedTiles.length > 1) {
                    logMessage += `💸 ${player.name} paid $${rent} rent to ${owner.name} for ${linkedTiles.length} linked properties (Tiles: ${linkedTiles.join(', ')}).`;
                    // Distribute earnings
                    linkedTiles.forEach(tId => {
                        const t = gameState.board[tId];
                        t.earnings = (t.earnings || 0) + t.fee;
                    });
                } else {
                    logMessage += `💸 ${player.name} paid $${rent} rent to ${owner.name} on Tile ${newPos} (Level ${tile.level}).`;
                    tile.earnings = (tile.earnings || 0) + rent;
                }
            } else {
                const paidAmount = player.money;
                owner.money = parseFloat((owner.money + paidAmount).toFixed(2));
                player.money = 0;

                const reason = `Could not afford $${rent} rent to ${owner.name}`;
                declareBankrupt(player, reason);
                logMessage += `${player.name} is bankrupt! All remaining funds ($${paidAmount.toFixed(2)}) were paid to ${owner.name}.`;
            }
        }
    } else if (tile.owner === 0) {
        logMessage += `${player.name} landed on an unowned property (${newPos}). You may now buy it.`;
    } else if (tile.owner === player.id) {
        logMessage += `${player.name} landed on their own property (${newPos}).`;
    }

    if (logMessage) {
        gameState.gameLog.push({ time: Date.now(), message: logMessage });
    }

    const isAutoNext = checkAutoNextTurn(player, tile);
    if (isAutoNext) {
        setTimeout(() => nextTurn(), 100);
    } else {
        elements.nextTurnBtn.disabled = false;
    }

    syncGameState();
};

window.buyProperty = () => {
    if (!gameState.isGameRunning || !hasRolled || gameState.setupPhase !== 'playing') return;

    const player = gameState.players[gameState.currentPlayerIndex];
    const tileIndex = player.position;
    const tile = gameState.board[tileIndex];
    let logMessage = '';

    if (tile.type !== 'property') {
        logMessage = `Tile ${tileIndex} is a ${tile.type.toUpperCase()} tile and cannot be bought or enhanced.`;
    } else if (tile.owner === 0 && player.money >= BUY_COST_LEVEL_1) {
        player.money -= BUY_COST_LEVEL_1;
        gameState.bankMoney += BUY_COST_LEVEL_1;
        tile.owner = player.id;
        tile.level = 1;
        tile.fee = RENT_LEVEL_1;

        logMessage = `🏠 ${player.name} bought Tile ${tileIndex} for $${BUY_COST_LEVEL_1} (Level 1).`;
    } else if (tile.owner === player.id && tile.level === 1 && player.money >= ENHANCE_COST_LEVEL_2) {
        player.money -= ENHANCE_COST_LEVEL_2;
        gameState.bankMoney += ENHANCE_COST_LEVEL_2;
        tile.level = 2;
        tile.fee = RENT_LEVEL_2;

        logMessage = `⬆️ ${player.name} enhanced Tile ${tileIndex} for $${ENHANCE_COST_LEVEL_2} (Level 2). Rent is now $${RENT_LEVEL_2}.`;
    } else if (tile.owner !== player.id && tile.owner !== 0) {
        logMessage = `Tile ${tileIndex} is owned by another player.`;
    } else if (tile.owner === player.id && tile.level === 2) {
        logMessage = `Tile ${tileIndex} is already fully enhanced (Level 2).`;
    } else {
        logMessage = `${player.name} cannot afford this action or it is not applicable here.`;
    }

    if (logMessage) {
        gameState.gameLog.push({ time: Date.now(), message: logMessage });
    }

    const tileAfterAction = gameState.board[player.position];
    if (checkAutoNextTurn(player, tileAfterAction)) {
        setTimeout(() => nextTurn(), 100);
    }

    syncGameState();
};

window.handleSpecialAction = () => {
    if (!gameState.isGameRunning || !hasRolled || gameState.setupPhase !== 'playing') return;

    const player = gameState.players[gameState.currentPlayerIndex];
    const tileType = gameState.board[player.position].type;
    const currentRate = player.debtRounds > 0 ? player.debtRounds : 1;

    if (tileType === 'bank') {
        let message = "The interest rate on new debt is **1%** for the first round, then it increases by 1% each subsequent round (2%, 3%, etc.) until repaid.";
        if (player.debt > 0) {
            message += `<br><br>Your current debt rate is **${currentRate}%**.`;
            if (player.isGraceRound) {
                message += `<br><br><span style="color: var(--color-danger); font-weight: 700;">⚠️ CRITICAL: Must repay debt this turn!</span>`;
            }
        }

        showModal("🏦 Bank Services", message, false, () => { });

        elements.modalConfirmBtn.classList.remove('hidden');
        elements.modalConfirmBtn.textContent = 'Borrow';
        elements.modalConfirmBtn.onclick = () => showBorrowModal(player);

        elements.modalCancelBtn.textContent = 'Repay Debt';
        elements.modalCancelBtn.onclick = () => showRepayModal(player);

    } else if (tileType === 'store') {
        const storeHtml = `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem;">
                <button onclick="window.buyAbility(gameState.players[gameState.currentPlayerIndex], 'diagonal')" 
                        class="store-item-btn" 
                        ${player.hasDiagonalMove ? 'disabled' : ''}>
                    <span style="font-size: 1.5rem;">⚡</span>
                    <div style="flex: 1; text-align: left;">
                        <div style="font-weight: 700;">Diagonal Move</div>
                        <div style="font-size: 0.75rem; opacity: 0.8;">Unlock 4 diagonal directions</div>
                    </div>
                    <span style="font-weight: 700; color: #fbbf24;">$${COST_DIAGONAL}</span>
                </button>
                <button onclick="window.buyAbility(gameState.players[gameState.currentPlayerIndex], 'modifier')" 
                        class="store-item-btn"
                        ${player.hasDiceModifier ? 'disabled' : ''}>
                    <span style="font-size: 1.5rem;">✨</span>
                    <div style="flex: 1; text-align: left;">
                        <div style="font-weight: 700;">Dice Modifier</div>
                        <div style="font-size: 0.75rem; opacity: 0.8;">Adjust dice roll by ±1</div>
                    </div>
                    <span style="font-weight: 700; color: #fbbf24;">$${COST_MODIFIER}</span>
                </button>
                <button onclick="window.buyAbility(gameState.players[gameState.currentPlayerIndex], 'propertylink')" 
                        class="store-item-btn">
                    <span style="font-size: 1.5rem;">🔗</span>
                    <div style="flex: 1; text-align: left;">
                        <div style="font-weight: 700;">Property Link</div>
                        <div style="font-size: 0.75rem; opacity: 0.8;">Link adjacent properties (${player.propertyLinks} owned)</div>
                    </div>
                    <span style="font-weight: 700; color: #fbbf24;">$${COST_PROPERTY_LINK}</span>
                </button>
            </div>
        `;

        showModal("🏪 Store: Buy Items", "Purchase abilities and property links to gain strategic advantages.", false, null, storeHtml);

        elements.modalCancelBtn.textContent = 'Close';
        elements.modalCancelBtn.onclick = closeModal;
    } else if (tileType === 'subway') {
        const tile = gameState.board[player.position];
        if (tile.owner === 0) {
            // Subway is unowned – offer purchase
            const cost = COST_SUBWAY;
            showModal("🚇 Subway Station", `This subway station can be purchased for $${cost}. Owning it charges $${SUBWAY_FEE} fee to anyone who lands on or rides to it.`, false, null);
            elements.modalConfirmBtn.classList.remove('hidden');
            elements.modalConfirmBtn.textContent = 'Buy Subway';
            elements.modalConfirmBtn.onclick = () => {
                if (player.money >= cost) {
                    player.money -= cost;
                    gameState.bankMoney += cost;
                    tile.owner = player.id;
                    tile.fee = SUBWAY_FEE;
                    gameState.gameLog.push({ time: Date.now(), message: `🚇 ${player.name} purchased Subway Station (Tile ${player.position}) for $${cost}.` });
                    closeModal();
                    syncGameState();
                } else {
                    showModal("❌ Cannot Afford", `${player.name} needs $${cost} to buy this Subway but only has $${player.money.toFixed(2)}.`);
                }
            };
            elements.modalCancelBtn.textContent = 'Ride Anyway';
            elements.modalCancelBtn.onclick = () => {
                closeModal();
                setTimeout(() => teleportToSubway(player, player.position), 10);
            };
        } else {
            // Subway already owned – just ride
            showModal("🚇 Subway Station", "Would you like to ride the subway to another major destination (Subway or City Center)?", false, null);
            elements.modalConfirmBtn.classList.remove('hidden');
            elements.modalConfirmBtn.textContent = 'Ride Subway';
            elements.modalConfirmBtn.onclick = () => {
                closeModal();
                setTimeout(() => teleportToSubway(player, player.position), 10);
            };
            elements.modalCancelBtn.textContent = 'Cancel';
            elements.modalCancelBtn.onclick = closeModal;
        }
    } else if (tileType === 'city_center') {
        showModal("🌳 City Center (Park)", `Welcome to the City Center! The Action Card has been drawn and its effect resolved. Enjoy the park!`);
    }
};

const showBorrowModal = (player) => {
    const maxBorrow = gameState.bankMoney;
    showModal("💰 Borrow Money (Progressive Interest)", `Enter amount to borrow. Max available: **$${maxBorrow.toFixed(2)}**.`, true, (amount) => processBorrow(player, amount, maxBorrow));
    elements.modalConfirmBtn.textContent = 'Borrow';
};

const showRepayModal = (player) => {
    const maxRepay = Math.min(player.money, player.debt);
    showModal("💳 Repay Debt", `Your current debt is **$${player.debt.toFixed(2)}**. Enter amount to repay (max: **$${maxRepay.toFixed(2)}**).`, true, (amount) => processRepay(player, amount, maxRepay));

    if (player.debt > 0 && maxRepay > 0) {
        elements.modalConfirmBtn.textContent = 'Repay';
    } else {
        elements.modalConfirmBtn.classList.add('hidden');
    }
};

const processBorrow = (player, amount, maxBorrow) => {
    amount = Math.floor(amount * 100) / 100;

    if (amount <= 0 || isNaN(amount)) {
        gameState.gameLog.push({ time: Date.now(), message: `${player.name} cancelled the borrow transaction or entered an invalid amount.` });
    } else if (amount > maxBorrow) {
        showModal("❌ Error", `Cannot borrow $${amount.toFixed(2)}. The Bank only has $${maxBorrow.toFixed(2)} available.`);
    } else {
        player.money += amount;
        player.debt += amount;
        gameState.bankMoney -= amount;

        gameState.gameLog.push({ time: Date.now(), message: `💰 ${player.name} borrowed $${amount.toFixed(2)}. Total debt: $${player.debt.toFixed(2)}.` });

        elements.nextTurnBtn.disabled = false;
        syncGameState();
    }
};

const processRepay = (player, amount, maxRepay) => {
    amount = Math.floor(amount * 100) / 100;

    if (amount <= 0 || isNaN(amount)) {
        gameState.gameLog.push({ time: Date.now(), message: `${player.name} cancelled the repay transaction or entered an invalid amount.` });
    } else if (amount > maxRepay) {
        showModal("❌ Error", `Cannot repay $${amount.toFixed(2)}. You only have $${player.money.toFixed(2)}.`);
    } else {
        player.money -= amount;
        player.debt -= amount;
        gameState.bankMoney += amount;

        if (player.debt < 0.01) {
            player.debt = 0;
            player.debtRounds = 0;
            player.isGraceRound = false;
        }

        gameState.gameLog.push({ time: Date.now(), message: `💳 ${player.name} repaid $${amount.toFixed(2)}. Remaining debt: $${player.debt.toFixed(2)}.` });

        elements.nextTurnBtn.disabled = false;
        syncGameState();
    }
};

const buyAbility = (player, abilityType) => {
    closeModal();

    let cost = COST_DIAGONAL; // Default cost
    if (abilityType === 'modifier') {
        cost = COST_MODIFIER;
    } else if (abilityType === 'propertylink') {
        cost = COST_PROPERTY_LINK;
    }

    if (player.money < cost) {
        showModal("❌ Cannot Afford", `${player.name} needs $${cost} to buy this item.`);
        return;
    }

    let logMessage = '';
    if (abilityType === 'diagonal' && !player.hasDiagonalMove) {
        player.money -= COST_DIAGONAL;
        gameState.bankMoney += COST_DIAGONAL;
        player.hasDiagonalMove = true;
        logMessage = `⚡ ${player.name} purchased the **Diagonal Move** ability for $${COST_DIAGONAL}.`;
    } else if (abilityType === 'modifier' && !player.hasDiceModifier) {
        player.money -= COST_MODIFIER;
        gameState.bankMoney += COST_MODIFIER;
        player.hasDiceModifier = true;
        logMessage = `✨ ${player.name} purchased the **Dice Modifier (+/-1)** ability for $${COST_MODIFIER}.`;
    } else if (abilityType === 'propertylink') {
        player.money -= COST_PROPERTY_LINK;
        gameState.bankMoney += COST_PROPERTY_LINK;
        player.propertyLinks += 1;
        logMessage = `🔗 ${player.name} purchased a **Property Link** for $${COST_PROPERTY_LINK}. Total links: ${player.propertyLinks}.`;

        // Show placement UI
        setTimeout(() => showPropertyLinkPlacement(player), 100);
    } else {
        logMessage = `${player.name} already owns the ${abilityType} ability.`;
    }

    gameState.gameLog.push({ time: Date.now(), message: logMessage });
    elements.nextTurnBtn.disabled = false;
    syncGameState();
};
window.buyAbility = buyAbility;

window.showPropertyLinkPlacement = (player) => {
    const ownedProperties = gameState.board.filter(t => t.owner === player.id && t.type === 'property' && player.propertyLinks > 0);

    if (ownedProperties.length === 0) {
        showModal("🔗 Property Link", "You need to own at least one property to place a link. The link has been added to your inventory.");
        return;
    }

    const placementHtml = `
        <p style="margin-bottom: 1rem; color: var(--color-text-muted);">Click on one of your properties to place the Property Link:</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 0.5rem; max-height: 300px; overflow-y: auto;">
            ${ownedProperties.map(tile => `
                <button onclick="window.placePropertyLink(${tile.id})" class="property-link-btn">
                    Tile ${tile.id}
                    ${tile.hasPropertyLink ? '<br>🔗' : ''}
                </button>
            `).join('')}
        </div>
    `;

    showModal("🔗 Place Property Link", placementHtml, false, null, placementHtml);
    elements.modalCancelBtn.textContent = 'Cancel';
    elements.modalCancelBtn.onclick = closeModal;
};

const showPropertyLinkPlacement = window.showPropertyLinkPlacement;

window.placePropertyLink = (tileId) => {
    const player = gameState.players[gameState.currentPlayerIndex];
    const tile = gameState.board[tileId];

    if (tile.owner !== player.id) {
        showModal("❌ Error", "You can only place links on your own properties.");
        return;
    }

    if (tile.hasPropertyLink) {
        showModal("❌ Error", "This property already has a link.");
        return;
    }

    if (player.propertyLinks <= 0) {
        showModal("❌ Error", "You don't have any property links available.");
        return;
    }

    tile.hasPropertyLink = true;
    player.propertyLinks -= 1;

    gameState.gameLog.push({ time: Date.now(), message: `🔗 ${player.name} placed a Property Link on Tile ${tileId}.` });

    closeModal();
    syncGameState();
};

const getAdjacentTiles = (tileId) => {
    const { row, col } = getGridCoords(tileId);
    const adjacent = [];

    // Check all 4 cardinal directions
    const directions = [
        { dr: -1, dc: 0 },  // up
        { dr: 1, dc: 0 },   // down
        { dr: 0, dc: -1 },  // left
        { dr: 0, dc: 1 }    // right
    ];

    directions.forEach(({ dr, dc }) => {
        const newRow = row + dr;
        const newCol = col + dc;
        const newIndex = getIndexFromCoords(newRow, newCol);
        if (newIndex !== -1) {
            adjacent.push(newIndex);
        }
    });

    return adjacent;
};

const getLinkedProperties = (tileId, playerId) => {
    const linked = [tileId];
    const tile = gameState.board[tileId];

    if (!tile.hasPropertyLink) return linked;

    const adjacentTiles = getAdjacentTiles(tileId);
    adjacentTiles.forEach(adjId => {
        const adjTile = gameState.board[adjId];
        if (adjTile.owner === playerId && adjTile.hasPropertyLink && adjTile.type === 'property') {
            linked.push(adjId);
        }
    });

    return linked;
};

const applyInterestAndCheckDebt = (player) => {
    if (player.debt > 0) {
        player.debtRounds = (player.debtRounds || 0) + 1;

        const interestPercent = player.debtRounds;
        const interestRate = interestPercent / 100;

        const interest = parseFloat((player.debt * interestRate).toFixed(2));
        const newDebt = parseFloat((player.debt + interest).toFixed(2));

        player.debt = newDebt;
        gameState.gameLog.push({ time: Date.now(), message: `📈 ${player.name}'s debt increased by $${interest.toFixed(2)} (Interest Rate: **${interestPercent}%**). Total debt: $${newDebt.toFixed(2)}.` });

        if (player.debtRounds === 25) {
            player.isGraceRound = true;
            gameState.gameLog.push({ time: Date.now(), message: `🚨 ${player.name} has hit the **25% CRITICAL DEBT RATE**! They must repay their debt this turn, or they will be instantly bankrupt on their next turn.` });
        }

        if (player.money <= 0 && player.debt > 0) {
            const reason = `Went below $0 due to $${interest.toFixed(2)} interest charges.`;
            declareBankrupt(player, reason);
        }
    } else {
        player.debtRounds = 0;
        player.isGraceRound = false;
    }
};

window.nextTurn = () => {
    if (!gameState.isGameRunning || !hasRolled || gameState.setupPhase !== 'playing') return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    let skipInterest = false;

    if (currentPlayer.isGraceRound && currentPlayer.debt > 0) {
        const reason = 'Failed to repay debt during the 25% Critical Rate grace round.';
        declareBankrupt(currentPlayer, reason);
        skipInterest = true;
    }

    if (!skipInterest) {
        applyInterestAndCheckDebt(currentPlayer);
    }

    let nextIndex = gameState.currentPlayerIndex;
    let foundNextPlayer = false;

    for (let i = 0; i < gameState.players.length; i++) {
        nextIndex = (nextIndex + 1) % gameState.players.length;
        if (!gameState.players[nextIndex].isBankrupt) {
            foundNextPlayer = true;
            break;
        }
    }

    if (foundNextPlayer) {
        gameState.currentPlayerIndex = nextIndex;
        hasRolled = false;
        rollResult = 0;
        modifierActive = false;

        elements.diceModifierBtn.classList.add('hidden');
        elements.diceModifierBtn.textContent = 'Use Dice Mod';
        elements.diceModifierBtn.dataset.modified = 'false';

        const nextPlayer = gameState.players[nextIndex];
        const log = {
            time: Date.now(),
            message: `➡️ Turn passed. It is now ${nextPlayer.name}'s turn.`,
        };
        gameState.gameLog.push(log);
        elements.lastRoll.textContent = '';
    } else {
        if (gameState.players.filter(p => !p.isBankrupt).length <= 1) {
            const winner = gameState.players.find(p => !p.isBankrupt);
            if (winner) showModal("🏆 Game Over!", `${winner.name} won The Capital Game!`);
        }
    }

    syncGameState();
};

const syncGameState = () => {
    renderGame();
};

// ===================================
// RENDERING & UI
// ===================================

const renderDirectionalControls = (player) => {
    elements.directionalControls.innerHTML = '';
    const canMoveDiagonal = player.hasDiagonalMove;

    const positions = [
        canMoveDiagonal ? 'up-left' : null, 'up', canMoveDiagonal ? 'up-right' : null,
        'left', 'inventory', 'right',
        canMoveDiagonal ? 'down-left' : null, 'down', canMoveDiagonal ? 'down-right' : null
    ];

    positions.forEach(directionKey => {
        const label = document.createElement('label');

        if (directionKey === 'inventory') {
            label.innerHTML = `
                <button onclick="window.showInventory()" class="btn-inventory" title="Inventory">
                    🎒
                </button>
            `;
            // Override default label styles for this button container
            label.style.padding = '0';
            label.style.border = 'none';
            label.style.background = 'transparent';
        } else if (directionKey) {
            const dir = MOVE_DIRECTIONS[directionKey];
            label.innerHTML = `
                <input type="radio" name="direction" value="${directionKey}">
                <span data-direction-label="${directionKey}">
                    ${dir.symbol}
                </span>
            `;
            label.querySelector('input').addEventListener('change', (e) => {
                document.querySelectorAll('#directional-controls span[data-direction-label]').forEach(span => {
                    span.classList.remove('bg-blue-200');
                });
                if (e.target.checked) {
                    e.target.nextElementSibling.classList.add('bg-blue-200');
                }
            });
        } else {
            label.innerHTML = '<span></span>';
            label.style.visibility = 'hidden';
        }
        elements.directionalControls.appendChild(label);
    });
};

const renderGame = () => {
    if (!gameState) return;

    const player = gameState.players[gameState.currentPlayerIndex];
    const playerColor = PLAYER_COLORS.find(c => c.id === player.id);
    const currentTile = player.position !== null ? gameState.board[player.position] : null;

    renderDirectionalControls(player);

    // Update Turn Indicator
    if (gameState.isGameRunning) {
        elements.turnIndicator.innerHTML = `Current Turn: <span class="${playerColor.text}">${player.name}</span>`;
    } else {
        elements.turnIndicator.innerHTML = `Game Over!`;
    }

    // Update Controls
    const inPlayMode = gameState.isGameRunning && gameState.setupPhase === 'playing';

    elements.rollMoveBtn.disabled = !inPlayMode || hasRolled || player.isBankrupt;
    elements.rollMoveBtn.innerHTML = `<span class="btn-icon">🎲</span><span>${(rollResult > 0 && !modifierActive && player.hasDiceModifier) ? 'Apply Modifier' : 'Roll & Move'}</span>`;

    elements.nextTurnBtn.disabled = !inPlayMode || !hasRolled || player.isBankrupt || checkAutoNextTurn(player, currentTile);

    elements.diceModifierBtn.classList.add('hidden');
    if (player.hasDiceModifier && rollResult > 0 && !modifierActive) {
        elements.diceModifierBtn.classList.remove('hidden');
        elements.diceModifierBtn.disabled = false;
    }

    let buyButtonText = `Buy/Enhance`;
    let disableBuyBtn = true;
    elements.specialActionBtn.classList.add('hidden');

    if (inPlayMode && hasRolled && !player.isBankrupt && currentTile) {
        if (currentTile.type === 'property') {
            if (currentTile.owner === 0 && player.money >= BUY_COST_LEVEL_1) {
                disableBuyBtn = false;
                buyButtonText = `Buy ($${BUY_COST_LEVEL_1})`;
            } else if (currentTile.owner === player.id && currentTile.level === 1 && player.money >= ENHANCE_COST_LEVEL_2) {
                disableBuyBtn = false;
                buyButtonText = `Enhance ($${ENHANCE_COST_LEVEL_2})`;
            } else if (currentTile.owner === player.id && currentTile.level === 2) {
                buyButtonText = `Max Level`;
                disableBuyBtn = true;
            }
        } else if (currentTile.type === 'bank' || currentTile.type === 'store' || currentTile.type === 'city_center' || currentTile.type === 'subway') {
            elements.specialActionBtn.classList.remove('hidden');
            const icons = { bank: '🏦', store: '🏪', city_center: '🌳', subway: '🚇' };
            const labels = { bank: 'Bank Services', store: 'Store: Buy Ability', city_center: 'City Center Info', subway: 'Subway Station' };
            elements.specialActionBtn.innerHTML = `<span class="btn-icon">${icons[currentTile.type]}</span><span>${labels[currentTile.type]}</span>`;
        } else {
            buyButtonText = currentTile.type.toUpperCase();
        }
    }

    // Trade Button Logic
    elements.tradeBtn.classList.add('hidden');
    if (inPlayMode && !player.isBankrupt && currentTile) {
        const otherPlayersOnTile = gameState.players.filter(p => p.id !== player.id && p.position === player.position && !p.isBankrupt);
        if (otherPlayersOnTile.length > 0) {
            elements.tradeBtn.classList.remove('hidden');
        }
    }

    elements.buyPropertyBtn.disabled = disableBuyBtn;
    elements.buyPropertyBtn.innerHTML = `<span class="btn-icon">🏠</span><span>${buyButtonText}</span>`;

    // Update Board
    renderBoard();

    // Update Player Cards
    renderPlayerCards();

    // Update Bank Info
    elements.bankMoney.textContent = gameState.bankMoney.toFixed(2);

    // Update Game Log
    renderGameLog();
};

const renderBoard = () => {
    elements.board.innerHTML = '';
    const tiles = gameState.board;
    const players = gameState.players;

    for (let tileIndex = 0; tileIndex < TOTAL_TILES; tileIndex++) {
        const tileData = tiles[tileIndex];
        const ownerPlayer = players.find(p => p.id === tileData.owner);
        const ownerColorData = ownerPlayer ? PLAYER_COLORS.find(c => c.id === ownerPlayer.id) : null;
        const ownerColor = ownerColorData ? ownerColorData.hex : '#e5e7eb';
        const ownerName = ownerPlayer ? ownerPlayer.name : 'Bank';

        let tileClasses = 'tile';
        let tileContent = `Tile ${tileIndex}`;
        let feeDisplay = '';
        let tileStyle = '';

        // Tile Type Styling
        if (tileData.type === 'bank') {
            tileClasses += ' tile-bank';
            tileContent = '<span style="font-size: 1.5rem;">🏦</span>';
        } else if (tileData.type === 'store') {
            tileClasses += ' tile-store';
            tileContent = '<span style="font-size: 1.5rem;">🏪</span>';
        } else if (tileData.type === 'city_center') {
            tileClasses += ' tile-city-center';
            tileContent = 'City Center';
        } else if (tileData.type === 'subway') {
            tileClasses += ' tile-subway';
            tileContent = '<span style="font-size: 1.5rem;">🚇</span>';

            if (tileData.owner !== 0) {
                tileStyle = `background-color: ${ownerColor};`;
                // Add a small subway icon if owned to keep the "sign" feel but show ownership
                tileContent = `<span style="font-size: 1.2rem;">🚇</span><div style="font-size: 0.5rem; font-weight: 700; margin-top: -2px;">${ownerName.toUpperCase()}</div>`;
                feeDisplay = `<div style="position: absolute; top: 0; right: 0; padding: 2px 4px; font-size: 0.6rem; font-weight: 700; color: white; background: rgba(0,0,0,0.6); border-radius: 0 0 0 4px;">$${tileData.fee}</div>`;
            }
        } else if (tileData.type === 'street_segment') {
            tileClasses += ' tile-street-segment';
            tileContent = 'Road';
        } else if (tileData.type === 'property') {
            if (tileData.level === 1) tileClasses += ' level-1';
            if (tileData.level === 2) tileClasses += ' level-2';
            if (tileData.owner === 0) tileClasses += ' tile-owner-bank';

            if (tileData.level > 0) {
                tileStyle = `background-color: ${ownerColor};`;
                feeDisplay = `<div style="position: absolute; top: 0; right: 0; padding: 2px 4px; font-size: 0.6rem; font-weight: 700; color: white; background: rgba(0,0,0,0.6); border-radius: 0 0 0 4px;">$${tileData.fee}</div>`;
                tileContent = ownerName.toUpperCase();
            } else {
                tileClasses += ' tile-interactive';
                tileContent = 'Property';
            }
        }

        // Player Tokens
        let playersOnTile = [];
        players.forEach((p) => {
            if (p.position === tileIndex && !p.isBankrupt) {
                playersOnTile.push(p);
            }
        });

        let playerTokensHtml = '';
        playersOnTile.forEach((p, index) => {
            const pos = TOKEN_POSITIONS[index % TOKEN_POSITIONS.length];
            const colorData = PLAYER_COLORS.find(c => c.id === p.id);

            const style = `
                background-color: ${colorData.hex}; 
                bottom: ${pos.bottom || 'auto'}; 
                top: ${pos.top || 'auto'};
                left: ${pos.left || 'auto'};
                right: ${pos.right || 'auto'};
                z-index: ${pos.z};
            `;

            playerTokensHtml += `<div class="player-token" style="${style}"></div>`;
        });

        // Property Link Logic
        let linkHtml = '';
        if (tileData.hasPropertyLink) {
            const connections = [];
            const { row, col } = getGridCoords(tileIndex);

            const check = (r, c) => {
                const idx = getIndexFromCoords(r, c);
                if (idx !== -1) {
                    const t = tiles[idx];
                    return t.type === 'property' && t.hasPropertyLink && t.owner === tileData.owner;
                }
                return false;
            };

            if (check(row - 1, col)) connections.push('up');
            if (check(row + 1, col)) connections.push('down');
            if (check(row, col - 1)) connections.push('left');
            if (check(row, col + 1)) connections.push('right');

            linkHtml = `<div class="property-link-network">
                ${connections.map(dir => `<div class="link-arm ${dir}"></div>`).join('')}
                <div class="link-node"></div>
            </div>`;
        }

        const tileHtml = `
            <div class="${tileClasses}" data-tile-index="${tileIndex}" style="${tileStyle}">
                ${tileData.cashDrop > 0 ? `<div class="cash-drop-indicator">$${tileData.cashDrop}</div>` : ''}
                ${linkHtml}
                <div style="text-align: center; font-weight: 600; line-height: 1.2; display: flex; flex-direction: column; align-items: center; position: relative; z-index: 5;">
                    <span style="font-size: 0.6rem;">${tileContent}</span>
                    ${tileData.level > 0 ? `<span style="font-size: 0.55rem; font-weight: 700; margin-top: 2px;">Lvl ${tileData.level}</span>` : ''}
                </div>
                ${feeDisplay}
                ${playerTokensHtml}
            </div>
        `;
        elements.board.insertAdjacentHTML('beforeend', tileHtml);
    }
};

const renderPlayerCards = () => {
    elements.playerCardsContainer.innerHTML = '';
    gameState.players.forEach(player => {
        const colorData = PLAYER_COLORS.find(c => c.id === player.id);
        const totalProperties = gameState.board.filter(t => t.owner === player.id).length;
        const debtRate = player.debtRounds > 0 ? player.debtRounds : 0;
        const isCritical = player.isGraceRound && player.debt > 0;

        const cardClasses = `player-card ${player.isBankrupt ? 'bankrupt' : ''} ${isCritical ? 'critical' : ''}`;
        const borderColor = player.isBankrupt ? '#6b7280' : (isCritical ? 'var(--color-danger)' : colorData.hex);

        const cardHtml = `
            <div class="${cardClasses}" style="border-left-color: ${borderColor};">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                    <h3 style="font-size: 1.25rem; font-weight: 700; color: ${player.isBankrupt ? '#6b7280' : colorData.hex};">
                        ${player.name} ${player.isBankrupt ? '(Bankrupt)' : ''}
                    </h3>
                    <div style="font-size: 0.875rem; font-weight: 600; color: var(--color-text-muted);">Tile: ${player.position !== null ? player.position : 'N/A'}</div>
                </div>
                <div style="margin-top: 0.5rem; font-size: 1.125rem; font-family: 'Outfit', monospace;">
                    Money: $<span style="color: ${player.money < 0 ? 'var(--color-danger)' : 'var(--color-success)'}; font-weight: 700;">${player.money.toFixed(2)}</span>
                </div>
                <div style="margin-top: 0.25rem; font-size: 0.875rem; color: var(--color-text-muted);">
                    Debt: $<span style="color: var(--color-danger); font-weight: 700;">${player.debt.toFixed(2)}</span> 
                    <span style="font-weight: 700; color: ${isCritical ? 'var(--color-danger)' : (player.debt > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)')}">(Rate: ${debtRate}%)</span> 
                    | Properties: ${totalProperties}
                </div>
                ${isCritical ? '<div style="margin-top: 0.5rem; font-size: 0.75rem; font-weight: 700; color: var(--color-danger); background: rgba(239, 68, 68, 0.1); padding: 0.25rem 0.5rem; border-radius: 0.375rem;">⚠️ CRITICAL DEBT: MUST REPAY!</div>' : ''}
                <div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--color-text-muted); display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    <span>Abilities:</span>
                    <span style="font-weight: 700; color: ${player.hasDiagonalMove ? 'var(--color-secondary)' : 'var(--color-text-muted)'}">Diagonal Move</span>
                    <span style="font-weight: 700; color: ${player.hasDiceModifier ? 'var(--color-secondary)' : 'var(--color-text-muted)'}">Dice Modifier</span>
                    <span style="font-weight: 700; color: ${player.propertyLinks > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)'}">🔗 Links: ${player.propertyLinks}</span>
                </div>
            </div>
        `;
        elements.playerCardsContainer.insertAdjacentHTML('beforeend', cardHtml);
    });
};

const renderGameLog = () => {
    elements.gameLog.innerHTML = '';
    gameState.gameLog.slice(-15).reverse().forEach(entry => {
        const time = new Date(entry.time).toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `<span class="log-time">[${time}]</span> ${entry.message}`;
        elements.gameLog.appendChild(logEntry);
    });
    elements.gameLog.scrollTop = elements.gameLog.scrollHeight;
};

// ===================================
// TRADING SYSTEM
// ===================================

window.initiateTrade = () => {
    const player = gameState.players[gameState.currentPlayerIndex];
    const otherPlayersOnTile = gameState.players.filter(p => p.id !== player.id && p.position === player.position && !p.isBankrupt);

    if (otherPlayersOnTile.length === 0) return;

    if (otherPlayersOnTile.length === 1) {
        setupTrade(player, otherPlayersOnTile[0]);
    } else {
        // Show selection modal
        let selectionHtml = '<div style="display: flex; flex-direction: column; gap: 0.5rem;">';
        otherPlayersOnTile.forEach(p => {
            selectionHtml += `<button onclick="window.selectTradePartner(${p.id})" class="btn btn-secondary" style="width: 100%; text-align: left;">Trade with ${p.name}</button>`;
        });
        selectionHtml += '</div>';

        showModal("🤝 Select Trade Partner", "Who would you like to trade with?", false, null, selectionHtml);

        // Helper to bridge the selection
        window.selectTradePartner = (partnerId) => {
            const partner = gameState.players.find(p => p.id === partnerId);
            setupTrade(player, partner);
        };
    }
};

const setupTrade = (initiator, partner) => {
    const initiatorProps = gameState.board.filter(t => t.owner === initiator.id);
    const partnerProps = gameState.board.filter(t => t.owner === partner.id);

    const tradeHtml = `
        <div class="trade-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
            <!-- Initiator Side -->
            <div class="trade-column" style="background: rgba(0,0,0,0.05); padding: 0.5rem; border-radius: 0.5rem;">
                <h4 style="font-weight: 700; margin-bottom: 0.5rem; color: ${PLAYER_COLORS.find(c => c.id === initiator.id).hex}">${initiator.name} Offers:</h4>
                
                <div style="margin-bottom: 0.5rem;">
                    <label style="font-size: 0.75rem; display: block;">Money (Max: $${initiator.money})</label>
                    <input type="number" id="trade-money-initiator" min="0" max="${initiator.money}" value="0" style="width: 100%; padding: 0.25rem; border: 1px solid #ccc; border-radius: 0.25rem;">
                </div>

                <div style="max-height: 150px; overflow-y: auto; border: 1px solid #eee; padding: 0.25rem;">
                    ${initiatorProps.length > 0 ? initiatorProps.map(t => `
                        <div style="display: flex; align-items: center; font-size: 0.75rem; margin-bottom: 0.25rem;">
                            <input type="checkbox" class="trade-prop-initiator" value="${t.id}" id="prop-init-${t.id}">
                            <label for="prop-init-${t.id}" style="margin-left: 0.25rem;">Tile ${t.id} (Lvl ${t.level})</label>
                        </div>
                    `).join('') : '<span style="font-size: 0.75rem; color: #999;">No properties</span>'}
                </div>
                
                <div style="margin-top: 1rem; text-align: center;">
                    <button id="sign-initiator" class="btn btn-secondary btn-sm" onclick="toggleTradeSignature('initiator')">Sign Deal</button>
                </div>
            </div>

            <!-- Partner Side -->
            <div class="trade-column" style="background: rgba(0,0,0,0.05); padding: 0.5rem; border-radius: 0.5rem;">
                <h4 style="font-weight: 700; margin-bottom: 0.5rem; color: ${PLAYER_COLORS.find(c => c.id === partner.id).hex}">${partner.name} Offers:</h4>
                
                <div style="margin-bottom: 0.5rem;">
                    <label style="font-size: 0.75rem; display: block;">Money (Max: $${partner.money})</label>
                    <input type="number" id="trade-money-partner" min="0" max="${partner.money}" value="0" style="width: 100%; padding: 0.25rem; border: 1px solid #ccc; border-radius: 0.25rem;">
                </div>

                <div style="max-height: 150px; overflow-y: auto; border: 1px solid #eee; padding: 0.25rem;">
                    ${partnerProps.length > 0 ? partnerProps.map(t => `
                        <div style="display: flex; align-items: center; font-size: 0.75rem; margin-bottom: 0.25rem;">
                            <input type="checkbox" class="trade-prop-partner" value="${t.id}" id="prop-part-${t.id}">
                            <label for="prop-part-${t.id}" style="margin-left: 0.25rem;">Tile ${t.id} (Lvl ${t.level})</label>
                        </div>
                    `).join('') : '<span style="font-size: 0.75rem; color: #999;">No properties</span>'}
                </div>

                <div style="margin-top: 1rem; text-align: center;">
                    <button id="sign-partner" class="btn btn-secondary btn-sm" onclick="toggleTradeSignature('partner')">Sign Deal</button>
                </div>
            </div>
        </div>
        <div id="trade-status" style="text-align: center; margin-top: 1rem; font-weight: 600; font-size: 0.875rem; color: var(--color-text-muted);">Waiting for signatures...</div>
    `;

    showModal("🤝 Trade Desk", `Negotiate a deal between ${initiator.name} and ${partner.name}. Both must sign to execute.`, false, null, tradeHtml);

    // Reset signatures
    window.tradeState = {
        initiatorSigned: false,
        partnerSigned: false,
        initiatorId: initiator.id,
        partnerId: partner.id
    };

    elements.modalConfirmBtn.textContent = "Execute Trade";
    elements.modalConfirmBtn.classList.remove('hidden');
    elements.modalConfirmBtn.disabled = true;
    elements.modalConfirmBtn.onclick = () => executeTrade();
};

window.toggleTradeSignature = (side) => {
    const btn = document.getElementById(`sign-${side}`);
    const isSigned = side === 'initiator' ? window.tradeState.initiatorSigned : window.tradeState.partnerSigned;

    if (!isSigned) {
        btn.textContent = "Signed ✓";
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-success');
        if (side === 'initiator') window.tradeState.initiatorSigned = true;
        else window.tradeState.partnerSigned = true;
    } else {
        btn.textContent = "Sign Deal";
        btn.classList.remove('btn-success');
        btn.classList.add('btn-secondary');
        if (side === 'initiator') window.tradeState.initiatorSigned = false;
        else window.tradeState.partnerSigned = false;
    }

    const statusEl = document.getElementById('trade-status');
    const confirmBtn = elements.modalConfirmBtn;

    if (window.tradeState.initiatorSigned && window.tradeState.partnerSigned) {
        statusEl.textContent = "Deal is agreed! Click Execute to finalize.";
        statusEl.style.color = "var(--color-success)";
        confirmBtn.disabled = false;
    } else {
        statusEl.textContent = "Waiting for signatures...";
        statusEl.style.color = "var(--color-text-muted)";
        confirmBtn.disabled = true;
    }
};

const executeTrade = () => {
    const initiator = gameState.players.find(p => p.id === window.tradeState.initiatorId);
    const partner = gameState.players.find(p => p.id === window.tradeState.partnerId);

    const moneyInit = parseFloat(document.getElementById('trade-money-initiator').value) || 0;
    const moneyPart = parseFloat(document.getElementById('trade-money-partner').value) || 0;

    const propsInit = Array.from(document.querySelectorAll('.trade-prop-initiator:checked')).map(cb => parseInt(cb.value));
    const propsPart = Array.from(document.querySelectorAll('.trade-prop-partner:checked')).map(cb => parseInt(cb.value));

    // Validate Money
    if (moneyInit > initiator.money || moneyPart > partner.money) {
        alert("Invalid money amount! Check funds.");
        return;
    }

    // Execute Transfers
    initiator.money = parseFloat((initiator.money - moneyInit + moneyPart).toFixed(2));
    partner.money = parseFloat((partner.money - moneyPart + moneyInit).toFixed(2));

    propsInit.forEach(tileId => {
        const tile = gameState.board[tileId];
        tile.owner = partner.id;
    });

    propsPart.forEach(tileId => {
        const tile = gameState.board[tileId];
        tile.owner = initiator.id;
    });

    // Log
    let logMsg = `🤝 Trade executed between ${initiator.name} and ${partner.name}.`;
    if (moneyInit > 0) logMsg += ` ${initiator.name} paid $${moneyInit}.`;
    if (moneyPart > 0) logMsg += ` ${partner.name} paid $${moneyPart}.`;
    if (propsInit.length > 0) logMsg += ` ${initiator.name} gave Tiles ${propsInit.join(', ')}.`;
    if (propsPart.length > 0) logMsg += ` ${partner.name} gave Tiles ${propsPart.join(', ')}.`;

    gameState.gameLog.push({ time: Date.now(), message: logMsg });

    closeModal();
    syncGameState();
};

window.showInventory = () => {
    const player = gameState.players[gameState.currentPlayerIndex];
    const properties = gameState.board.filter(t => t.owner === player.id && t.type === 'property');

    const inventoryHtml = `
        <div class="inventory-container">
            <div class="inventory-section">
                <h4 style="border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">📦 Items & Abilities</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem;">
                    <div class="inv-item ${player.hasDiagonalMove ? 'active' : 'inactive'}">
                        <span>⚡ Diagonal Move</span>
                        <span>${player.hasDiagonalMove ? '✅' : '❌'}</span>
                    </div>
                    <div class="inv-item ${player.hasDiceModifier ? 'active' : 'inactive'}">
                        <span>✨ Dice Modifier</span>
                        <span>${player.hasDiceModifier ? '✅' : '❌'}</span>
                    </div>
                    <div class="inv-item active" style="grid-column: span 2; display: flex; justify-content: space-between; align-items: center;">
                        <span>🔗 Property Links: <strong>${player.propertyLinks}</strong></span>
                        ${player.propertyLinks > 0 ? `<button onclick="window.showPropertyLinkPlacement(gameState.players[gameState.currentPlayerIndex])" class="btn btn-secondary btn-sm">Place</button>` : ''}
                    </div>
                </div>
            </div>

            <div class="inventory-section" style="margin-top: 1.5rem;">
                <h4 style="border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">🏠 Properties & Earnings</h4>
                <div style="max-height: 200px; overflow-y: auto;">
                    ${properties.length > 0 ? `
                        <table style="width: 100%; font-size: 0.875rem; border-collapse: collapse;">
                            <thead>
                                <tr style="text-align: left; color: var(--color-text-muted);">
                                    <th style="padding: 0.25rem;">Tile</th>
                                    <th style="padding: 0.25rem;">Lvl</th>
                                    <th style="padding: 0.25rem; text-align: right;">Earnings</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${properties.map(p => `
                                    <tr style="border-bottom: 1px solid var(--color-bg-lighter);">
                                        <td style="padding: 0.25rem;">#${p.id}</td>
                                        <td style="padding: 0.25rem;">${p.level}</td>
                                        <td style="padding: 0.25rem; text-align: right; color: var(--color-success); font-weight: 600;">$${(p.earnings || 0).toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<p style="color: var(--color-text-muted); font-size: 0.875rem;">No properties owned.</p>'}
                </div>
            </div>
        </div>
    `;

    showModal(`🎒 ${player.name}'s Inventory`, "", false, null, inventoryHtml);
    elements.modalCancelBtn.textContent = "Close";
};
