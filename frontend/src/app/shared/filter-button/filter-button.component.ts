import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss']
})
export class FilterButtonComponent implements OnInit {
  @Input() text:string = null!;
  @Input() active:boolean = null!;
  @Input() first:boolean = null!;
  @Input() last:boolean = null!;
  @Input() numberInSet:number = null!;
  @Output() currentChange:EventEmitter<number> = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }

  emitClick(){
    this.currentChange.emit(this.numberInSet);
  }

}
