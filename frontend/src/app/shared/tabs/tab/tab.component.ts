import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {
  @Input() count!: number | null;
  @Input('tabTitle') title!: string;
  @Input() active = false;

  constructor() { }

  ngOnInit(): void {
  }
}
