import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef, EmbeddedViewRef, HostListener,
  Injector,
  Input, ViewContainerRef
} from '@angular/core';
import {TooltipComponent} from "../tooltip.component";

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {

  @Input() tooltip = '';
  @Input() showDelay = 0;
  @Input() hideDelay = 0;

  private componentRef: ComponentRef<any> | null = null;
  private showTimeout?: number;
  private hideTimeout?: number;
  private touchTimeout?: number;

  constructor(private elementRef: ElementRef, private appRef: ApplicationRef,
              private viewContainerRef: ViewContainerRef,
              private injector: Injector) {
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.initializeTooltip();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.setHideTooltipTimeout();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart($event: TouchEvent): void {
    $event.preventDefault();
    window.clearTimeout(this.touchTimeout);
    this.touchTimeout = window.setTimeout(this.initializeTooltip.bind(this), 500);
  }

  @HostListener('touchend')
  onTouchEnd(): void {
    window.clearTimeout(this.touchTimeout);
    this.setHideTooltipTimeout();
  }

  private initializeTooltip() {
    if (!this.componentRef) {
      window.clearInterval(this.hideDelay);
      this.componentRef = this.viewContainerRef.createComponent(TooltipComponent,
        {injector: this.injector});

      const [tooltipDOMElement] = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes;
      this.setTooltipComponentProperties();
      document.body.appendChild(tooltipDOMElement);
      this.showTimeout = window.setTimeout(this.showTooltip.bind(this), this.showDelay);
    }
  }

  private setTooltipComponentProperties() {
    if (this.componentRef) {
      this.componentRef.instance.tooltip = this.tooltip;
      const {left, right, top, bottom} = this.elementRef.nativeElement.getBoundingClientRect();

      console.log(left, right, top, bottom)

      this.componentRef.instance.left = Math.round((right - left) / 2 + left);
      this.componentRef.instance.top = Math.round(top - 20);
    }
  }

  private showTooltip() {
    if (this.componentRef !== null) {
      this.componentRef.instance.visible = true;
    }
  }

  private setHideTooltipTimeout() {
    this.hideTimeout = window.setTimeout(this.destroy.bind(this), this.hideDelay);
  }

  ngOnDestroy(): void {
   this.destroy();
  }

  destroy(): void {
    if (this.componentRef) {
      window.clearInterval(this.showTimeout);
      window.clearInterval(this.hideDelay);
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
