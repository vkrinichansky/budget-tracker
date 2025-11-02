import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MenuAction, overlayFade } from '../../models';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [overlayFade],
  standalone: false,
})
export class MenuComponent extends ButtonComponent implements AfterViewInit, OnDestroy {
  @ViewChild('actionsTemplate')
  private actionsTemplate: TemplateRef<unknown>;

  @ViewChild('trigger', { read: ElementRef, static: true })
  private trigger: ElementRef<HTMLElement>;

  private overlayRef: OverlayRef;

  @Input({ required: true })
  menuActions: MenuAction[];

  @Input()
  icon = 'menu';

  @Input()
  useContent: boolean;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  close = new EventEmitter<void>();

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  open = new EventEmitter<void>();

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private destroyRef: DestroyRef
  ) {
    super();
  }

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

  ngOnDestroy(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
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
