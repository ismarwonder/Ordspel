// Hämta referenser till DOM-element
const welcomeScreen = document.getElementById('welcome-screen');
const startButton = document.getElementById('start-button');
const gameScreen = document.getElementById('game-screen');
const currentPlayerEl = document.getElementById('current-player');
const instructionsEl = document.getElementById('instructions');
const wordsSaidEl = document.getElementById('words-said');
const warningEl = document.getElementById('warning');
const warningTextEl = document.getElementById('warning-text');
const restartButton = document.getElementById('restart-button');
const timerEl = document.createElement('p'); // Skapar ett element för att visa timern
const playerInfoEl = document.getElementById('player-info');
playerInfoEl.appendChild(timerEl); // Lägger timern ovanför spelarinfo


// Spelvariabler
let playerCount = 2; // Du kan utöka för att låta användaren ange detta
let players = [];
let currentPlayerIndex = 0;
let wordsSaid = [];
let gameOver = false;
let turnTimer; // Timer för varje spelares tur
let timeLeft = 60; // Sekunder kvar för spelarens tur

// Taligenkänningsvariabler
let recognition;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'sv-SE';

//   recognition.onstart = () => {
//     console.log('Taligenkänning har startat');
//   };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    processTranscript(transcript);
  };

  recognition.onerror = (event) => {
    console.error('Fel under taligenkänning:', event.error);
  };

  recognition.onend = () => {
    if (!gameOver) {
      recognition.start(); // Starta om lyssningen
    }
  };
} else {
  alert('Web Speech API stöds inte i denna webbläsare.');
}

startButton.addEventListener('click', () => {
    welcomeScreen.style.display = 'none';  // Döljer välkomstskärmen
    gameScreen.style.display = 'flex';  // Visar spelet
    initializePlayers();
    updateCurrentPlayerDisplay();
    startTurnTimer(); // Startar timern när spelet börjar
    startSpeechRecognition();
  });

function initializePlayers() {
  players = [];
  for (let i = 1; i <= playerCount; i++) {
    players.push({
      id: i,
      warnings: 0,
      active: true
    });
  }
}

function getCurrentPlayer() {
  while (!players[currentPlayerIndex].active) {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  }
  return players[currentPlayerIndex];
}

function updateCurrentPlayerDisplay() {
  const currentPlayer = getCurrentPlayer();
  currentPlayerEl.textContent = `Spelare ${currentPlayer.id}'s tur`;
}

function startSpeechRecognition() {
  if (!recognition) return;

  recognition.start();
}

function processTranscript(transcript) {
    const words = transcript.toLowerCase().split(' ');
    let wordAccepted = false;
    let foundEraWord = false;
  
    // Loopa igenom transkriberade ord för att hitta ord som slutar på '-era'
    for (let word of words) {
      word = word.trim();
  
      // Kontrollera om ordet slutar med '-era'
      if (word.endsWith('era')) {
        foundEraWord = true;
        
        // Kontrollera om ordet redan har sagts
        if (wordsSaid.includes(word)) {
          handleRepeatedWord(word);
        } else {
          wordsSaid.unshift(word); // Lägg till ordet i början av listan
          updateWordList();
        //   instructionsEl.textContent = `'${word}' är accepterat!`;
          warningEl.classList.add('hidden'); // Dölj varningen
          moveToNextPlayer();
        }
        wordAccepted = true;
        break; // Endast ett ord per tur
      }
    }
  
    // Om inget giltigt '-era' ord hittades, visa ingen varning
    if (!foundEraWord) {
    //   instructionsEl.textContent = 'Inget. Försök igen.';
    } else if (!wordAccepted) {
      // Om vi hittade ett '-era'-ord men det inte accepterades (t.ex. upprepning)
      warningTextEl.textContent = 'Ordet har redan sagts! Försök med ett annat.';
      warningEl.classList.remove('hidden');
    }
}
  

function handleRepeatedWord(word) {
  const currentPlayer = getCurrentPlayer();
  currentPlayer.warnings += 1;
  if (currentPlayer.warnings === 1) {
    warningTextEl.textContent = `'${word}' har redan sagts!`;
    warningEl.classList.remove('hidden');
  } else {
    warningTextEl.textContent = `'${word}' har redan sagts! Du är ute!`;
    warningEl.classList.remove('hidden');
    currentPlayer.active = false;
    checkGameOver();
  }
  moveToNextPlayer();
}

function updateWordList() {
  wordsSaidEl.innerHTML = '';
  for (let word of wordsSaid) {
    const li = document.createElement('li');
    li.textContent = word;
    wordsSaidEl.appendChild(li);
  }
}

function moveToNextPlayer() {
    clearInterval(turnTimer); // Avslutar föregående spelares timer
    do {
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    } while (!players[currentPlayerIndex].active);
  
    updateCurrentPlayerDisplay();
    startTurnTimer(); // Startar timern för nästa spelare
}

function checkGameOver() {
    const activePlayers = players.filter(player => player.active);
    if (activePlayers.length === 1) {
      gameOver = true;
  
      // Uppdaterar instruktioner med vinnarmedddelande och ökar storleken
      instructionsEl.textContent = `Grattis Spelare ${activePlayers[0].id}, du har vunnit!`;
      instructionsEl.style.fontSize = '2.5em';  // Ökar storleken på vinstmeddelandet
  
      // Döljer ordlistan, timer, current player och varningar
      document.getElementById('word-list').classList.add('hidden');
      timerEl.classList.add('hidden');
      currentPlayerEl.classList.add('hidden');
      warningEl.classList.add('hidden');
  
      // Stoppar timern
      clearInterval(turnTimer);
  
      // Gör restart-knappen synlig med mindre storlek
      restartButton.classList.remove('hidden');
      restartButton.style.padding = '10px 20px';  // Gör knappen mindre
  
      // Stoppar röstigenkänningen
      recognition.stop();
    } else if (activePlayers.length === 0) {
      gameOver = true;
      instructionsEl.textContent = 'Ingen vann spelet!';
      instructionsEl.style.fontSize = '2.5em';  // Ökar storleken
  
      // Döljer ordlistan, timer, current player och varningar
      document.getElementById('word-list').classList.add('hidden');
      timerEl.classList.add('hidden');
      currentPlayerEl.classList.add('hidden');
      warningEl.classList.add('hidden');
  
      // Stoppar timern
      clearInterval(turnTimer);
  
      // Gör restart-knappen synlig med mindre storlek
      restartButton.classList.remove('hidden');
      restartButton.style.padding = '10px 20px';  // Gör knappen mindre
  
      // Stoppar röstigenkänningen
      recognition.stop();
    }
  }

function startTurnTimer() {
  timeLeft = 60; // Startar varje spelares tur med 60 sekunder
  updateTimerDisplay();

  turnTimer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(turnTimer);
      handleTimeOut();
    }
  }, 1000);
}

function updateTimerDisplay() {
  timerEl.textContent = `Tid kvar: ${timeLeft} sekunder`;
}
  
function handleTimeOut() {
    const currentPlayer = getCurrentPlayer();
    currentPlayer.warnings += 1;
  
    if (currentPlayer.warnings === 1) {
      warningTextEl.textContent = `Tiden är ute! Snabba dig nästa gång!`;
      warningEl.classList.remove('hidden');
    } else {
      warningTextEl.textContent = `Tiden är ute och du har redan en varning! Du är ute!`;
      warningEl.classList.remove('hidden');
      currentPlayer.active = false;
      checkGameOver();
    }
    moveToNextPlayer();
}

restartButton.addEventListener('click', () => {
    // Återställ alla variabler
    currentPlayerIndex = 0;
    wordsSaid = [];
    gameOver = false;
  
    // Dölj vinnarmeddelanden och återställ layouten
    instructionsEl.textContent = '';
    instructionsEl.style.fontSize = '1.5em'; // Återställ storleken
  
    warningEl.classList.add('hidden');
    restartButton.classList.add('hidden');
    document.getElementById('word-list').classList.remove('hidden'); // Återställ ordlistan
    timerEl.classList.remove('hidden');
    currentPlayerEl.classList.remove('hidden');
  
    // Starta timern igen
    startTurnTimer();
  
    // Starta röstigenkänningen igen
    recognition.start();
  
    initializePlayers();
    updateCurrentPlayerDisplay();
    updateWordList();
  });
 