// game.js
import { ui } from './ui.js';
import { startTimer, stopTimer } from './timer.js';

export const game = (() => {
    let playerCount = 2;
    let players = [];
    let currentPlayerIndex = 0;
    let wordsSaid = [];
    let gameOver = false;

    const initializePlayers = () => {
        players = [];
        for (let i = 1; i <= playerCount; i++) {
            players.push({
                id: i,
                warnings: 0,
                active: true
            });
        }
    };

    const getCurrentPlayer = () => {
        while (!players[currentPlayerIndex].active) {
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        }
        return players[currentPlayerIndex];
    };

    const updateCurrentPlayerDisplay = () => {
        const currentPlayer = getCurrentPlayer();
        ui.updateCurrentPlayer(currentPlayer.id);
    };

    const addWord = (word) => {
        wordsSaid.unshift(word);
        ui.updateWordsSaid(wordsSaid);
    };

    const isWordRepeated = (word) => {
        return wordsSaid.includes(word);
    };

    const handleRepeatedWord = (word) => {
        const currentPlayer = getCurrentPlayer();
        currentPlayer.warnings += 1;
        if (currentPlayer.warnings === 1) {
            ui.showWarning(`'${word}' har redan sagts!`);
        } else {
            ui.showWarning(`'${word}' har redan sagts! Du är ute!`);
            currentPlayer.active = false;
            checkGameOver();
        }
        moveToNextPlayer();
    };

    const handleValidWord = (word) => {
        addWord(word);
        ui.hideWarning();
        moveToNextPlayer();
    };

    const checkGameOver = () => {
        const activePlayers = players.filter(player => player.active);
        if (activePlayers.length === 1) {
            endGame(`Spelare ${activePlayers[0].id}!`);
        } else if (activePlayers.length === 0) {
            endGame('Ingen vann spelet!');
        }
    };

    const endGame = (message) => {
        gameOver = true;
        stopTimer();
        ui.showVictoryScreen(message);
        ui.hideWarning();
        ui.hideRestartButton();
    };

    const moveToNextPlayer = () => {
        stopTimer();
        if (gameOver) return; // Lägg till denna kontroll

        do {
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        } while (!players[currentPlayerIndex].active);

        updateCurrentPlayerDisplay();
        startTimer(60);
    };

    const resetGame = () => {
        currentPlayerIndex = 0;
        wordsSaid = [];
        gameOver = false;
        ui.hideWarning();
        ui.hideRestartButton();
        ui.hideVictoryScreen();
        ui.updateWordsSaid(wordsSaid);
        initializePlayers();
        updateCurrentPlayerDisplay();
        startTimer(60);
    };

    const endCurrentPlayerTurn = () => {
        const currentPlayer = getCurrentPlayer();
        currentPlayer.warnings += 1;
        if (currentPlayer.warnings === 1) {
            ui.showWarning('Tiden är ute! Snabba dig nästa gång!');
        } else {
            ui.showWarning('Tiden är ute och du har redan en varning! Du är ute!');
            currentPlayer.active = false;
            checkGameOver();
        }
        moveToNextPlayer();
    };

    const processTranscript = (transcript) => {
        const words = transcript.toLowerCase().split(' ');
        let wordAccepted = false;
        let foundEraWord = false;

        for (let word of words) {
            word = word.trim();

            if (word.endsWith('era')) {
                foundEraWord = true;

                if (isWordRepeated(word)) {
                    handleRepeatedWord(word);
                } else {
                    handleValidWord(word);
                }
                wordAccepted = true;
                break; // Endast ett ord per tur
            }
        }

        if (!foundEraWord) {
            // Ingen åtgärd behövs om inget '-era' ord hittades
        } else if (!wordAccepted) {
            ui.showWarning('Ordet har redan sagts! Försök med ett annat.');
        }
    };

    return {
        initializePlayers,
        updateCurrentPlayerDisplay,
        processTranscript,
        endCurrentPlayerTurn,
        resetGame,
        getCurrentPlayer,
        gameOver,
        endGame
    };
})();
