import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionRepository = getRepository(Transaction);

    const incomes = await transactionRepository.find({
      where: { type: 'income' },
    });

    const outcomes = await transactionRepository.find({
      where: { type: 'outcome' },
    });

    const incomeTotalValue = incomes
      .map(income => income.value)
      .reduce((acc, value) => acc + value);

    const outameTotalValue = outcomes
      .map(outcome => outcome.value)
      .reduce((acc, value) => acc + value);

    const total = incomeTotalValue - outameTotalValue;

    return { income: incomeTotalValue, outcome: outameTotalValue, total };
  }
}

export default TransactionsRepository;
