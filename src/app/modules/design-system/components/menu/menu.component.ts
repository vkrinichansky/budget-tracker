import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ButtonSize, ColorScheme, MenuAction, overlayFade } from '../../models';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [overlayFade],
})
export class MenuComponent implements AfterViewInit {
  @ViewChild('actionsTemplate')
  private actionsTemplate: TemplateRef<unknown>;

  @ViewChild('trigger', { read: ElementRef, static: true })
  private trigger: ElementRef<HTMLElement>;

  private overlayRef: OverlayRef;

  @Input()
  colorScheme: ColorScheme = 'transparent-dark';

  @Input()
  buttonSizeX: ButtonSize = 'small';

  @Input()
  buttonSizeY: ButtonSize = 'small';

  @Input()
  icon = 'menu';

  @HostBinding('class.use-current-color')
  @Input()
  shouldUseCurrentColor: boolean;

  @Input()
  menuActions: MenuAction[];

  @Input()
  useContent: boolean;

  @Input()
  text: string;

  @Input()
  menuDisabled: boolean;

  @Input()
  loading: boolean;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  close = new EventEmitter<void>();

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  open = new EventEmitter<void>();

  get resolveColorScheme(): ColorScheme {
    return this.shouldUseCurrentColor ? null : this.colorScheme;
  }

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private destroyRef: DestroyRef
  ) {}

  ngAfterViewInit() {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.trigger.nativeElement)
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ]);

    this.overlayRef = this.overlay.create({ positionStrategy, hasBackdrop: true });

    this.overlayRef
      .backdropClick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.overlayRef.detach();
        this.close.emit();
      });
  }

  toggleDropdown(): void {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
      this.close.emit();
    } else {
      const portal = new TemplatePortal(this.actionsTemplate, this.viewContainerRef);
      this.overlayRef.attach(portal);
      this.open.emit();
    }
  }
}
