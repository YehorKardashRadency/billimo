import { IsDate, IsInt, IsOptional } from 'class-validator';

export class PayBillDTO {
  @IsInt()
  billId: number;

  @IsInt()
  paymentMethodId: number;

  @IsDate()
  @IsOptional()
  payDate?: Date;
}
