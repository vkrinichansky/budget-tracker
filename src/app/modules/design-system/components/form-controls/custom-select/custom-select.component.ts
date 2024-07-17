import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  forwardRef,
  HostBinding,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { animate, style, transition, trigger } from '@angular/animations';
import { take } from 'rxjs';
import { GenericCustomControlComponent } from '../generic-custom-control/generic-custom-control.component';
import { IconsForUser } from '../../../models';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'custom-select',
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
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
  animations: [
    trigger('dropdown', [
      transition(':enter', [style({ maxHeight: 0 }), animate(100, style({ maxHeight: '200px' }))]),
      transition(':leave', [style({ maxHeight: '200px' }), animate(100, style({ maxHeight: 0 }))]),
    ]),
  ],
})
export class CustomSelectComponent extends GenericCustomControlComponent {
  @HostBinding('class')
  private readonly classes = 'group flex flex-col';

  @ViewChild('optionsTemplate')
  private optionsTemplate: TemplateRef<unknown>;

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

  toggleDropdown(trigger?: HTMLElement): void {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
      this.isOpen = false;
    } else {
      const positionStrategy = this.overlay
        .position()
        .flexibleConnectedTo(trigger)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: 2,
          },
        ]);

      this.overlayRef = this.overlay.create({
        positionStrategy,
        hasBackdrop: true,
        backdropClass: 'opacity-0',
        width: trigger.offsetWidth,
      });

      const portal = new TemplatePortal(this.optionsTemplate, this.viewContainerRef);
      this.overlayRef.attach(portal);

      this.overlayRef
        .backdropClick()
        .pipe(take(1), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.overlayRef.detach();
          this.isOpen = false;
          this.formControl.markAsTouched();
          this.cd.detectChanges();
        });

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
    this.formControl.updateValueAndValidity();
    this.toggleDropdown();
  }
}
