// speechRecognition.js
import { game } from './game.js';
import { startTimer, stopTimer } from './timer.js';

export const speechRecognitionModule = (() => {
    let recognition;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let isRecognizing = false; // Flagga för att spåra tillståndet

    const initRecognition = () => {
        if (SpeechRecognition) {
            if (!recognition) { // Initiera endast om inte redan initierad
                recognition = new SpeechRecognition();
                recognition.lang = 'sv-SE';
                recognition.continuous = true; // För kontinuerlig igenkänning

                recognition.onstart = () => {
                    isRecognizing = true;
                    console.log('Taligenkänning startad.');
                };

                recognition.onresult = (event) => {
                    const transcript = event.results[event.results.length - 1][0].transcript;
                    console.log(`Taligenkänning result: ${transcript}`);
                    game.processTranscript(transcript);
                };

                recognition.onerror = (event) => {
                    console.error('Fel under taligenkänning:', event.error);
                };

                recognition.onend = () => {
                    isRecognizing = false;
                    console.log('Taligenkänning avslutad.');
                    if (!game.gameOver) {
                        // Försök starta igen efter en kort fördröjning för att undvika snabb upprepning
                        setTimeout(() => {
                            console.log('Försöker starta taligenkänning igen.');
                            startRecognition();
                        }, 1000);
                    }
                };
                console.log('SpeechRecognition initierad.');
            }
        } else {
            alert('Web Speech API stöds inte i denna webbläsare.');
        }
    };

    const startRecognition = () => {
        if (recognition && !isRecognizing && !game.gameOver) {
            try {
                recognition.start();
                console.log('Taligenkänning startas.');
            } catch (error) {
                console.error('Kunde inte starta taligenkänning:', error);
            }
        } else {
            console.log('Taligenkänning är redan igång eller spelet är över.');
        }
    };

    const stopRecognition = () => {
        if (recognition && isRecognizing) {
            recognition.stop();
            console.log('Taligenkänning stoppad.');
        } else {
            console.log('Taligenkänning var inte igång.');
        }
    };

    return {
        initRecognition,
        startRecognition,
        stopRecognition
    };
})();
