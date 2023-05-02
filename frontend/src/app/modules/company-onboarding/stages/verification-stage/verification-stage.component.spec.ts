import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationStageComponent } from './verification-stage.component';

describe('VerificationStageComponent', () => {
  let component: VerificationStageComponent;
  let fixture: ComponentFixture<VerificationStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationStageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
