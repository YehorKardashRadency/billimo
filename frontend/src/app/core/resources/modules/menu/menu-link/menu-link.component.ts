import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-menu-link',
  templateUrl: './menu-link.component.html',
  styleUrls: ['./menu-link.component.scss']
})
export class MenuLinkComponent implements OnInit {
  @Input() linkTitle!: string;
  @Input() icon!: string;
  @Input() route?: string;
  @Input() options!: boolean;
  isHover: boolean = false;
  isActive: boolean = false;
  @Output() linkClicked = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  mouseOver(){
    this.isHover = true;
  }

  mouseLeave(){
    this.isHover = false;
  }

  onRouterLinkActive(){
    this.isActive = !this.isActive;
  }

  onClick() {
    if (!this.route) {
      this.linkClicked.emit();
    }
  }
}
