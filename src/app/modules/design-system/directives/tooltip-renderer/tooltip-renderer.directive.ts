import {
  Directive,
  Input,
  TemplateRef,
  ElementRef,
  HostListener,
  ComponentRef,
  OnDestroy,
} from '@angular/core';
import {
  ConnectedPosition,
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { CustomTooltipComponent } from '../../components';
import { BgColorScheme, TooltipPosition } from '../../models';
import { ComponentPortal } from '@angular/cdk/portal';
import { isMobileWidth } from '@budget-tracker/utils';
import { firstValueFrom, map } from 'rxjs';

const positionMapping: { [key: string]: ConnectedPosition } = {
  top: {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -10,
    panelClass: 'top',
  },
  bottom: {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: 10,
    panelClass: 'bottom',
  },
  left: {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -10,
    panelClass: 'left',
  },
  right: {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 10,
    panelClass: 'right',
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
  tooltipBgColor: BgColorScheme = 'charcoal';

  @Input()
  position: TooltipPosition[] = ['top'];

  @Input()
  maxWidth = 'max-w-64';

  //If this is specified then specified text will be showin in the tooltip
  @Input()
  tooltipText: string;

  //If this is specified then specified template will be rendered in the tooltip
  @Input()
  tooltipTemplate: TemplateRef<unknown>;

  @Input()
  childElementId: string;

  @Input()
  dontDisplayOnScreenWidth = false;

  @Input()
  screenWidth = 768;

  private get isOverflow(): boolean {
    const element = this.elementToCheck;

    return element.offsetWidth < element.scrollWidth;
  }

  private get elementToCheck(): HTMLElement {
    if (this.childElementId) {
      const childElement = this._elementRef.nativeElement.querySelector(`#${this.childElementId}`);

      if (childElement) {
        return childElement;
      }

      return this._elementRef.nativeElement;
    }

    return this._elementRef.nativeElement;
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
  private async show() {
    if (this.dontDisplayOnScreenWidth && window.screen.width <= this.screenWidth) {
      return;
    }

    if (!this.showTooltip) {
      return;
    }

    if (this.showTooltip && this.showTooltipOnlyOnOverflow && !this.isOverflow) {
      return;
    }

    if (this.tooltipText || this.tooltipTemplate) {
      const positionStrategy = this._overlayPositionBuilder
        .flexibleConnectedTo(this._elementRef)
        .withPositions(
          this.position
            ? this.position.map((direction) => positionMapping[direction])
            : Object.values(positionMapping)
        );

      this._overlayRef = this._overlay.create({ positionStrategy });

      //attach the component if it has not already attached to the overlay
      if (this._overlayRef && !this._overlayRef.hasAttached()) {
        const tooltipRef: ComponentRef<CustomTooltipComponent> = this._overlayRef.attach(
          new ComponentPortal(CustomTooltipComponent)
        );

        tooltipRef.instance.tooltipText = this.tooltipText;
        tooltipRef.instance.tooltipTemplate = this.tooltipTemplate;
        tooltipRef.instance.tooltipBgColor = this.tooltipBgColor;
        tooltipRef.instance.maxWidth = this.maxWidth;
        tooltipRef.instance.position = await firstValueFrom(
          positionStrategy.positionChanges.pipe(
            map((changes) => changes.connectionPair.panelClass as TooltipPosition)
          )
        );
      }
    }
  }

  /**
   * This method will be called when mouse goes out of the host element
   * i.e. where this directive is applied
   * This method will close the tooltip by detaching the overlay from the view
   */
  @HostListener('mouseleave')
  private hideOnMouseLeave() {
    this.closeToolTip();
  }

  @HostListener('click')
  private hideOnClick() {
    if (!isMobileWidth()) {
      this.closeToolTip();
    }
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
