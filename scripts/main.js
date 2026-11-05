import { gameService } from './model/game-service.js';
import { Utils } from './utils/utils.js';

const WAIT_SECONDS = 3; // Wartezeit nach jedem Spiel

let playerName = ''; // Name des aktuellen Spielers

// Startseite
const startPage = document.querySelector('#start-page');
const modeButton = document.querySelector('#mode-button');
const rankingTitle = document.querySelector('#ranking-title');
const rankingElement = document.querySelector('#ranking');
const startForm = document.querySelector('#start-form');
const nameInput = document.querySelector('#name');

// Spielseite
const gamePage = document.querySelector('#game-page');
const playerNameElement = document.querySelector('#player-name');
const handButtons = document.querySelectorAll('[data-hand]');
const playerHandElement = document.querySelector('#player-hand');
const systemHandElement = document.querySelector('#system-hand');
const resultElement = document.querySelector('#result');
const countdownElement = document.querySelector('#countdown');
const gameErrorElement = document.querySelector('#game-error');
const historyElement = document.querySelector('#history');
const backButton = document.querySelector('#back-button');

// Rangliste anzeigen (maximal 10 Ränge)
async function renderRanking() {
    let rankings;
    try {
        rankings = await gameService.getRankings();
    } catch {
        rankingElement.textContent = 'Rangliste konnte nicht geladen werden.';
        return;
    }

    rankingElement.innerHTML = ''; // alte Einträge entfernen

    rankings.slice(0, 10).forEach((entry) => {
        const rankTitle = document.createElement('p');
        rankTitle.className = 'rank-title';
        const winsText = entry.wins === 1 ? 'Sieg' : 'Siegen';
        rankTitle.textContent = `${entry.rank}. Rang mit ${entry.wins} ${winsText}`;

        const rankPlayers = document.createElement('p');
        rankPlayers.textContent = entry.players.join(', ');

        rankingElement.append(rankTitle, rankPlayers);
    });
}

renderRanking();

// Zwischen Lokal und Server wechseln
modeButton.addEventListener('click', () => {
    gameService.isOnline = !gameService.isOnline;

    modeButton.textContent = gameService.isOnline ? 'Wechsle zu Lokal' : 'Wechsle zu Server';
    rankingTitle.textContent = gameService.isOnline ? 'Server-Rangliste' : 'Lokale Rangliste';

    renderRanking();
});

// Spiel starten
startForm.addEventListener('submit', (event) => {
    event.preventDefault(); // verhindert das Neuladen der Seite

    playerName = nameInput.value.trim();
    if (!playerName) {
        return; // nur Leerzeichen eingegeben
    }

    playerNameElement.textContent = `${playerName}! Wähle deine Hand!`;
    historyElement.replaceChildren(); // History für das neue Spiel leeren

    startPage.hidden = true;
    gamePage.hidden = false;
});

// Ergebnis (gameEval) in Text umwandeln
const resultTexts = {
    1: 'Du',
    0: 'Unentschieden',
    '-1': 'Computer',
};

// Alle Hand-Buttons sperren bzw. freigeben
function setHandButtonsDisabled(disabled) {
    handButtons.forEach((button) => {
        button.disabled = disabled;
    });
}

// Wartezeit mit Countdown
async function waitWithCountdown() {
    for (let seconds = WAIT_SECONDS; seconds > 0; seconds--) {
        countdownElement.textContent = `Nächste Runde in ${seconds}`;
        await Utils.wait(1000);
    }
    countdownElement.textContent = '';
}

// Spielzug
handButtons.forEach((button) => {
    button.addEventListener('click', async () => {
        setHandButtonsDisabled(true); // keine Eingaben während Auswertung und Wartezeit
        gameErrorElement.textContent = '';

        const hand = button.dataset.hand;

        try {
            const { gameEval, playerHand, systemHand } = await gameService.evaluate(playerName, hand);

            // Ergebnis anzeigen
            playerHandElement.textContent = playerHand;
            systemHandElement.textContent = systemHand;
            resultElement.textContent = resultTexts[gameEval];

            // History-Eintrag (neuster Eintrag zuoberst)
            const row = historyElement.insertRow(0);
            row.insertCell().textContent = resultTexts[gameEval];
            row.insertCell().textContent = playerHand;
            row.insertCell().textContent = systemHand;

            await waitWithCountdown(); // Ergebnis bleibt währenddessen sichtbar
        } catch {
            gameErrorElement.textContent = 'Das Spiel konnte nicht ausgewertet werden. Bitte versuche es nochmals.';
        } finally {
            setHandButtonsDisabled(false); // Buttons immer wieder freigeben, auch nach einem Fehler
        }
    });
});

// Zurück zur Startseite
backButton.addEventListener('click', () => {
    // Ergebnisanzeige leeren
    playerHandElement.textContent = '';
    systemHandElement.textContent = '';
    resultElement.textContent = '';
    gameErrorElement.textContent = '';

    nameInput.value = ''; // Namensfeld leeren

    gamePage.hidden = true;
    startPage.hidden = false;
    renderRanking(); // Rangliste mit den neuen Siegen anzeigen
});
