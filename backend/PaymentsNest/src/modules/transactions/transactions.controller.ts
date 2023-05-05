import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetTransactionsQuery } from './models/get-transactions.query';
import { TransactionsService } from './transactions.service';
import { PayBillDTO } from './models/pay-bill.model';

@Controller('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(@Query() query: GetTransactionsQuery) {
    return await this.transactionsService.getTransactions(query);
  }

  @Post('paynow')
  async payNow(@Body() payBillDTO: PayBillDTO) {
    return await this.transactionsService.payNow(payBillDTO);
  }
}
