// speechRecognition.js
import { game } from './game.js';
import { startTimer, stopTimer } from './timer.js';

export const speechRecognitionModule = (() => {
    let recognition;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let isRecognizing = false; 
    let latestInterimTranscript = '';
    let hasFinalResult = false;
    let processingTimer = null;
    const PROCESSING_DELAY = 1000;
    let lastProcessedTranscript = ''; 

    const initRecognition = () => {
        if (SpeechRecognition) {
            if (!recognition) { 
                recognition = new SpeechRecognition();
                recognition.lang = 'sv-SE';
                recognition.continuous = true; 
                recognition.interimResults = true; 

                recognition.onstart = () => {
                    isRecognizing = true;
                };

                recognition.onresult = (event) => {
                    hasFinalResult = false; 
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        const isFinal = event.results[i].isFinal;
                        const transcript = event.results[i][0].transcript.trim();

                        if (isFinal) {
                            hasFinalResult = true;
                            game.processTranscript(transcript);
                        } else {
                            latestInterimTranscript = transcript;
                            resetProcessingTimer();
                        }
                    }
                };

                recognition.onerror = (event) => {
                    console.error('Fel under taligenkänning:', event.error);
                    console.log('Fel händelsetyp:', event.type);
                };

                recognition.onend = () => {
                    isRecognizing = false;

                    if (!hasFinalResult && latestInterimTranscript) {
                        processNewTranscript();
                    }

                    if (!game.gameOver) {
                        // Försök starta igen efter en kort fördröjning för att undvika snabb upprepning
                        setTimeout(() => {
                            startRecognition();
                        }, 1000);
                    }
                };
            }
        } else {
            alert('Web Speech API stöds inte i denna webbläsare.');
            console.error('Web Speech API stöds inte i denna webbläsare.');
        }
    };

    const startRecognition = () => {
        if (recognition && !isRecognizing && !game.gameOver) {
            try {
                recognition.start();
            } catch (error) {
                console.error('Kunde inte starta taligenkänning:', error);
            }
        } else {
            console.warn('Kan inte starta taligenkänning: den är redan igång eller spelet är över.');
        }
    };

    const stopRecognition = () => {
        if (recognition && isRecognizing) {
            recognition.stop();
        } else {
            console.warn('Kan inte stoppa taligenkänning: den är inte igång.');
        }
    };

    const resetProcessingTimer = () => {
        if (processingTimer) {
            clearTimeout(processingTimer);
        }
        processingTimer = setTimeout(() => {
            if (latestInterimTranscript) {
                processNewTranscript();
            }
        }, PROCESSING_DELAY);
    };

    const processNewTranscript = () => {
        if (latestInterimTranscript.startsWith(lastProcessedTranscript)) {
            const newTranscript = latestInterimTranscript.substring(lastProcessedTranscript.length).trim();
            if (newTranscript) {
                game.processTranscript(newTranscript);
                lastProcessedTranscript = latestInterimTranscript;
            }
        } else {
            // Om transkriptionen inte är en direkt förlängning, behandla hela transkriptionen
            game.processTranscript(latestInterimTranscript);
            lastProcessedTranscript = latestInterimTranscript;
        }
        latestInterimTranscript = '';
    };

    return {
        initRecognition,
        startRecognition,
        stopRecognition
    };
})();
