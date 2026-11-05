export class Utils {
    static async wait(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    // Create ranking from playerState, for example:
    // [{rank: 1, wins: 10, players: ["Michael", "Lisa"]}, {rank: 2, wins: 5, players: ["Max"]}]
    static createRanking(playerState) {
        const players = Object.values(playerState);
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
}
