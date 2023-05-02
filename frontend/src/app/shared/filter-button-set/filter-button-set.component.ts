import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-button-set',
  templateUrl: './filter-button-set.component.html',
  styleUrls: ['./filter-button-set.component.scss']
})
export class FilterButtonSetComponent implements OnInit {

  @Input() set:string[] = [];
  current:number = 0;
  @Output() currentFilter:EventEmitter<number> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  currentChange(event:number){
    this.current = event; 
    this.currentFilter.emit(this.current);
  }
}
