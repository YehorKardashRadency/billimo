import { selectRole } from './../../../../store/selectors/auth.selectors';
import { openAddressEditDialog } from 'src/app/store/actions/dialog.actions';
import { toggleAddress } from 'src/app/store/actions/company-account.actions';
import { AppState } from 'src/app/store';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Address } from '../employees/resources/models/Address';
import { companyAddressesSelector,defaultAddressSelector } from 'src/app/store/selectors/company-account.selector';
import { Role } from 'src/app/modules/auth/resources/models/Role';

@Component({
  selector: 'app-adresses',
  templateUrl: './adresses.component.html',
  styleUrls: ['./adresses.component.scss']
})
export class AdressesComponent implements OnInit {
  role: Role | null = null;
  addresses$: Observable<Address[]>;
  defaultAddressId?: number;
  constructor(private store: Store<AppState>) {
    this.addresses$ = this.store.pipe(select(companyAddressesSelector));
    this.store.pipe(select(defaultAddressSelector))
      .subscribe(id => {
        this.defaultAddressId = id
      });
    this.store.pipe(select(selectRole)).subscribe(role => {this.role = role});
  }
  get canEdit() {
    return this.role==Role.Admin || this.role==Role.Director
  }
  openEditModal(address: Address) {
    this.store.dispatch(openAddressEditDialog({ address,defaultAddressId:this.defaultAddressId }));
  }
  opendAddModal() {
    this.store.dispatch(openAddressEditDialog({
      address: {
        city: '',
        country: '',
        street: '',
        title: '',
        zipCode: '',
      },
      defaultAddressId:this.defaultAddressId
    }))
  }
  toggleDefaultAddress(event: any, id: number) {
    if (event.target.checked) {
      this.store.dispatch(toggleAddress({id}));
    }
  }
  ngOnInit(): void {
  }

}
