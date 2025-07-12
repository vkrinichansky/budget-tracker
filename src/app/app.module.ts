import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment as devEnv } from 'src/environments/environment';
import { environment as prodEnv } from 'src/environments/environment.prod';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { UtilsModule } from '@budget-tracker/utils';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { NavigationBarModule } from '@budget-tracker/navigation-bar';
import { AuthDomainModule } from '@budget-tracker/auth';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    AuthDomainModule,
    DesignSystemModule,
    NavigationBarModule,
    BrowserAnimationsModule,
    UtilsModule,
    StoreModule.forRoot(
      {},
      {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
          strictActionWithinNgZone: true,
          strictActionTypeUniqueness: true,
        },
      }
    ),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'en-US',
      useDefaultLang: true,
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode(), connectInZone: true }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideFirebaseApp(() =>
      initializeApp(isDevMode() ? devEnv.firebaseConfig : prodEnv.firebaseConfig)
    ),
    provideAuth(() => getAuth(getApp())),
    provideFirestore(() => getFirestore()),
  ],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
