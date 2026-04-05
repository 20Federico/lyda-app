import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  Directive,
  ElementRef,
  HostListener,
  Injector,
  Input,
  OnDestroy,
} from '@angular/core';
import { TooltipComponent, TooltipPosition } from '../../components/tooltip/tooltip.component';

@Directive({
  selector: '[lydaTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('lydaTooltip') tooltipText: string | null | undefined = '';
  @Input() lydaTooltipPosition: TooltipPosition = 'right';

  private tooltipRef?: ComponentRef<TooltipComponent>;
  private showTimeoutId?: ReturnType<typeof setTimeout>;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private appRef: ApplicationRef,
    private injector: Injector,
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.hasValidTooltipText() || this.tooltipRef || this.showTimeoutId) {
      return;
    }

    this.showTimeoutId = setTimeout(() => {
      this.showTimeoutId = undefined;

      if (!this.hasValidTooltipText() || this.tooltipRef) {
        return;
      }

      this.tooltipRef = createComponent(TooltipComponent, {
        environmentInjector: this.appRef.injector,
        elementInjector: this.injector,
      });

      this.tooltipRef.instance.text = this.tooltipText!.trim();
      this.tooltipRef.instance.position = this.lydaTooltipPosition;

      this.appRef.attachView(this.tooltipRef.hostView);
      document.body.appendChild(this.tooltipRef.location.nativeElement);

      this.setPosition();
    }, 500);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.clearShowTimeout();
    this.destroyTooltip();
  }

  ngOnDestroy(): void {
    this.clearShowTimeout();
    this.destroyTooltip();
  }

  private hasValidTooltipText(): boolean {
    return typeof this.tooltipText === 'string' && this.tooltipText.trim().length > 0;
  }

  private clearShowTimeout(): void {
    if (this.showTimeoutId) {
      clearTimeout(this.showTimeoutId);
      this.showTimeoutId = undefined;
    }
  }

  private setPosition(): void {
    if (!this.tooltipRef) return;

    const hostEl = this.elementRef.nativeElement;
    const tooltipEl = this.tooltipRef.location.nativeElement as HTMLElement;

    const hostRect = hostEl.getBoundingClientRect();

    tooltipEl.style.top = '0';
    tooltipEl.style.left = '0';

    requestAnimationFrame(() => {
      const tooltipRect = tooltipEl.getBoundingClientRect();
      const gap = 10;

      let top = 0;
      let left = 0;

      switch (this.lydaTooltipPosition) {
        case 'top':
          top = hostRect.top - tooltipRect.height - gap;
          left = hostRect.left + hostRect.width / 2 - tooltipRect.width / 2;
          break;

        case 'bottom':
          top = hostRect.bottom + gap;
          left = hostRect.left + hostRect.width / 2 - tooltipRect.width / 2;
          break;

        case 'left':
          top = hostRect.top + hostRect.height / 2 - tooltipRect.height / 2;
          left = hostRect.left - tooltipRect.width - gap;
          break;

        case 'right':
        default:
          top = hostRect.top + hostRect.height / 2 - tooltipRect.height / 2;
          left = hostRect.right + gap;
          break;
      }

      tooltipEl.style.top = `${top + window.scrollY}px`;
      tooltipEl.style.left = `${left + window.scrollX}px`;
    });
  }

  private destroyTooltip(): void {
    if (!this.tooltipRef) return;

    this.appRef.detachView(this.tooltipRef.hostView);
    this.tooltipRef.destroy();
    this.tooltipRef = undefined;
  }
}
