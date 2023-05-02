import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit, OnChanges {
  @Input() control: FormControl | null = null;
  @Input() disableUncheck = false;
  @Input() checked = false;
  @Input() disabled = false;

  constructor() {
    if (!this.control) {
      this.control = new FormControl();
    }
    if (this.checked && this.disableUncheck) {
      this.disabled = true;
    }
    this.control?.valueChanges.subscribe(checked => {
      if (checked && this.disableUncheck) {
        this.disabled = true;
      }
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['checked']) return;
    const newValue = changes['checked']['currentValue'];
    if (this.control?.value != newValue) {
      this.control?.setValue(newValue);
      if (newValue == false) {
        this.disabled = false;
      }
    }
  }
  ngOnInit(): void {
    this.control?.setValue(this.checked, { emitEvent: false });
  }

  setValue(state: boolean, emit = true): void {
    this.checked = state;
    this.control?.setValue(state, { emitEvent: emit });
  }

  onChange($event: Event) {
    const target = $event.target as HTMLInputElement
    this.checked = target.checked;
  }
}
