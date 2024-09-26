import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[regExpMatch]',
  standalone: true,
  providers: [
    { provide: NG_VALIDATORS, useExisting: RegExpMatchDirective, multi: true },
  ],
})
export class RegExpMatchDirective implements Validator {
  @Input('regExpMatch') regExp: string = '';

  validate(control: AbstractControl): ValidationErrors | null {
    console.log(this.regExp, new RegExp(this.regExp).test(control.value));
    if (!new RegExp(this.regExp).test(control.value)) {
      return { regExpMatch: { value: control.value } };
    }
    return null;
  }
}
