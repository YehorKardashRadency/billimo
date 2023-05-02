import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessModalRedirectComponent } from './success-modal-redirect.component';

describe('SuccessModalRedirectComponent', () => {
  let component: SuccessModalRedirectComponent;
  let fixture: ComponentFixture<SuccessModalRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessModalRedirectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessModalRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
