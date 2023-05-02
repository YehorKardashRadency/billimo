import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCompaniesDropdownComponent } from './all-companies-dropdown.component';

describe('AllCompaniesDropdownComponent', () => {
  let component: AllCompaniesDropdownComponent;
  let fixture: ComponentFixture<AllCompaniesDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllCompaniesDropdownComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AllCompaniesDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
