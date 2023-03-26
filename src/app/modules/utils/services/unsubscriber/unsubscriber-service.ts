import { Injectable, OnDestroy, ClassProvider, inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';

function describeUnsubscriberService() {
  @Injectable()
  class UnsubscriberService extends Subject<void> implements OnDestroy {
    ngOnDestroy(): void {
      this.next();
      this.complete();
    }
  }

  function provideUnsubscriberService(): ClassProvider {
    return {
      provide: UnsubscriberService,
      useClass: UnsubscriberService,
    };
  }

  function injectUnsubscriberService(): Observable<void> {
    const destroy$ = inject(UnsubscriberService, { self: true, optional: true });

    if (!destroy$) {
      throw new Error(
        'It seems that you forgot to provide DestroyService. Try adding "provideDestroyService()" to your declarable\'s providers.'
      );
    }

    return destroy$.asObservable();
  }

  return {
    provideUnsubscriberService,
    injectUnsubscriberService,
  };
}

export const { provideUnsubscriberService, injectUnsubscriberService } = describeUnsubscriberService();
