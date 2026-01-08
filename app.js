// Game State
let diag2Complete = true;

for (let i = 0; i < 5; i++) {
    // Top-left to bottom-right
    const cell1 = gameState.bingoBoard[i][i];
    if (i !== 2 && !gameState.markedNumbers.has(cell1)) {
        diag1Complete = false;
    }

    // Top-right to bottom-left
    const cell2 = gameState.bingoBoard[4 - i][i];
    if (i !== 2 && !gameState.markedNumbers.has(cell2)) {
        diag2Complete = false;
    }
}

if (diag1Complete) patterns.push('ዲያግናል 1');
if (diag2Complete) patterns.push('ዲያግናል 2');

// Check four corners
const corners = [
    gameState.bingoBoard[0][0], // Top-left
    gameState.bingoBoard[0][4], // Top-right
    gameState.bingoBoard[4][0], // Bottom-left
    gameState.bingoBoard[4][4]  // Bottom-right
];

if (corners.every(corner => gameState.markedNumbers.has(corner))) {
    patterns.push('አራት ማእዘኖች');
}

// Check full house (all numbers)
const totalCells = 25;
const freeSpace = 1;
const markedCount = gameState.markedNumbers.size + 1; // +1 for free space

if (markedCount >= totalCells) {
    patterns.push('ሙሉ ቤት');
}

return patterns;
}

// Claim Bingo
function claimBingo() {
    if (!gameState.gameActive) {
        showToast('ጨዋታ አልጀመረም', 'warning');
        return;
    }

    const patterns = checkWinningPatterns();
    if (patterns.length === 0) {
        showToast('የማሸነፍ ንድፍ አልተጠናቀቀም', 'error');
        return;
    }

    // Send claim to server
    sendWebSocketMessage({
        type: 'bingo_claim',
        playerId: gameState.playerId,
        playerName: gameState.playerName,
        patterns: patterns,
        markedNumbers: Array.from(gameState.markedNumbers)
    });

    showToast('የማሸነፍ ጥያቄ ቀርቧል...', 'info');
    document.getElementById('bingoBtn').disabled = true;
}

// WebSocket Functions
function connectWebSocket() {

    // ✅ FIXED HOSTED BACKEND URLs (ONLY CHANGE)
    const BACKEND_HTTP = "https://ameng-gogs-dada2-71.deno.dev";
    const wsUrl = "wss://ameng-gogs-dada2-71.deno.dev/ws";

    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log("Connected to Bingo WebSocket server");
    };
}
