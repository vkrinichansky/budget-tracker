import { trigger, state, style, transition, animate } from '@angular/animations';

export const overlayFade = trigger('overlayFade', [
  state('void', style({ opacity: 0, transform: 'scale(0.8)' })),
  state('*', style({ opacity: 1, transform: 'scale(1)' })),
  transition('void => *', animate('225ms cubic-bezier(0, 0, 0.2, 1)')),
  transition('* => void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);
