import { ChangeDetectionStrategy, Component, HostBinding, Input, TemplateRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseModalComponent {
  @HostBinding('class')
  private readonly classes = 'rounded-md';

  @Input()
  titleTranslationKey: string;

  @Input()
  titleTranslationParams: Record<string, string | number>;

  @Input()
  subtitleTranslationKey: string;

  @Input()
  shouldDisplayCloseButton = true;

  @Input()
  footerTemplate: TemplateRef<unknown>;

  @Input()
  loading: boolean;

  constructor(private dialogRef: MatDialogRef<BaseModalComponent>) {}

  cancelClick(): void {
    this.dialogRef.close();
  }
}
