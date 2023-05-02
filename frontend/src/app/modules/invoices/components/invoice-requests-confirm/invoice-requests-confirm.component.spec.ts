import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceRequestsConfirmComponent } from './invoice-requests-confirm.component';

describe('InvoiceRequestsConfirmComponent', () => {
  let component: InvoiceRequestsConfirmComponent;
  let fixture: ComponentFixture<InvoiceRequestsConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceRequestsConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceRequestsConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
