# Inheritance And Composition

## Content

- [Setup](#setup)
- [Read Csv](#read-csv)
- [Enums](#enums)
- [Csv File Reader](#csv-file-reader)
- [Generic Csv Reader](#generic-csv-reader)
- [Composed Match Reader](#composed-match-reader)
- [Static Constructors](#static-constructors)

---

## Setup

The configuration is the same as the previous project:
```bash
npm init -y
tsc --init
mkdir src
touch src/index.ts
```
An update the `tsconfig.json` with:
```json
{
  "compilerOptions": {
    // ...
    "rootDir": "./src",                                  /* Specify the root folder within your source files. */
    // ...
    "outDir": "./build",                                   /* Specify an output folder for all emitted files. */
    // ...
  }
}
```
and the `package.json` with:
```json
{
    //...
    "scripts": {
        "start:build": "tsc -w",
        "start:run": "nodemon build/index.js",
        "start": "concurrently npm:start:*"
    },
    //...
}
```
And run the project with `npm start`

## Read Csv

In order to read a file from the file system van be used the
[**fs library**](https://nodejs.org/api/fs.html),
unfortunately it is missing also this time the types definition, 
therefore must be installed the package `@types/node` 
that includes all the node types definitions:
```bash
npm i @types/node
```

Now it is possible to read the csv file using:
```typescript
const matches = fs
    .readFileSync('./data/football.csv', {
        encoding: 'utf-8',
    })
    .split('\n')
    .map((row: string): string[] => {
        return row.split(',');
    });
```

## Enums

A simple way to analyze the wins of a team is to simply parse each line
searching for the team and check if it won:
```typescript
let manUnitedWins = 0;
for (let match of matches) {
    if (match[1] === 'Man United' && match[5] === 'H') { // home win
        manUnitedWins++;
    } else if (match[2] === 'Man United' && match[5] === 'A') { // away win
        manUnitedWins++;
    }
}
console.log(`Man United won ${manUnitedWins} games.`);
```
The down side of this approach is that it is not clear what H or A are.\
To be more clear we can use an enum:
```typescript
enum MatchResult {
    HomeWin = 'H',
    AwayWin = 'A',
    Draw = 'D',
}

let manUnitedWins = 0;
for (let match of matches) {
    if (match[1] === 'Man United' && match[5] === MatchResult.HomeWin) {
        manUnitedWins++;
    } else if (match[2] === 'Man United' && match[5] === MatchResult.AwayWin) {
        manUnitedWins++;
    }
}

console.log(`Man United won ${manUnitedWins} games.`);
```
A string can be converted into and enum using a type assertion:
```typescript
const val: string = 'H'
const matchResult: MatchResult = val as MatchResult
```

## Csv File Reader

In order to be more generic and reuse code, it is a food idea to crate a dynamic
**CsvFileReader** class:
```typescript
export class CsvFileReader {
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
```
the main code can be refactored to:
```typescript
const matchesReader = new CsvFileReader('./data/football.csv')
matchesReader.read()

enum MatchResult {
    HomeWin = 'H',
    AwayWin = 'A',
    Draw = 'D',
}

let manUnitedWins = 0;
for (let match of matchesReader.data) {
    if (match[1] === 'Man United' && match[5] === MatchResult.HomeWin) {
        manUnitedWins++;
    } else if (match[2] === 'Man United' && match[5] === MatchResult.AwayWin) {
        manUnitedWins++;
    }
}
console.log(`Man United won ${manUnitedWins} games.`);
```

### Typed Row
It is possible to improve the typization of the array using a tuple:
```typescript
type MatchData = [Date, string, string, number, number, MatchResult, string];

export class CsvFileReader {
    data: MatchData[] = [];

    constructor(public filename: string) {}

    read(): void {
        this.data = fs
            .readFileSync(this.filename, {
                encoding: 'utf-8',
            })
            .split('\n')
            .map((row: string): string[] => {
                return row.split(',');
            })
            .map((row: string[]): MatchData => {
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
```

## Generic Csv Reader

Using a generic abstract base class it is possible to reause the csv reader
functionality and cast the row type depending on the need.\
The Reader class becomes:
```typescript
export abstract class CsvFileReader<T> {
    data: T[] = [];

    constructor(public filename: string) {}

    read(): void {
        this.data = fs
            .readFileSync(this.filename, {
                encoding: 'utf-8',
            })
            .split('\n')
            .map((row: string): string[] => {
                return row.split(',');
            })
            .map(this.mapRow);
    }

    abstract mapRow(row: string[]): T;
}
```
And can be used in a new specialized class:
```typescript
export class MatchReader extends CsvFileReader<MatchData> {
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
```
the main code becomes:
```typescript
const matchesReader = new MatchReader('./data/football.csv')
matchesReader.read()

let manUnitedWins = 0;
for (let match of matchesReader.data) {
    if (match[1] === 'Man United' && match[5] === MatchResult.HomeWin) {
        manUnitedWins++;
    } else if (match[2] === 'Man United' && match[5] === MatchResult.AwayWin) {
        manUnitedWins++;
    }
}
console.log(`Man United won ${manUnitedWins} games.`);
```

## Composed Match Reader

Another is to have the data type fixed but a generic composed reader, 
so that the data can come from multiple places 
(the previous classes has been renamed to GenericCsvFileReader and MatchCsvFileReader).

The generic **DataReader** is:
```typescript
export interface ComposedDataReader {
    read(): void;
    data: string[][];
}
```
the reader can composed inside the **MatchReader**:
```typescript
export class MatchDataReader {
    matches: MatchData[] = [];

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
```
now can be be created a concrete **CsvDataReader**:
```typescript
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
```
the main code becomes:
```typescript
const composedCsvDataReader = new ComposedCsvDataReader('./data/football.csv')
const matchesDataReader = new MatchDataReader(composedCsvDataReader)
matchesDataReader.load()

let manUnitedWins = 0;
for (let match of matchesDataReader.matches) {
    if (match[1] === 'Man United' && match[5] === MatchResult.HomeWin) {
        manUnitedWins++;
    } else if (match[2] === 'Man United' && match[5] === MatchResult.AwayWin) {
        manUnitedWins++;
    }
}
console.log(`Man United won ${manUnitedWins} games.`);
```

## Generate Summary

The next step is to create a Summary class that generilizes the analize and 
the report output:
```typescript
export interface Analyzer {
    run(matches: MatchData[]): string;
}

export interface OutputTarget {
    print(report: string): void;
}

export class Summary {
    constructor(public analyzer: Analyzer, public outputTarget: OutputTarget) {}

    buildAndPrintReport(matches: MatchData[]): void {
        const report = this.analyzer.run(matches);
        this.outputTarget.print(report);
    }
}
```
concrete reports are:
```typescript
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

        return `${this.teamName} won ${wins} games.`;
    }
}

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
```
concrete output targets are:
```typescript
export class ConsoleReport implements OutputTarget {
    print(report: string): void {
        console.log(report);
    }
}

export class HtmlReport implements OutputTarget {
    constructor(public filename: string) {}

    print(report: string): void {
        const html = `
            <div>
                <h1>Analysis Output</h1>
                <div>${report}</div>
            </div>
        `;
        fs.writeFileSync(this.filename, html, { flag: 'a+' });
    }
}
```
the main code becomes:
```typescript
/*
 * Readers
 */

// inheritance
const genericMatchesReader = new MatchCsvFileReader('./data/football.csv')
genericMatchesReader.read()

// composition
const composedCsvDataReader = new ComposedCsvDataReader('./data/football.csv')
const matchesDataReader = new MatchDataReader(composedCsvDataReader)
matchesDataReader.load()

/*
 * Analyzers
 */

const winsAnalyzer = new WinsAnalysis('Man United')
const loosesAnalyzer = new LosesAnalysis('Man United')

/*
 * Output Targets
 */

const consoleReport = new ConsoleReport()

const filename = './build/report.html'
fs.rm(filename, () => {})
const htmlReport = new HtmlReport(filename)

/*
 * Summaries
 */

const winsConsoleSummary = new Summary(winsAnalyzer, consoleReport)
const winsHtmlSummary = new Summary(winsAnalyzer, htmlReport)
const losesConsoleSummary = new Summary(loosesAnalyzer, consoleReport)
const losesHtmlSummary = new Summary(loosesAnalyzer, htmlReport)

/*
 * Usage
 */

winsConsoleSummary.buildAndPrintReport(genericMatchesReader.data)
winsHtmlSummary.buildAndPrintReport(genericMatchesReader.data)
losesConsoleSummary.buildAndPrintReport(genericMatchesReader.data)
losesHtmlSummary.buildAndPrintReport(genericMatchesReader.data)

winsConsoleSummary.buildAndPrintReport(matchesDataReader.matches)
winsHtmlSummary.buildAndPrintReport(matchesDataReader.matches)
losesConsoleSummary.buildAndPrintReport(matchesDataReader.matches)
losesHtmlSummary.buildAndPrintReport(matchesDataReader.matches)

```

## Static Constructors

Since the **MatchDataReader** is used always with the **ComposedCsvDataReader**,
it is possible to create a static method inside the **MatchDataReader** that
returns directly a new instance with the desired composition:
```typescript
export class MatchDataReader {
    static fromCsv(filename: string): MatchDataReader {
        const reader = new ComposedCsvDataReader(filename);
        return new MatchDataReader(reader);
    }

    // ...
}
```
the new static constructor can be used in this way:
```typescript
const matchesDataReader = MatchDataReader.fromCsv(csvPath)
```

