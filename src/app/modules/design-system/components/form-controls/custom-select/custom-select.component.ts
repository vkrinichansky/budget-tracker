import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GenericCustomControlComponent } from '../generic-custom-control/generic-custom-control.component';
import { IconsForUser, overlayFade } from '../../../models';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'custom-select',
  templateUrl: './custom-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
  animations: [overlayFade],
  standalone: false,
})
export class CustomSelectComponent
  extends GenericCustomControlComponent
  implements AfterViewInit, OnDestroy
{
  @HostBinding('class')
  private readonly classes = 'group';

  @ViewChild('optionsTemplate')
  private optionsTemplate: TemplateRef<unknown>;

  @ViewChild('trigger', { static: true })
  private trigger: ElementRef<HTMLElement>;

  private resizeObserver: ResizeObserver;

  @Input()
  options: unknown[];

  @Input()
  iconPickerMode: boolean;

  @Input()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  idSelector: (option: any) => string;

  @Input()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayValueSelector: (option: any) => string;

  @Input()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconSelector: (option: any) => string;

  overlayRef: OverlayRef;

  isOpen: boolean;

  get dropdownOptions(): unknown[] {
    if (this.iconPickerMode) {
      return IconsForUser;
    }

    return this.options;
  }

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    protected override cd: ChangeDetectorRef,
    protected override destroyRef: DestroyRef
  ) {
    super(destroyRef, cd);
  }

  ngAfterViewInit(): void {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.trigger.nativeElement)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 2,
        },
        {
          originX: 'start',
          originY: 'top', // Align to the top of the origin
          overlayX: 'start',
          overlayY: 'bottom', // Align the overlay to the bottom of the origin
          offsetY: -2, // Adjust the offset to move it upward
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      width: this.trigger.nativeElement.offsetWidth,
      minHeight: (this.options?.length || 1) * 36 + 16,
    });

    this.overlayRef
      .backdropClick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.overlayRef.detach();
        this.isOpen = false;
        this.formControl.markAsTouched();
        this.cd.detectChanges();
      });

    this.resizeObserver = new ResizeObserver(() => {
      this.updateOverlayWidth();
    });
    this.resizeObserver.observe(this.trigger.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  toggleDropdown(): void {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
      this.isOpen = false;
    } else {
      const portal = new TemplatePortal(this.optionsTemplate, this.viewContainerRef);
      this.overlayRef.attach(portal);
      this.isOpen = true;
    }

    this.cd.detectChanges();
  }

  getId(option: unknown): string {
    return typeof option === 'string' ? option : this.displayValueSelector(option);
  }

  getIcon(option: unknown): string {
    return typeof option === 'string' ? option : this.iconSelector(option);
  }

  override valueChanged(value: unknown) {
    this.onChange(value);
    this.formControl.setValue(value, { emitEvent: false });
    this.formControl.updateValueAndValidity({ onlySelf: true });
    this.toggleDropdown();
  }

  private updateOverlayWidth() {
    if (this.overlayRef) {
      this.overlayRef.updateSize({ width: this.trigger.nativeElement.offsetWidth });
    }
  }
}
