import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormControlState } from '@angular/forms';
import {CurrencyPipe} from "@angular/common";


@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [CurrencyPipe]
})
export class InputComponent implements OnInit {
  @Input() control: FormControl | null = null;
  @Input() label: string = "";
  @Input() placeholder: string = "text"
  @Input() prefix?: string;
  @Input() errorMessage: string = ""
  @Input() type: string = "text"
  @Input() controlState: FormControlState<any> | null = null;
  @Input() defaultValue?: string;
  @Input() min?: string;
  @Input() disabled = false;

  @Input() currencyConfig: any = undefined
  @Input() displayClearButton: boolean = true
  @ViewChild('inputElement') inputElement?: ElementRef;


  constructor(private currencyPipe: CurrencyPipe) {
  }

  ngOnInit(): void {
    // in some cases we don't need to specify the form control (for example when using (input)="" instead)
    // but without it there will be an error so we set default value here
    if (!this.control && !this.controlState) {
      this.control = new FormControl();
    }
    if (this.defaultValue) {
      this.control?.setValue(this.defaultValue);
    }
  }

  onClear() {
    this.control?.reset();
  }

  onChangeType($event: MouseEvent) {
    const native = this.inputElement?.nativeElement as HTMLInputElement;
    native.type = (native.type == 'text' ? 'password' : 'text');
  }
}
