import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesTableWrapperComponent } from './invoices-table-wrapper.component';

describe('InvoicesTableWrapperComponent', () => {
  let component: InvoicesTableWrapperComponent;
  let fixture: ComponentFixture<InvoicesTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicesTableWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicesTableWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
