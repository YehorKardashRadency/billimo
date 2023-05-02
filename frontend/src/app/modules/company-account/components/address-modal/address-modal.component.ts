import { defaultAddressId } from './../../../../store/reducers/company-account.reducer';
import { addAddress } from './../../../../store/actions/company-account.actions';
import { deleteAddress, updateAddress } from 'src/app/store/actions/company-account.actions';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { countriesList } from 'src/assets/countries.constant';
import { Address } from '../employees/resources/models/Address';
import { NewAddress } from '../employees/resources/models/NewAddres';

@Component({
  selector: 'app-address-modal',
  templateUrl: './address-modal.component.html',
  styleUrls: ['./address-modal.component.scss']
})
export class AddressModalComponent implements OnInit {

  form: FormGroup = new FormGroup({
    'title': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]),
    'country': new FormControl('', [Validators.required]),
    'city': new FormControl('', [Validators.required]),
    'street': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(85)]),
    'apartment': new FormControl('', [Validators.minLength(2), Validators.maxLength(85)]),
    'zipCode': new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
    'isDefault': new FormControl(false)
  });
  public get editMode() {
    return this.data.address.id != undefined;
  }
  countries = countriesList;
  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    const form = {
      id: this.data.address.id,
      title: this.form.get('title')!.value,
      city: this.form.get('city')!.value,
      country: this.form.get('country')!.value,
      street: this.form.get('street')!.value,
      zipCode: this.form.get('zipCode')!.value,
      apartment: this.form.get('apartment')?.value,
      isDefault: this.form.get('isDefault')!.value
    } as NewAddress;
    if (form.id) {
      this.store.dispatch(updateAddress({address:form}))
    }
    else {
      this.store.dispatch(addAddress({address:form}))
    }
  }
  onDelete() {
    const id = this.data.address.id;
    if (id) {
      this.store.dispatch(deleteAddress({ id }));
    }
  }
  constructor(public dialogRef: MatDialogRef<AddressModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { address: Address, defaultAddressId:number },
    private store:Store<AppState>) { }

  ngOnInit(): void {
  }
  getFormControl(controlName: string) {
    return this.form.get(controlName) as FormControl;
  }
}
