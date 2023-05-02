import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent  implements OnInit {

  tooltip = '';
  left = 0;
  top = 0;
  visible = false;

  constructor() { }

  ngOnInit(): void { }
}
