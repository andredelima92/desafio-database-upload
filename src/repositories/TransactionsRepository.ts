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

    const balance: Balance = { income: 0, outcome: 0, total: 0 };

    const incomes = await transactionRepository.find({
      where: { type: 'income' },
    });

    const outcomes = await transactionRepository.find({
      where: { type: 'outcome' },
    });

    balance.income = incomes.reduce(
      (acc, income) => (income.type === 'income' ? acc + income.value : acc),
      0,
    );

    balance.outcome = outcomes.reduce(
      (acc, outcome) =>
        outcome.type === 'outcome' ? acc + outcome.value : acc,
      0,
    );

    balance.total = balance.income - balance.outcome;

    return balance;
  }
}

export default TransactionsRepository;
