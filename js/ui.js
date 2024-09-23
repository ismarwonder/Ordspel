// ui.js
export const ui = (() => {
    // DOM-element
    const welcomeScreen = document.getElementById('welcome-screen');
    const startButton = document.getElementById('start-button');
    const gameScreen = document.getElementById('game-screen');
    const currentPlayerEl = document.getElementById('current-player');
    const wordsSaidEl = document.getElementById('words-said');
    const warningEl = document.getElementById('warning');
    const warningTextEl = document.getElementById('warning-text');
    const restartButton = document.getElementById('restart-button');
    const restartButtonVictory = document.getElementById('restart-button-victory');
    const victoryScreen = document.getElementById('victory-screen');
    const victoryPlayer = document.getElementById('victory-player');
    let timerEl = document.getElementById('timer');

    // Om timerEl inte finns, skapa det
    if (!timerEl) {
        timerEl = document.createElement('p');
        timerEl.id = 'timer';
        const playerInfoEl = document.getElementById('player-info');
        playerInfoEl.appendChild(timerEl);
    }


    // Funktioner för att hantera UI
    const showWelcomeScreen = () => {
        welcomeScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden');
    };

    const showGameScreen = () => {
        welcomeScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    };

    const updateCurrentPlayer = (playerId) => {
        currentPlayerEl.textContent = `Spelare ${playerId}'s tur`;
    };

    const updateWordsSaid = (words) => {
        wordsSaidEl.innerHTML = '';
        words.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            wordsSaidEl.appendChild(li);
        });
    };

    const showWarning = (text) => {
        warningTextEl.textContent = text;
        warningEl.classList.remove('hidden');
    };

    const hideWarning = () => {
        warningEl.classList.add('hidden');
    };

    const showRestartButton = () => {
        restartButton.classList.remove('hidden');
    };

    const hideRestartButton = () => {
        restartButton.classList.add('hidden');
    };

    const showVictoryScreen = (message) => {
        victoryPlayer.textContent = message;
        victoryScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden'); 
    };

    const hideVictoryScreen = () => {
        victoryScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden'); 
    };

    const updateTimer = (time) => {
        if (timerEl) {
            timerEl.textContent = `Tid kvar: ${time} sekunder`;
        } else {
            console.error('Timer-elementet saknas!');
        }
    };

    return {
        showWelcomeScreen,
        showGameScreen,
        updateCurrentPlayer,
        updateWordsSaid,
        showWarning,
        hideWarning,
        showRestartButton,
        hideRestartButton,
        showVictoryScreen,
        hideVictoryScreen,
        updateTimer,
        startButton,
        restartButton,
        restartButtonVictory
    };
})();
