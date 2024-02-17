import { Directive, Input, TemplateRef, ElementRef, HostListener, ComponentRef, OnDestroy } from '@angular/core';
import { ConnectedPosition, Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { CustomTooltipComponent } from '../../components';
import { BgColorScheme } from '../../models';

import { ComponentPortal } from '@angular/cdk/portal';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

const positionMapping: { [key: string]: ConnectedPosition } = {
  top: {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -10,
  },
  bottom: {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: 10,
  },
  left: {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -10,
  },
  right: {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 10,
  },
};

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[customTooltip]',
})
export class TooltipRendererDirective implements OnDestroy {
  private _overlayRef: OverlayRef;

  /**
   * This will be used to show tooltip or not
   * This can be used to show the tooltip conditionally
   */
  @Input()
  showTooltip = true;

  @Input()
  showTooltipOnlyOnOverflow = false;

  @Input()
  tooltipBgColor: BgColorScheme = 'green';

  @Input()
  position: TooltipPosition = 'top';

  //If this is specified then specified text will be showin in the tooltip
  @Input()
  text: string;

  //If this is specified then specified template will be rendered in the tooltip
  @Input()
  contentTemplate: TemplateRef<any>;

  private get isOverflow(): boolean {
    return this._elementRef.nativeElement.offsetWidth < this._elementRef.nativeElement.scrollWidth;
  }

  constructor(
    private _overlay: Overlay,
    private _overlayPositionBuilder: OverlayPositionBuilder,
    private _elementRef: ElementRef
  ) {}

  /**
   * Destroy lifecycle event handler
   * This method will make sure to close the tooltip
   * It will be needed in case when app is navigating to different page
   * and user is still seeing the tooltip; In that case we do not want to hang around the
   * tooltip after the page [on which tooltip visible] is destroyed
   */
  ngOnDestroy() {
    this.closeToolTip();
  }

  /**
   * This method will be called whenever mouse enters in the Host element
   * i.e. where this directive is applied
   * This method will show the tooltip by instantiating the McToolTipComponent and attaching to the overlay
   */
  @HostListener('mouseenter')
  private show() {
    if (!this.showTooltip) {
      return;
    }

    if (this.showTooltip && this.showTooltipOnlyOnOverflow && !this.isOverflow) {
      return;
    }

    if (this.text || this.contentTemplate) {
      const positionStrategy = this._overlayPositionBuilder.flexibleConnectedTo(this._elementRef).withPositions([
        {
          ...positionMapping[this.position],
        },
      ]);

      this._overlayRef = this._overlay.create({ positionStrategy });

      //attach the component if it has not already attached to the overlay
      if (this._overlayRef && !this._overlayRef.hasAttached()) {
        const tooltipRef: ComponentRef<CustomTooltipComponent> = this._overlayRef.attach(
          new ComponentPortal(CustomTooltipComponent)
        );
        tooltipRef.instance.text = this.text;
        tooltipRef.instance.contentTemplate = this.contentTemplate;
        tooltipRef.instance.tooltipBgColor = this.tooltipBgColor;
        tooltipRef.instance.position = this.position;
      }
    }
  }

  /**
   * This method will be called when mouse goes out of the host element
   * i.e. where this directive is applied
   * This method will close the tooltip by detaching the overlay from the view
   */
  @HostListener('mouseleave')
  private hide() {
    this.closeToolTip();
  }

  /**
   * This method will close the tooltip by detaching the component from the overlay
   */
  private closeToolTip() {
    if (this._overlayRef) {
      this._overlayRef.detach();
    }
  }
}
