import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  HostBinding,
  Input,
  TemplateRef,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class BaseModalComponent {
  @HostBinding('class')
  private readonly classes = 'rounded-md flex flex-col';

  @ContentChild('contentTemplate')
  contentTemplate: TemplateRef<unknown>;

  @ContentChild('footerTemplate')
  footerTemplate: TemplateRef<unknown>;

  @Input()
  titleTranslationKey: string;

  @Input()
  titleTranslationParams: Record<string, string | number>;

  @Input()
  subtitleTranslationKey: string;

  @Input()
  shouldDisplayCloseButton = true;

  @Input()
  shouldDisplayBorder = true;

  @Input()
  loading: boolean;

  constructor(private dialogRef: MatDialogRef<BaseModalComponent>) {}

  cancelClick(): void {
    this.dialogRef.close();
  }
}
