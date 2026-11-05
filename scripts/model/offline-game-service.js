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
        Scissors: {
            Scissors: 0,
            Rock: -1,
            Paper: 1,
            Lizard: 1,
            Spock: -1,
        },
        Rock: {
            Scissors: 1,
            Rock: 0,
            Paper: -1,
            Lizard: 1,
            Spock: -1,
        },
        Paper: {
            Scissors: -1,
            Rock: 1,
            Paper: 0,
            Lizard: -1,
            Spock: 1,
        },
        Lizard: {
            Scissors: -1,
            Rock: -1,
            Paper: 1,
            Lizard: 0,
            Spock: 1,
        },
        Spock: {
            Scissors: 1,
            Rock: 1,
            Paper: -1,
            Lizard: -1,
            Spock: 0,
        },
    };

    async getRankings() {
        return Utils.createRanking(this.#playerState);
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
