import { Component, Input, TemplateRef, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { BgColorScheme, TooltipPosition } from '../../models';
import { animate, style, transition, trigger } from '@angular/animations';

/**
 * This component will be used to show custom tooltip
 *
 * This component will be rendered using OverlayModule of angular material
 * This component will be rendered by directive on an Overlay
 *
 * CONSUMER will not be using this component directly
 * This component will be hosted in an overlay by ToolTipRenderer directive
 * This component exposes two properties. These two properties will be filled by ToolTipRenderer directive
 * 1. text - This is a simple string which is to be shown in the tooltip; This will be injected in the ToolTipRenderer directive
 *    by the consumer
 * 2. contentTemplate - This gives finer control on the content to be shwon in the tooltip
 *
 * NOTE - ONLY one should be specified; If BOTH are specified then "template" will be rendered and "text" will be ignored
 */
@Component({
  selector: 'app-custom-tooltip',
  templateUrl: './custom-tooltip.component.html',
  styleUrls: ['./custom-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tooltip', [
      transition(':enter', [style({ opacity: 0 }), animate(100, style({ opacity: 1 }))]),
      transition(':leave', [animate(100, style({ opacity: 0 }))]),
    ]),
  ],
})
export class CustomTooltipComponent {
  @HostBinding('@tooltip')
  animation = true;
  /**
   * This is simple text which is to be shown in the tooltip
   */
  @Input() tooltipText: string;

  /**
   * This provides finer control on the content to be visible on the tooltip
   * This template will be injected in McToolTipRenderer directive in the consumer template
   * <ng-template #template>
   *  content.....
   * </ng-template>
   */
  @Input() tooltipTemplate: TemplateRef<unknown>;

  @Input()
  tooltipBgColor: BgColorScheme;

  @Input()
  position: TooltipPosition;

  @Input()
  maxWidth: string;

  @HostBinding('class')
  private get classes(): string {
    return `${this.tooltipBgColor} ${this.position} ${this.maxWidth}`;
  }
}
