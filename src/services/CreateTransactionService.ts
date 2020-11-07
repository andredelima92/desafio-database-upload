import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  titleCategory: string;
}

class CreateTransactionService {
  public async execute({
    titleCategory,
    title,
    value,
    type,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);

    const category = await categoryRepository.findOne({
      where: { title: titleCategory },
    });

    let category_id = category?.id;

    if (!category) {
      const createdCategory = categoryRepository.create({
        title: titleCategory,
      });

      await categoryRepository.save(createdCategory);

      category_id = createdCategory.id;
    }

    const transactionRepisotry = getRepository(Transaction);

    const transaction = transactionRepisotry.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionRepisotry.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
