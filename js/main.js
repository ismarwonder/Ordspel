// main.js
import { ui } from './ui.js';
import { game } from './game.js';
import { speechRecognitionModule } from './speechRecognition.js';
import { startTimer, stopTimer } from './timer.js';

// Initiera spelet
const init = () => {
    ui.showWelcomeScreen();
    game.initializePlayers();
    ui.startButton.addEventListener('click', startGame);
    ui.restartButton.addEventListener('click', restartGame);
    ui.restartButtonVictory.addEventListener('click', restartGame);
};

const startGame = () => {
    ui.showGameScreen();
    game.updateCurrentPlayerDisplay();
    speechRecognitionModule.initRecognition();
    speechRecognitionModule.startRecognition();
    startTimer(60);
};

const restartGame = () => {
    stopTimer();
    speechRecognitionModule.stopRecognition();
    game.resetGame();
    speechRecognitionModule.startRecognition();
    startTimer(60);
};

document.addEventListener('DOMContentLoaded', init);
