import fs from 'fs';
import { ComposedDataReader } from './ComposedDataReader';

export class ComposedCsvDataReader implements ComposedDataReader {
    data: string[][] = [];
    constructor(public filename: string) {}

    read(): void {
        this.data = fs
            .readFileSync(this.filename, {
                encoding: 'utf-8',
            })
            .split('\n')
            .map((row: string): string[] => {
                return row.split(',');
            });
    }
}
