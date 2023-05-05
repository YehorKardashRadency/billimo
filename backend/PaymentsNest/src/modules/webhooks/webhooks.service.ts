import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaidTransfersEventSync } from './entities/plaid-transfers-event-sync.entity';
import { In, Repository } from 'typeorm';
import { PlaidService } from '../plaid/plaid.service';
import { PlaidTransfer } from '../plaid/entities/plaid-transfer.entity';
import { TransferEventType } from 'plaid';
import { TransactionStatus } from '../transactions/entities/transaction-status.enum';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(PlaidTransfersEventSync)
    private readonly transfersEventSyncRepository: Repository<PlaidTransfersEventSync>,
    @InjectRepository(PlaidTransfer)
    private readonly plaidTransferRepository: Repository<PlaidTransfer>,
    private readonly plaidService: PlaidService
  ) {}
  async updateTransfers() {
    let lastEvent = await this.transfersEventSyncRepository.findOne({
      where: { id: 1 },
    });
    if (!lastEvent) {
      lastEvent = new PlaidTransfersEventSync(0);
      await this.transfersEventSyncRepository.save(lastEvent);
    }
    while (true) {
      const events = await this.plaidService.transferEventSync(
        lastEvent.lastEventId,
        25
      );
      if (events == null || events.length == 0) break;
      lastEvent.lastEventId = events[0].event_id;
      const transferIds = events.map((x) => x.transfer_id);
      // const events = [];
      const transferChangeEvent = await this.plaidTransferRepository.find({
        where: { transferId: In(transferIds) },
      });
      if (transferChangeEvent.length == 0) {
        continue;
      }
      for (const event of events) {
        const transferInd = transferChangeEvent.findIndex(
          (x) => x.transferId === event.transfer_id
        );
        if (transferInd != -1) {
          transferChangeEvent[transferInd].eventType = event.event_type;
          transferChangeEvent[transferInd].transactionStatusUpdated = true;
        }
      }
      await this.plaidTransferRepository.save(transferChangeEvent);
    }
    await this.transfersEventSyncRepository.save(lastEvent);
  }
  async updateTransactionStatus() {
    const updatedPlaidTransfers = await this.plaidTransferRepository.find({
      where: { transactionStatusUpdated: true },
      relations: ['transaction'],
    });
    for (let i = 0; i < updatedPlaidTransfers.length; i++) {
      updatedPlaidTransfers[i].transactionStatusUpdated = false;
      if (
        updatedPlaidTransfers[i].eventType == TransferEventType.Cancelled ||
        updatedPlaidTransfers[i].eventType == TransferEventType.Failed ||
        updatedPlaidTransfers[i].eventType == TransferEventType.Returned
      ) {
        updatedPlaidTransfers[i].transaction.status = TransactionStatus.Failed;
      } else if (
        updatedPlaidTransfers[i].eventType == TransferEventType.Settled
      ) {
        updatedPlaidTransfers[i].transaction.status = TransactionStatus.Settled;
      } else if (
        updatedPlaidTransfers[i].eventType == TransferEventType.Posted ||
        updatedPlaidTransfers[i].eventType == TransferEventType.Pending
      ) {
        updatedPlaidTransfers[i].transaction.status = TransactionStatus.Posted;
      }
    }
    this.plaidTransferRepository.save(updatedPlaidTransfers);
  }
}
