import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface LineFile {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  titleCategory: string;
}

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {
    const csvFilePath = path.resolve(
      __dirname,
      '..',
      '..',
      'tmp',
      'import_template.csv',
    );

    const createTransaction = new CreateTransactionService();

    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);
    const lines: Array<LineFile> = [];

    parseCSV.on('data', line => {
      const [title, type, value, category] = line;

      lines.push({
        title,
        titleCategory: category,
        type,
        value: parseFloat(value),
      });
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const transactions: Transaction[] = [];

    for (const line of lines) {
      const transaction = await createTransaction.execute(line);

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
