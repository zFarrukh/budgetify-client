import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const today = new Date().getTime();

    if (!(control && control.value)) {
      return null;
    }

    return control.value.getTime() > today
      ? { invalidDate: 'You cannot use future dates' }
      : null;
  };
}
