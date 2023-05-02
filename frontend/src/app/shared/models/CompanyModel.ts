import { AddressModel } from "./AddressModel"

export interface CompanyModel{
  id: number,
  name: string,
  email: string,
  address: AddressModel,
  logo: Uint8Array | string,
  isPartner: boolean,
  isVerified:boolean,
}
