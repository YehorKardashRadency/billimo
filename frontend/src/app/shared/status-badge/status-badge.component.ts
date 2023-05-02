import { Component, Input, OnInit } from '@angular/core';


export type BadgeStatus = "Requires Updates" | "In approval" | "Unpaid" | "Paid" | "Cancelled";

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent implements OnInit {

  @Input() status?: BadgeStatus;

  get statusStyle() {
    switch (this.status) {
      case "Requires Updates" || "Unpaid": return "badge-red";
      case "In approval": return "badge-yellow";
      case "Paid": return "badge-green";
      default: return null
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
