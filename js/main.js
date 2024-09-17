// main.js
import { ui } from './ui.js';
import { game } from './game.js';
import { speechRecognitionModule } from './speechRecognition.js';
import { startTimer, stopTimer } from './timer.js';

// Initiera spelet
const init = () => {
    console.log('Initializing game...');
    ui.showWelcomeScreen();
    game.initializePlayers();
    ui.startButton.addEventListener('click', startGame);
    ui.restartButton.addEventListener('click', restartGame);
    ui.restartButtonVictory.addEventListener('click', restartGame);
};

const startGame = () => {
    console.log('Start game button clicked.');
    ui.showGameScreen();
    game.updateCurrentPlayerDisplay();
    speechRecognitionModule.initRecognition();
    speechRecognitionModule.startRecognition();
    startTimer(60);
};

const restartGame = () => {
    console.log('Restart game button clicked.');
    stopTimer();
    speechRecognitionModule.stopRecognition();
    game.resetGame();
    speechRecognitionModule.startRecognition();
    startTimer(60);
};

document.addEventListener('DOMContentLoaded', init);
