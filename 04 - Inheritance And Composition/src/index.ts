import { MatchCsvFileReader } from './reader/inheritance/MatchCsvFileReader';
import { ComposedCsvDataReader } from './reader/composition/ComposedCsvDataReader';
import { MatchDataReader } from './reader/composition/MatchDataReader';
import { Summary } from './summary/Summary';
import { WinsAnalysis } from './summary/analyzer/WinsAnalysis';
import { LosesAnalysis } from './summary/analyzer/LosesAnalysis';
import { ConsoleReport } from './summary/report/ConsoleReport';
import { HtmlReport } from './summary/report/HtmlReport';
import fs from 'fs';

/*
 * Readers
 */
const csvPath = './data/football.csv'

// inheritance
const genericMatchesReader = new MatchCsvFileReader(csvPath)
genericMatchesReader.read()

// composition
const matchesDataReader = MatchDataReader.fromCsv(csvPath)
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

