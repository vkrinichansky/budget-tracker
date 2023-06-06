import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return !!(
      (control && control.invalid && (control.dirty || control.touched)) ||
      (control && control.value && control.invalid && (control.pristine || control.untouched))
    );
  }
}
