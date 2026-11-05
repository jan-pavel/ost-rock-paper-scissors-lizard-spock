import { gameService } from './model/game-service.js';
import { Utils } from './utils/utils.js';

const WAIT_SECONDS = 3; // Wartezeit nach jedem Spiel

let playerName = ''; // Name des aktuellen Spielers

// Startseite
const startPage = document.querySelector('#start-page');
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
const historyElement = document.querySelector('#history');
const backButton = document.querySelector('#back-button');

// Rangliste anzeigen (maximal 10 Ränge)
async function renderRanking() {
    const rankings = await gameService.getRankings();

    rankingElement.innerHTML = ''; // alte Einträge entfernen

    rankings.slice(0, 10).forEach((entry) => {
        const rankTitle = document.createElement('p');
        rankTitle.className = 'rank-title';
        rankTitle.textContent = `${entry.rank}. Rang mit ${entry.wins} Siegen`;

        const rankPlayers = document.createElement('p');
        rankPlayers.textContent = entry.players.join(', ');

        rankingElement.append(rankTitle, rankPlayers);
    });
}

renderRanking();

// Spiel starten
startForm.addEventListener('submit', (event) => {
    event.preventDefault(); // verhindert das Neuladen der Seite

    playerName = nameInput.value.trim();
    if (!playerName) {
        return; // nur Leerzeichen eingegeben
    }

    playerNameElement.textContent = `${playerName}! Wähle deine Hand!`;

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

        const hand = button.dataset.hand;

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
        setHandButtonsDisabled(false);
    });
});
