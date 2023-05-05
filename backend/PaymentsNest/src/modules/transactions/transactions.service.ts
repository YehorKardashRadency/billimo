import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { USER } from '../user/user.provider';
import { CurrentUser } from '../user/user.model';
import { GetTransactionsQuery } from './models/get-transactions.query';
import { daysAgo } from 'src/shared/date.utils';
import { PaginatedList } from './models/paginated-list.model';
import { TransactionModel } from './models/transaction.model';
import { PayBillDTO } from './models/pay-bill.model';
import { AdministrationClient } from 'src/shared/clients/administration/administration.client';
import { InvoiceClient } from 'src/shared/clients/invoice/invoice.client';
import { BillStatus } from 'src/shared/clients/invoice/models/bill-status.enum';
import { PlaidTransferOperationDto } from '../plaid/models/plaid-transfer-operation.model';
import { PlaidService } from '../plaid/plaid.service';
import { PaymentStatistic } from '../payment-statistics/entities/payment-statistic.entity';
import { TabType } from '../payment-statistics/entities/tab-type.enum';
import { CreateTransactionResponse } from './models/create-transaction-response.model';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    @InjectRepository(PaymentStatistic)
    private readonly paymentStatisticRepository: Repository<PaymentStatistic>,
    @Inject(USER)
    private readonly user: () => CurrentUser,
    private readonly administrationClient: AdministrationClient,
    private readonly invoiceClient: InvoiceClient,
    private readonly plaidService: PlaidService
  ) {}

  async getTransactions(
    params: GetTransactionsQuery
  ): Promise<PaginatedList<TransactionModel>> {
    const user = this.user();
    const companyId = user.companyId;
    let query = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.buyer', 'buyer')
      .leftJoinAndSelect('transaction.seller', 'seller')
      .where('(transaction.buyerId = :id OR transaction.sellerId = :id)', {
        id: companyId,
      });
    if (params.SearchString) {
      query = query.andWhere(
        `
      (transaction.buyerId = :buyerId AND LOWER(seller.name) like :searchString) OR
      (transaction.sellerId = :sellerId AND LOWER(buyer.name) like :searchString)`,
        {
          buyerId: companyId,
          sellerId: companyId,
          searchString: `%${params.SearchString.toLowerCase()}%`,
        }
      );
    }
    if (params.Days) {
      const startDate = daysAgo(params.Days);
      const endDate = new Date(Date.now());
      query = query.andWhere(
        'transaction.created_date >= :startDate AND transaction.created_date <= :endDate',
        {
          startDate,
          endDate,
        }
      );
    }
    query = query.orderBy(
      'transaction.created_date',
      params.IsDescending ? 'DESC' : 'ASC'
    );
    query = query.skip((params.Page - 1) * params.Take).take(params.Take);
    const transactions = await query.getMany();

    const transactions_dto = transactions.map(
      (t) => new TransactionModel(user, t)
    );
    const list = new PaginatedList(
      transactions_dto,
      transactions.length,
      params.Take
    );
    return list;
  }
  async payNow(payBillDto: PayBillDTO): Promise<CreateTransactionResponse> {
    const user = this.user();

    const bill = await this.invoiceClient.getBillById(payBillDto.billId);
    const invoice = bill.invoice;

    const billStatus = BillStatus[bill.status];
    if (billStatus === undefined) {
      throw new BadRequestException();
    }
    if (billStatus != BillStatus.Unpaid) {
      throw new BadRequestException('The bill has already been paid');
    }

    const plaidDataBuyer = await this.administrationClient.getPlaidData(
      user.companyId,
      payBillDto.paymentMethodId
    );

    const plaidDataSeller = await this.administrationClient.getPlaidData(
      invoice.sellerId
    );
    const transaction = new Transaction(
      bill.id,
      invoice.buyerId,
      invoice.sellerId,
      invoice.total
    );
    await this.transactionsRepository.save(transaction);
    const plaidTransferOperation: PlaidTransferOperationDto = {
      amount: transaction.amount,
      clientInformation: plaidDataBuyer,
      description: `${transaction.id}`,
      transaction: transaction,
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    };
    await this.plaidService.makeDepositTransaction(plaidTransferOperation);
    plaidTransferOperation.clientInformation = plaidDataSeller;
    await this.plaidService.makeWithdrawalTransaction(plaidTransferOperation);
    await this.invoiceClient.markBillsAs({
      bills: [bill.id],
      status: BillStatus[BillStatus.Paid],
    });
    const paid = invoice.total;
    const receivePaymentStatistic =
      await this.paymentStatisticRepository.findOne({
        where: {
          companyId: invoice.buyerId,
          tabType: TabType.Receive,
        },
      });
    receivePaymentStatistic.forPayment -= paid;
    receivePaymentStatistic.paid += paid;

    const sendPaymentStatistic = await this.paymentStatisticRepository.findOne({
      where: {
        companyId: invoice.sellerId,
        tabType: TabType.Send,
      },
    });
    sendPaymentStatistic.forPayment -= paid;
    sendPaymentStatistic.paid += paid;

    await this.paymentStatisticRepository.save([
      receivePaymentStatistic,
      sendPaymentStatistic,
    ]);
    const response: CreateTransactionResponse = {
      companyName: plaidDataSeller.companyName,
      invoiceNumber: invoice.number,
    };
    return response;
  }
}
