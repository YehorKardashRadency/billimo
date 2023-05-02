import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {
  @Input("control") control!: AbstractControl<any, any>;
  @Input() message?: string;
  constructor() { }

  ngOnInit(): void {
  }

}
