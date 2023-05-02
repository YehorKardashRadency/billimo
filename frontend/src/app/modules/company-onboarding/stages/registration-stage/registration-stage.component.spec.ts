import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationStageComponent } from './registration-stage.component';

describe('RegistrationStageComponent', () => {
  let component: RegistrationStageComponent;
  let fixture: ComponentFixture<RegistrationStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationStageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
