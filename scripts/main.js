import { gameService } from './model/game-service.js';

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
