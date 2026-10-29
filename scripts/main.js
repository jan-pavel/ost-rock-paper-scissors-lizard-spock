import { gameService } from './model/game-service.js';

// Dummy Code
console.log('isOnline:', gameService.isOnline);

const rankings = await gameService.getRankings();

Object.values(rankings).forEach(x=> {
    console.log(JSON.stringify(x));
});

console.log((await gameService.evaluate('Michael', gameService.possibleHands[0])).gameEval);