import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentStatistic } from '../payment-statistics/entities/payment-statistic.entity';
import { Repository } from 'typeorm';
import {
  CreatePaymentStatisticMessage,
  UpdatePaymentStatisticMessage,
} from './models';
import { TabType } from '../payment-statistics/entities/tab-type.enum';
import { Company } from 'src/shared/entities/company.entity';

@Injectable()
export class ConsumersService {
  constructor(
    @InjectRepository(PaymentStatistic)
    private readonly paymentStatisticRepository: Repository<PaymentStatistic>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) {}
  async updatePaymentStatistic(message: UpdatePaymentStatisticMessage) {
    if (message.sellerId) {
      const senderPaymentStatistic =
        await this.paymentStatisticRepository.findOne({
          where: {
            companyId: message.sellerId,
            tabType: TabType.Send,
          },
        });
      if (!senderPaymentStatistic) {
        throw new Error(
          `Payment statistic with companyId:${message.buyerId} not found`
        );
      }
      senderPaymentStatistic.forPayment += parseFloat(message.forPayment);
      this.paymentStatisticRepository.save(senderPaymentStatistic);
    }
    if (message.buyerId) {
      const buyerPaymentStatistic =
        await this.paymentStatisticRepository.findOne({
          where: {
            companyId: message.buyerId,
            tabType: TabType.Receive,
          },
        });
      if (!buyerPaymentStatistic) {
        throw new Error(
          `Payment statistic with companyId:${message.buyerId} not found`
        );
      }
      buyerPaymentStatistic.forPayment += parseFloat(message.forPayment);
      this.paymentStatisticRepository.save(buyerPaymentStatistic);
    }
  }
  async createPaymentStatistic(message: CreatePaymentStatisticMessage) {
    let company = await this.companyRepository.findOne({
      where: { id: message.companyId },
    });
    if (!company) {
      company = new Company(message.companyName, message.companyId);
      await this.companyRepository.save(company);
    }
    const sendStatistic = new PaymentStatistic(company.id, TabType.Send, 0, 0);
    const receiveStatistic = new PaymentStatistic(
      company.id,
      TabType.Receive,
      0,
      0
    );
    await this.companyRepository.save([sendStatistic, receiveStatistic]);
  }
}
