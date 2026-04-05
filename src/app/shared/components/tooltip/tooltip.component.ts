import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent {
  @Input() text = '';
  @Input() position: TooltipPosition = 'right';

  @HostBinding('class')
  get hostClasses(): string {
    return `lyda-tooltip-host lyda-tooltip-host--${this.position}`;
  }
}
