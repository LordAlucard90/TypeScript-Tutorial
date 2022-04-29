import { ComposedDataReader } from './ComposedDataReader';
import { dateStringToDate } from '../../utils';
import { MatchData } from '../../MatchData';
import { MatchResult } from '../../MatchResult';
import { ComposedCsvDataReader } from './ComposedCsvDataReader';

export class MatchDataReader {
    matches: MatchData[] = [];

    static fromCsv(filename: string): MatchDataReader {
        const reader = new ComposedCsvDataReader(filename);
        return new MatchDataReader(reader);
    }

    constructor(public reader: ComposedDataReader) {}

    load(): void {
        this.reader.read();
        this.matches = this.reader.data.map((row: string[]): MatchData => {
            return [
                dateStringToDate(row[0]),
                row[1],
                row[2],
                parseInt(row[3]),
                parseInt(row[4]),
                row[5] as MatchResult,
                row[6],
            ];
        });
    }
}
