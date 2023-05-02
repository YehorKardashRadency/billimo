import {Component, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: Select
    }
  ]
})
export class Select<T> implements ControlValueAccessor  {

  selectedItem?: T;

@Input()
Items?:T[];

@Input() myTemplate?: any;

  onChange = (paymentMethod:T) => {};

  onTouched = () => {};

  touched = false;

  disabled = false;


  choose(item: T) {
    this.markAsTouched();
    if (!this.disabled) {
      this.selectedItem = item;
      this.onChange(this.selectedItem);
    }
  }

  writeValue(item: T) {
    this.selectedItem = item;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

}
