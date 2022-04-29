import { Analyzer } from './Analyser';
import { MatchData } from '../../MatchData';
import { MatchResult } from '../../MatchResult';

export class LosesAnalysis implements Analyzer {
    constructor(public teamName: string) {}

    run(matches: MatchData[]): string {
        let loses = 0;

        for (let match of matches) {
            const isHomeLose = match[1] === this.teamName && match[5] === MatchResult.AwayWin;
            const isAwayLose = match[2] === this.teamName && match[5] === MatchResult.HomeWin;

            if (isHomeLose || isAwayLose) {
                loses++;
            }
        }

        return `Team ${this.teamName} loose ${loses} games.`;
    }
}
