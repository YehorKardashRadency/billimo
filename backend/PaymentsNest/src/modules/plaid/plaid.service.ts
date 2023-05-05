import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferType,
  Transfer,
  TransferNetwork,
  ACHClass,
  TransferEventType,
  TransferEventSyncRequest,
  TransferEvent,
} from 'plaid';
import { PlaidTransferOperationDto } from './models/plaid-transfer-operation.model';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaidTransfer } from './entities/plaid-transfer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlaidService {
  private configuration: Configuration;
  private plaidApi: PlaidApi;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PlaidTransfer)
    private readonly transferRepository: Repository<PlaidTransfer>
  ) {
    this.configuration = new Configuration({
      basePath: PlaidEnvironments.sandbox,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': this.configService.getOrThrow('PLAID_CLIENT_ID'),
          'PLAID-SECRET': this.configService.getOrThrow('PLAID_SECRET'),
        },
      },
    });
    this.plaidApi = new PlaidApi(this.configuration);
  }

  private async createTransaction(
    model: PlaidTransferOperationDto,
    type: TransferType
  ): Promise<Transfer> {
    const transferAuthRequest: TransferAuthorizationCreateRequest = {
      type: type,
      network: TransferNetwork.Ach,
      ach_class: ACHClass.Ccd,
      access_token: model.clientInformation.accessToken,
      account_id: model.clientInformation.accountId,
      amount: model.amount.toFixed(2),
      user: {
        legal_name: model.clientInformation.companyName,
      },
      device: {
        user_agent: model.userAgent,
      },
    };

    const authorizationResponse =
      await this.plaidApi.transferAuthorizationCreate(transferAuthRequest);
    const transferAuthorization = authorizationResponse.data;
    const authorizationId = transferAuthorization.authorization.id;
    const transferRequest: TransferCreateRequest = {
      access_token: model.clientInformation.accessToken,
      account_id: model.clientInformation.accountId,
      authorization_id: authorizationId,
      amount: model.amount.toFixed(2),
      description: model.description,
    };
    const transferResponse = await this.plaidApi.transferCreate(
      transferRequest
    );
    const transfer = transferResponse.data.transfer;
    return transfer;
  }
  async makeDepositTransaction(model: PlaidTransferOperationDto) {
    const transfer = await this.createTransaction(model, TransferType.Debit);
    await this.transferRepository.save(
      new PlaidTransfer(
        model.transaction,
        TransferEventType.Pending,
        transfer.id,
        true
      )
    );
  }
  async makeWithdrawalTransaction(model: PlaidTransferOperationDto) {
    const transfer = await this.createTransaction(model, TransferType.Credit);
    await this.transferRepository.save(
      new PlaidTransfer(
        model.transaction,
        TransferEventType.Pending,
        transfer.id,
        false
      )
    );
  }
  async transferEventSync(
    afterId: number,
    count = 25
  ): Promise<TransferEvent[]> {
    const request: TransferEventSyncRequest = {
      after_id: afterId,
      count: count,
    };
    const response = await this.plaidApi.transferEventSync(request);
    return response.data.transfer_events;
  }
}
