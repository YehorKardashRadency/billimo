import { Component, Input, OnInit } from '@angular/core';
import { IMyEntityDetail } from '../resources/models/my-entity-detail.model';

// Example of dumb component (no dependency on Store)
@Component({
  selector: 'my-entity-detail',
  templateUrl: './my-entity-detail.component.html',
  styleUrls: ['./my-entity-detail.component.scss'],
})
export class MyEntityDetailComponent implements OnInit {
    @Input() detail!: IMyEntityDetail;

  constructor(
  ) {}

  ngOnInit() {
  }
}
