import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { transactions } from './transactions';

@Injectable()
export class TransactionSeederService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async create() {
    const count = await this.transactionRepository.count();
    console.log(`Found ${count} transactions`);
    if (count == 0) {
      await this.transactionRepository.save(transactions);
    } else {
      console.log('Skipping');
    }
  }
}
