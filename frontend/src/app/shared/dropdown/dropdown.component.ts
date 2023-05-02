import { Component, forwardRef, Input, OnInit, AfterContentInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropdownComponent),
    multi: true
  }]
})
export class DropdownComponent implements OnInit, AfterContentInit, ControlValueAccessor {
  isSelectListOpen: boolean = false;
  @Input() label?: string;
  @Input() items!: string[];
  @Input() defaultValue?: string;
  @Input() placeholder?: string
  disabled = false;
  private _value!: string;
  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
    this._onChange(this._value);
  }
  constructor() {
    if (this.defaultValue &&
      !this.items.find(val => val == this.defaultValue))
      throw new Error("Default value is not in a list!");
  }
  ngAfterContentInit(): void {
    if (this.items?.length > 0 && !this.placeholder) {
      this.value = this.defaultValue ?? this.items[0];
    }
  }
  ngOnInit() {

  }

  writeValue(value: any): void {
    this.value = value;
  }

  private _onChange(_: any) { }
  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(): void { }

  openSelectList() {
    this.isSelectListOpen = !this.isSelectListOpen;
  }

  closeSelectList() {
    this.isSelectListOpen = false;
  }

  updateList(el: string) {
    this.isSelectListOpen = false;
    this.value = el;
  }
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}
