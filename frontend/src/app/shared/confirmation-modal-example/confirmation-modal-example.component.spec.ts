import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationModalExampleComponent } from './confirmation-modal-example.component';

describe('ConfirmationModalExampleComponent', () => {
  let component: ConfirmationModalExampleComponent;
  let fixture: ComponentFixture<ConfirmationModalExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationModalExampleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
