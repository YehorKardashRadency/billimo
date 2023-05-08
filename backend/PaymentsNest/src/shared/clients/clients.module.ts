import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AdministrationClient } from './administration/administration.client';
import { InvoiceClient } from './invoice/invoice.client';
import * as https from 'https';
@Module({
  imports: [
    HttpModule.register({
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }),
  ],
  providers: [AdministrationClient, InvoiceClient],
  exports: [AdministrationClient, InvoiceClient],
})
export class ApiClientsModule {}
