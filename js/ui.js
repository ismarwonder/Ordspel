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
    const victoryMessage = document.getElementById('victory-message');
    let timerEl = document.getElementById('timer');

    // Om timerEl inte finns, skapa det
    if (!timerEl) {
        timerEl = document.createElement('p');
        timerEl.id = 'timer';
        const playerInfoEl = document.getElementById('player-info');
        playerInfoEl.appendChild(timerEl);
        console.log('Timer element created dynamically.');
    }

    console.log('UI module initialized.');

    // Funktioner för att hantera UI
    const showWelcomeScreen = () => {
        console.log('Showing welcome screen.');
        welcomeScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden');
    };

    const showGameScreen = () => {
        console.log('Showing game screen.');
        welcomeScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    };

    const updateCurrentPlayer = (playerId) => {
        currentPlayerEl.textContent = `Spelare ${playerId}'s tur`;
        console.log(`Current player updated: Player ${playerId}`);
    };

    const updateWordsSaid = (words) => {
        wordsSaidEl.innerHTML = '';
        words.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            wordsSaidEl.appendChild(li);
        });
        console.log('Words said updated.');
    };

    const showWarning = (text) => {
        warningTextEl.textContent = text;
        warningEl.classList.remove('hidden');
        console.log(`Warning shown: ${text}`);
    };

    const hideWarning = () => {
        warningEl.classList.add('hidden');
        console.log('Warning hidden.');
    };

    const showRestartButton = () => {
        restartButton.classList.remove('hidden');
        console.log('Restart button shown.');
    };

    const hideRestartButton = () => {
        restartButton.classList.add('hidden');
        console.log('Restart button hidden.');
    };

    const showVictoryScreen = (message) => {
        victoryMessage.textContent = message;
        victoryScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden'); // Dölj spelet
        console.log(`Victory screen shown: ${message}`);
    };

    const hideVictoryScreen = () => {
        victoryScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden'); // Visa spelet igen om nödvändigt
        console.log('Victory screen hidden.');
    };

    const updateTimer = (time) => {
        if (timerEl) {
            timerEl.textContent = `Tid kvar: ${time} sekunder`;
            // console.log(`Timer updated: ${time} sekunder kvar.`);
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
