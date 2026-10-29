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
        // TODO create ranking from playerState for Example: [{rank: 1, wins: 10, players: ["Michael", "Lias"]}, {rank: 2, wins: 5, players: ["Max"]}]
        return Promise.resolve(this.#playerState);
    }

    // TODO
    async evaluate(playerName, playerHand) {
        const systemHand = this.possibleHands[0];
        const gameEval = 0;

        console.log(playerName, playerHand, systemHand, gameEval);

        await Utils.wait(OfflineGameService.DELAY_MS); // emulate async

        return {gameEval, playerHand, systemHand};
    }
}
