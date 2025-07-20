import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { ExamResult } from '../database/schema';
import { ExamService } from '../services/examService';

interface CSVRow {
  IRE: string;
  Rang: string;
  ex: string;
  'Prénoms et Noms': string;
  Centre: string;
  PV: string;
  Origine: string;
  Mention: string;
}

export class CSVImporter {
  private examService = new ExamService();

  async importFromCSV(filePath: string, year: number, examType: string): Promise<void> {
    const results: ExamResult[] = [];
    let lineCount = 0;
    
    console.log(`Starting import from ${filePath}`);
    console.log(`Target: ${examType} ${year}`);

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv(['IRE', 'Rang', 'ex', 'Prénoms et Noms', 'Centre', 'PV', 'Origine', 'Mention']))
        .on('data', (row: CSVRow) => {
          try {
            lineCount++;
            // Skip the first two lines (title and header)
            if (lineCount <= 2) {
              return;
            }

            const examResult = this.parseCSVRow(row, year, examType);
            if (examResult) {
              results.push(examResult);
            }
          } catch (error) {
            console.error(`Error parsing row:`, row, error);
          }
        })
        .on('end', async () => {
          try {
            console.log(`Parsed ${results.length} records from CSV`);
            await this.examService.importExamData(results);
            console.log(`Successfully imported ${results.length} exam results`);
            resolve();
          } catch (error) {
            console.error('Error importing data to database:', error);
            reject(error);
          }
        })
        .on('error', (error: Error) => {
          console.error('Error reading CSV file:', error);
          reject(error);
        });
    });
  }

  private parseCSVRow(row: CSVRow, year: number, examType: string): ExamResult | null {
    try {
      // Clean and validate data
      const region = this.cleanString(row.IRE);
      const rankStr = this.cleanString(row.Rang);
      const studentName = this.cleanString(row['Prénoms et Noms']);
      const center = this.cleanString(row.Centre);
      const pvNumber = this.cleanString(row.PV);
      const schoolOrigin = this.cleanString(row.Origine);
      const mention = this.cleanString(row.Mention);

      // Validate required fields
      if (!region || !rankStr || !studentName || !center || !pvNumber) {
        console.warn('Skipping row with missing required fields:', row);
        return null;
      }

      // Parse rank
      const rank = parseInt(rankStr);
      if (isNaN(rank)) {
        console.warn('Invalid rank value:', rankStr);
        return null;
      }

      // Parse ex-aequo (X means ex-aequo)
      const exAequo = row.ex === 'X';

      // Determine if passed based on mention (empty mention = passed without specific mention)
      const actualMention = mention || 'Non spécifié';
      const passed = this.isPassingMention(actualMention);

      return {
        year: year,
        exam_type: examType,
        region,
        rank,
        ex_aequo: exAequo,
        student_name: studentName,
        center,
        pv_number: pvNumber,
        school_origin: schoolOrigin || 'Non spécifié',
        mention: actualMention,
        passed
      };
    } catch (error) {
      console.error('Error parsing CSV row:', error, row);
      return null;
    }
  }

  private cleanString(value: string): string {
    if (!value) return '';
    return value.toString().trim().replace(/\s+/g, ' ');
  }

  private isPassingMention(mention: string): boolean {
    if (!mention) return false;
    
    const passingMentions = ['TBIEN', 'BIEN', 'ABIEN', 'Non spécifié'];
    const normalizedMention = mention.trim();
    
    return passingMentions.includes(normalizedMention);
  }

  async importMultipleFiles(dataDir: string, year: number, examType: string): Promise<void> {
    const files = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.csv'))
      .map(file => path.join(dataDir, file));

    console.log(`Found ${files.length} CSV files to import`);

    for (const file of files) {
      try {
        console.log(`\nImporting ${file}...`);
        await this.importFromCSV(file, year, examType);
        console.log(`✅ Successfully imported ${file}`);
      } catch (error) {
        console.error(`❌ Failed to import ${file}:`, error);
      }
    }
  }
}

// CLI utility for manual imports
if (require.main === module) {
  const importer = new CSVImporter();
  
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log('Usage: node importCSV.js <csvFilePath> <year> <examType>');
    console.log('Example: node importCSV.js ./data/results.csv 2025 BEPC');
    process.exit(1);
  }

  const [csvFilePath, yearStr, examType] = args;
  const year = parseInt(yearStr);
  
  if (isNaN(year)) {
    console.error('Invalid year provided. Year must be a number.');
    process.exit(1);
  }
  
  importer.importFromCSV(csvFilePath, year, examType)
    .then(() => {
      console.log('Import completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Import failed:', error);
      process.exit(1);
    });
}
