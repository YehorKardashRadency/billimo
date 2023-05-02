import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  template: `
     <div class="mb-1 text-base font-medium text-center">{{getProgressPercentage()}}% complete</div>
        <div class="w-full bg-grey-6 rounded-full h-1.5 mb-4">
            <div class="bg-sgreen h-1.5 rounded-full dark:bg-blue-500" style="width: {{getProgressPercentage()}}%"></div>
      </div>
  `,
  styles: [
  ]
})
export class ProgressBarComponent implements OnInit {

  @Input() progress = 0.0;

  getProgressPercentage() {
    return Math.round(this.progress * 100);
  }
  constructor() { }

  ngOnInit(): void {
  }

}
