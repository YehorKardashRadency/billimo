import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActionsContainerComponent } from './modal-actions-container.component';

describe('ModalActionsContainerComponent', () => {
  let component: ModalActionsContainerComponent;
  let fixture: ComponentFixture<ModalActionsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalActionsContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalActionsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
