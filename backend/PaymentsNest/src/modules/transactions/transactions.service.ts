import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
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
import { UserPlaidData } from 'src/shared/clients/administration/get-plaid-data.model';
import { PostponedPaymentInfo } from './entities/postponed-payment-info.entity';
import { PostponedPayment } from './entities/postponed-payment.entity';
import { PostponedPaymentType } from './entities/postponed-payment-type.enum';
import { CancelBillDTO } from './models/cancel-bill.model';
import { TransactionStatus } from './entities/transaction-status.enum';
import { InvoicingCancellBillDTO } from 'src/shared/clients/invoice/cancel-bill.model';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    @InjectRepository(PaymentStatistic)
    private readonly paymentStatisticRepository: Repository<PaymentStatistic>,
    @InjectRepository(PostponedPaymentInfo)
    private readonly postponedPaymentInfoRepository: Repository<PostponedPaymentInfo>,
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
  async pay(
    payBillDto: PayBillDTO,
    postponed = false
  ): Promise<CreateTransactionResponse> {
    const user = this.user();

    const bill = await this.invoiceClient.getBillById(payBillDto.billId);
    const invoice = bill.invoice;

    if (invoice.buyerId != user.companyId) {
      throw new ForbiddenException();
    }

    const billStatus = BillStatus[bill.status];
    if (billStatus === undefined) {
      throw new BadRequestException();
    }
    if (billStatus != BillStatus.Unpaid) {
      throw new BadRequestException('The bill has already been paid');
    }
    if (bill.invoice.buyerId != user.companyId) {
      throw new BadRequestException();
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

    await this.makePlaidTransaction(
      transaction,
      plaidDataBuyer,
      plaidDataSeller,
      postponed,
      payBillDto.payDate
    );

    if (postponed)
      await this.updatePaymentStatisticsOnPay(invoice.total, invoice.buyerId);
    else
      await this.updatePaymentStatisticsOnPay(
        invoice.total,
        invoice.buyerId,
        invoice.sellerId
      );

    const response: CreateTransactionResponse = {
      companyName: plaidDataSeller.companyName,
      invoiceNumber: invoice.number,
    };
    return response;
  }
  async cancelScheduledBill(cancellBillDTO: CancelBillDTO) {
    const user = this.user();
    const billId = cancellBillDTO.billId;
    const companyId = user.companyId;
    const transaction = await this.transactionsRepository.findOne({
      where: { billId },
      relations: ['plaidTransfers'],
    });

    if (transaction.sellerId != companyId && transaction.buyerId != companyId)
      throw new ForbiddenException();
    if (transaction.status != TransactionStatus.Pending)
      throw new ConflictException('The transaction has already been completed');
    const plaidDataBuyer = await this.administrationClient.getPlaidData(
      transaction.buyerId
    );

    const cancelOperation: PlaidTransferOperationDto = {
      amount: transaction.amount,
      clientInformation: plaidDataBuyer,
      description: `${transaction.id}`,
      transaction: transaction,
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    };
    await this.plaidService.makeWithdrawalTransaction(cancelOperation);

    const postponedInfo = await this.postponedPaymentInfoRepository.findOne({
      where: { transactionId: transaction.id },
    });
    await this.postponedPaymentInfoRepository.remove(postponedInfo);
    transaction.status = TransactionStatus.Cancelled;
    await this.transactionsRepository.save(transaction);

    const receivePaymentStatistic =
      await this.paymentStatisticRepository.findOne({
        where: {
          companyId: transaction.buyerId,
          tabType: TabType.Receive,
        },
      });
    receivePaymentStatistic.paid -= transaction.amount;
    await this.paymentStatisticRepository.save(receivePaymentStatistic);

    const invoicingCancelBillDTO: InvoicingCancellBillDTO = {
      ...cancellBillDTO,
      companyId: companyId,
    };
    await this.invoiceClient.cancelBill(invoicingCancelBillDTO);
  }
  private async makePlaidTransaction(
    transaction: Transaction,
    buyer: UserPlaidData,
    seller: UserPlaidData,
    postponed = false,
    payDate?: Date
  ) {
    if (postponed && !payDate) throw new Error('payDate is not set');
    const user = this.user();
    const plaidTransferOperation: PlaidTransferOperationDto = {
      amount: transaction.amount,
      clientInformation: buyer,
      description: `${transaction.id}`,
      transaction: transaction,
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    };
    await this.plaidService.makeDepositTransaction(plaidTransferOperation);
    if (!postponed) {
      plaidTransferOperation.clientInformation = seller;
      await this.plaidService.makeWithdrawalTransaction(plaidTransferOperation);
    } else {
      const postponedPaymentInfo = new PostponedPaymentInfo(
        transaction,
        seller,
        user
      );
      const postponedPayment = new PostponedPayment(
        transaction,
        payDate,
        PostponedPaymentType.Withdrawal
      );
      if (!postponedPaymentInfo.payments) postponedPaymentInfo.payments = [];
      postponedPaymentInfo.payments.push(postponedPayment);
      await this.postponedPaymentInfoRepository.save(postponedPaymentInfo);
    }
    await this.invoiceClient.markBillsAs({
      bills: [transaction.billId],
      status: BillStatus[BillStatus.Paid],
    });
  }
  private async updatePaymentStatisticsOnPay(
    paid: number,
    buyerId: number,
    sellerId?: number
  ) {
    const receivePaymentStatistic =
      await this.paymentStatisticRepository.findOne({
        where: {
          companyId: buyerId,
          tabType: TabType.Receive,
        },
      });
    receivePaymentStatistic.forPayment -= paid;
    receivePaymentStatistic.paid += paid;
    await this.paymentStatisticRepository.save(receivePaymentStatistic);
    if (sellerId) {
      const sendPaymentStatistic =
        await this.paymentStatisticRepository.findOne({
          where: {
            companyId: sellerId,
            tabType: TabType.Send,
          },
        });
      sendPaymentStatistic.forPayment -= paid;
      sendPaymentStatistic.paid += paid;
      await this.paymentStatisticRepository.save(sendPaymentStatistic);
    }
  }
}
