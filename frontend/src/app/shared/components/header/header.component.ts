import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import {ButtonConfig} from "../../button/button.component";
import { AppState } from 'src/app/store';
import { select, Store } from '@ngrx/store';
import { selectIsVerified } from 'src/app/store/selectors/company.selectors';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() title!: string;
  @Input() icon!: string;
  @Input() primaryButton?: ButtonConfig;
  @Input() secondaryButton?: ButtonConfig;
  constructor(private store:Store<AppState>) { }

  ngOnInit(): void {
    this.companyVerification$ = this.store.pipe(select(selectIsVerified));
  }
  
  companyVerification$! :Observable<boolean>

}
