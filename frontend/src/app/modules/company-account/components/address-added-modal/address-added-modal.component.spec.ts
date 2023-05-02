import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressAddedModalComponent } from './address-added-modal.component';

describe('AddressAddedModalComponent', () => {
  let component: AddressAddedModalComponent;
  let fixture: ComponentFixture<AddressAddedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressAddedModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressAddedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
