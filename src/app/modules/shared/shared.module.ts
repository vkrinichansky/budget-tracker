import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe } from './pipes';

@NgModule({
  declarations: [CurrencyPipe],
  imports: [CommonModule, TranslateModule, DesignSystemModule, MatTooltipModule],
  exports: [CurrencyPipe],
  providers: [CurrencyPipe],
})
export class SharedModule {}
