import { Utils } from '../utils/utils.js';

export class OfflineGameService {
    static DELAY_MS = 1000;

    constructor() {
        this.possibleHands = Object.keys(this.#resultLookup);
    }

    // same data structure as server
    #playerState = {
        Markus: {
            user: 'Markus',
            win: 3,
            lost: 6,
        },
        Michael: {
            user: 'Michael',
            win: 4,
            lost: 5,
        },
        Lisa: {
            user: 'Lisa',
            win: 4,
            lost: 5,
        },
    };

    // Can be used to check if the selected hand wins/loses
    #resultLookup = {
        scissors: {
            scissors: 0,
            rock: -1,
            paper: 1,
            lizard: 1,
            spock: -1,
        },
        rock: {
            scissors: 1,
            rock: 0,
            paper: -1,
            lizard: 1,
            spock: -1,
        },
        paper: {
            scissors: -1,
            rock: 1,
            paper: 0,
            lizard: -1,
            spock: 1,
        },
        lizard: {
            scissors: -1,
            rock: -1,
            paper: 1,
            lizard: 0,
            spock: 1,
        },
        spock: {
            scissors: 1,
            rock: 1,
            paper: -1,
            lizard: -1,
            spock: 0,
        },
    };

    async getRankings() {
        // Create ranking from playerState for Example: [{rank: 1, wins: 10, players: ["Michael", "Lias"]}, {rank: 2, wins: 5, players: ["Max"]}]
        const players = Object.values(this.#playerState);
        players.sort((a, b) => b.win - a.win); // most wins first

        const ranking = [];
        for (const player of players) {
            const last = ranking[ranking.length - 1];

            if (last && last.wins === player.win) {
                last.players.push(player.user); // same wins as the previous player
            } else {
                ranking.push({ rank: ranking.length + 1, wins: player.win, players: [player.user] });
            }
        }

        return ranking;
    }

    async evaluate(playerName, playerHand) {
        // computer picks a random hand
        const randomIndex = Math.floor(Math.random() * this.possibleHands.length);
        const systemHand = this.possibleHands[randomIndex];

        // 1 = player wins, 0 = draw, -1 = player loses
        const gameEval = this.#resultLookup[playerHand][systemHand];

        // create player on first game
        if (!this.#playerState[playerName]) {
            this.#playerState[playerName] = { user: playerName, win: 0, lost: 0 };
        }

        // update statistics (draws are not counted)
        if (gameEval === 1) {
            this.#playerState[playerName].win++;
        } else if (gameEval === -1) {
            this.#playerState[playerName].lost++;
        }

        await Utils.wait(OfflineGameService.DELAY_MS); // emulate async

        return { gameEval, playerHand, systemHand };
    }
}
