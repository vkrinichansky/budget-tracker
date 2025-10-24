import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureKey, snapshotReducer, SnapshotEffects } from './store';
import { SnapshotApiService, SnapshotService, SnapshotFacadeService } from './services';
import { EffectsModule } from '@ngrx/effects';
import { SnapshotsListComponent, SnapshotItemComponent } from './components';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import { TranslateModule } from '@ngx-translate/core';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { MetadataDomainModule } from '@budget-tracker/metadata';

@NgModule({
  declarations: [SnapshotsListComponent, SnapshotItemComponent],
  imports: [
    CommonModule,
    NgxApexchartsModule,
    StoreModule.forFeature(featureKey, snapshotReducer),
    EffectsModule.forFeature([SnapshotEffects]),
    TranslateModule,
    DesignSystemModule,
    MetadataDomainModule,
  ],
  exports: [SnapshotsListComponent, SnapshotItemComponent],
  providers: [SnapshotApiService, SnapshotService, SnapshotFacadeService],
})
export class SnapshotDomainModule {}
