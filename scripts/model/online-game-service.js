import { Utils } from '../utils/utils.js';

export class OnlineGameService {
    static SERVER_URL = 'https://stone.sifs0005.infs.ch';
    static MODE = 'spock'; // Schere Stein Papier Echse Spock

    possibleHands = ['Scissors', 'Rock', 'Paper', 'Lizard', 'Spock'];

    async getRankings() {
        const response = await fetch(`${OnlineGameService.SERVER_URL}/statistics`);
        const playerState = await response.json(); // same data structure as offline

        return Utils.createRanking(playerState);
    }

    async evaluate(playerName, playerHand) {
        const params = new URLSearchParams({ playerName, playerHand, mode: OnlineGameService.MODE });
        const response = await fetch(`${OnlineGameService.SERVER_URL}/play?${params}`);
        const data = await response.json(); // for example: {"choice":"Spock","win":false}

        if (!response.ok || data.message) {
            throw new Error(data.message ?? `Server error ${response.status}`);
        }

        const systemHand = data.choice;

        // server returns {choice, win: true/false}, on a draw only {choice} -> same hand means draw
        let gameEval;
        if (systemHand === playerHand) {
            gameEval = 0;
        } else {
            gameEval = data.win ? 1 : -1;
        }

        return { gameEval, playerHand, systemHand };
    }
}
