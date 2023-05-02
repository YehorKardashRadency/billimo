import { NewAddress } from '../employees/resources/models/NewAddres';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "src/app/core/resources/services/api.service";
import { Address } from "../employees/resources/models/Address";
import { AddressesList } from "../employees/resources/models/Addresses";

@Injectable({
  providedIn: "root",
})
export class CompanyAccountService extends ApiService {
  constructor(
    http: HttpClient
  ) {
    super(http);
  }

  getAddresses() {
    return this.get<AddressesList>("/gateway/company/adresses");
  }
  updateAddress(updatedAddress:NewAddress) {
    return this.put<any>("/gateway/company/adress",updatedAddress)
  }
  addAddress(newAddress:NewAddress) {
    return this.post<any>("/gateway/company/adress",newAddress)
  }
  deleteAddress(id:number) {
    return this.delete<any>(`/gateway/company/address/${id}`)
  }
  toggleDefaultAddress(id: number) {
    return this.put<any>(`/gateway/company/address/toggle/${id}`)
  }
}
