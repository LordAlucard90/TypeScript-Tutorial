import { GenericCsvFileReader } from "./GenericCsvFileReader"
import { dateStringToDate } from '../../utils';
import { MatchData } from "../../MatchData";
import { MatchResult } from '../../MatchResult';

export class MatchCsvFileReader extends GenericCsvFileReader<MatchData> {
    mapRow(row: string[]): MatchData {
        return [
            dateStringToDate(row[0]),
            row[1],
            row[2],
            parseInt(row[3]),
            parseInt(row[4]),
            row[5] as MatchResult,
            row[6],
        ];
    }
}
