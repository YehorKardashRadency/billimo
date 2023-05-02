import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private radioButtonSubject: Subject<boolean> = new Subject<boolean>();

  getRadioButtonValue(): Observable<boolean> {
    return this.radioButtonSubject.asObservable();
  }

  setRadioButtonValue(value: boolean) {
    this.radioButtonSubject.next(value);
  }

  choseBillId!: number;

  constructor() { }

  payBillActiveButton(billId: number) {
    this.choseBillId = billId;
  }

}
