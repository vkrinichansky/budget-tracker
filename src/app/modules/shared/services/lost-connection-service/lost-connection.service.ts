import { Injectable } from '@angular/core';
import { Observable, fromEvent, map, merge, of } from 'rxjs';

@Injectable()
export class LostConnectionService {
  isOnline(): Observable<boolean> {
    return merge(of(null), fromEvent(window, 'online'), fromEvent(window, 'offline')).pipe(map(() => navigator.onLine));
  }
}
