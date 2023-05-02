import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularComponent } from './regular.component';

describe('RegularComponent', () => {
  let component: RegularComponent;
  let fixture: ComponentFixture<RegularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegularComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
