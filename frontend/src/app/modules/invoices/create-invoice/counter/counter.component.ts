import { Component, forwardRef, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CounterComponent),
    multi: true
   }]
})
export class CounterComponent implements OnInit, ControlValueAccessor {
  private _value!: number;

  get value() {
   return this._value;
  }
  set value(val) {
    this._value = val;
    this._onChange(this._value);
  }

  constructor() { }

  ngOnInit() {}

  private _onChange(_: any) { }
  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched() {}

  writeValue(value: number): void {
    this.value = value;
  }

  incremnet(){
    this.value++;
  }
  decremnet(){
    this.value--;
  }
}
