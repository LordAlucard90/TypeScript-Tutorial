import { Analyzer } from './Analyser';
import { MatchData } from '../../MatchData';
import { MatchResult } from '../../MatchResult';

export class WinsAnalysis implements Analyzer {
    constructor(public teamName: string) {}

    run(matches: MatchData[]): string {
        let wins = 0;

        for (let match of matches) {
            const isHomeWin = match[1] === this.teamName && match[5] === MatchResult.HomeWin;
            const isAwayWin = match[2] === this.teamName && match[5] === MatchResult.AwayWin;

            if (isHomeWin || isAwayWin) {
                wins++;
            }
        }

        return `Team ${this.teamName} won ${wins} games.`;
    }
}
