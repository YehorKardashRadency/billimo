import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionSeederService } from './transaction.service';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionSeederService],
  exports: [TransactionSeederService],
})
export class TransactionSeederModule {}
