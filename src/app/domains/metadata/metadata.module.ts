import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetadataApiService, MetadataFacadeService } from './services';
import { EffectsModule } from '@ngrx/effects';
import { MetadataEffects } from './store';
import { CurrencySwitcherComponent, LanguageSwitcherComponent } from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyPipe } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    DesignSystemModule,
    TranslateModule,
    EffectsModule.forFeature([MetadataEffects]),
  ],
  declarations: [CurrencySwitcherComponent, LanguageSwitcherComponent, CurrencyPipe],
  exports: [CurrencySwitcherComponent, LanguageSwitcherComponent, CurrencyPipe],
  providers: [MetadataApiService, MetadataFacadeService, CurrencyPipe],
})
export class MetadataModule {}
