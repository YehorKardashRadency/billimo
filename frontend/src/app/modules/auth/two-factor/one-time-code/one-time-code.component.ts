import {
  Component,
  ElementRef,
  forwardRef,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-one-time-code',
  templateUrl: './one-time-code.component.html',
  styleUrls: ['./one-time-code.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OneTimeCodeComponent),
    multi: true
  }]
})
export class OneTimeCodeComponent implements OnInit, ControlValueAccessor {
  @ViewChildren('input') inputElements!: QueryList<ElementRef>;
  constructor() { }

  _value: string = "";

  get value(): string {
    return this._value;
  }

  set value(val: string) {
    this._value = val;

    this._onChange(this._value);
  }

  writeValue(val: string): void {
    this.value = val;
  }

  private _onChange(_: any) { }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void { }

  ngOnInit(): void { }

  sanitizeInput(event: any) {
    const inputValue = event.target.value;
    const digitsOnly = /^\d+$/.test(inputValue);
    if (!digitsOnly) {
      event.target.value = inputValue.replace(/\D/g, '');
    }

    this.writeValue(this.formString());
  }

  onPaste($event: ClipboardEvent) {
    const clipboard = $event.clipboardData?.getData('text').trim();

    // invalid, exit here
    if (!clipboard || !/\d{6}/.test(clipboard))
      return $event.preventDefault();

    // split string to array of characters
    const characters = [...clipboard];

    for(let i = 0; i < this.inputElements.length; i++){
      const currentInput = this.inputElements.get(i);
      if (currentInput)
        currentInput.nativeElement.value = characters[i];
    }

    this.writeValue(this.formString());
  }

  formString():string {
    let result = "";

    for(let i = 0; i < this.inputElements.length; i++){
      const currentInput = this.inputElements.get(i);
      if (currentInput)
        result += currentInput.nativeElement.value;
    }

    return result;
  }
}

