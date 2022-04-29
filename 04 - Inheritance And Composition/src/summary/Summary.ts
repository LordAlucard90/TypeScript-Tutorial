import { MatchData } from '../MatchData';
import { Analyzer } from './analyzer/Analyser';
import { OutputTarget } from './report/OutputTarget';

export class Summary {
    constructor(public analyzer: Analyzer, public outputTarget: OutputTarget) {}

    buildAndPrintReport(matches: MatchData[]): void {
        const report = this.analyzer.run(matches);
        this.outputTarget.print(report);
    }
}
