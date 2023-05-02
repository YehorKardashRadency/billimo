import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressStageComponent } from './address-stage.component';

describe('AddressStageComponent', () => {
  let component: AddressStageComponent;
  let fixture: ComponentFixture<AddressStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressStageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
