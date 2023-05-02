import { TemplatesActions } from './../../resources/state/actions/templates.actions';
import { templatesLoadingSelector, templatesEmptySelector } from './../../resources/state/selectors/templates.selectors';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { templatesSelector } from '../../resources/state/selectors/templates.selectors';
import { Invoice } from '../../resources/models/Invoice';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {
  constructor(private store: Store<AppState>, readonly router: Router) { }

  isEmpty = false;
  isLoading = true;
  templates$ = this.store.pipe(
    select(templatesSelector)
  );

  

  ngOnInit(): void {
    this.store.pipe(select(templatesLoadingSelector)).subscribe(loading => this.isLoading = loading)
    this.store.pipe(select(templatesEmptySelector)).subscribe(empty => this.isEmpty = empty)
  }

  onTemplateClick(template: Invoice) {
    this.store.dispatch(TemplatesActions.openTemplateDialog({
      data: {
        invoice: template,
      }
    }))
  }

}
