import { termsAndConditions } from './terms-and-conditions.text';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions-modal',
  templateUrl: './terms-and-conditions-modal.component.html',
  styleUrls: ['./terms-and-conditions-modal.component.scss']
})
export class TermsAndConditionsModalComponent implements OnInit {

  constructor() { }
  termsAndConditions = termsAndConditions;
  ngOnInit(): void {
  }

}
