// timer.js
import { game } from './game.js';
import { ui } from './ui.js';

let turnTimer;
let timeLeft = 60;

const startTimer = (duration) => {
    timeLeft = duration;
    ui.updateTimer(timeLeft);

    turnTimer = setInterval(() => {
        timeLeft--;
        ui.updateTimer(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(turnTimer);
            game.endCurrentPlayerTurn();
        }
    }, 1000);
};

const stopTimer = () => {
    clearInterval(turnTimer);
};

export { startTimer, stopTimer };
