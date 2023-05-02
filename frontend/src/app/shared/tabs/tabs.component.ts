import { Subscription } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  Directive, EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList, TemplateRef
} from '@angular/core';
import { filter } from 'rxjs';

@Directive({ selector: 'app-tab' })
export class Tab {
  active: boolean = false;
  @Input() title!: string;
  @Input() count!: number | null;
  @Input() link!: string;
  @Input() template!: TemplateRef<any>;
}


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit,OnDestroy {

  @ContentChildren(Tab) tabs!: QueryList<Tab>;
  @Input() showSearch: boolean = false;
  @Input() onSearch?: (query: string) => void;
  @Input() height = "70vh";
  @Output() templateEvent: EventEmitter<TemplateRef<any>> = new EventEmitter<TemplateRef<any>>();
  @Output() activeTabChange:EventEmitter<number> = new EventEmitter<number>();

  private routerNavigationSubscription!: Subscription;

  constructor(private router: Router) { }
 
  ngAfterContentInit(): void {
    const currentRoute = this.router.url.split('/').slice(-1)[0];
    this.setActiveTab(currentRoute);
    this.routerNavigationSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationStart))
      .subscribe((event: any) => {
        this.setActiveTab(event.url.split('/').slice(-1)[0])
      })
  }
  ngOnDestroy(): void {
    this.routerNavigationSubscription.unsubscribe();
  }

  setActiveTab(currentRoute: string) {
    for (let i = 0; i < this.tabs.length; i++) {
      const updatedTabs = this.tabs.map(t => {
        if (t.link == currentRoute) t.active = true;
        else t.active = false
        return t;
      });
      this.tabs.reset(updatedTabs);
    }
  }

  selectTab(tab: Tab) {
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);
    // activate the tab the user has clicked on.
    tab.active = true;
    this.templateEvent.emit(tab.template);
    this.activeTabChange.emit(this.tabs.toArray().findIndex(x => x === tab));
  }
}
