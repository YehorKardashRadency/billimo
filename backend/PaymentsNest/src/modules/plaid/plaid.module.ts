import { Module } from '@nestjs/common';
import { PlaidService } from './plaid.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaidTransfer } from './entities/plaid-transfer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlaidTransfer])],
  providers: [PlaidService],
  exports: [PlaidService],
})
export class PlaidModule {}
