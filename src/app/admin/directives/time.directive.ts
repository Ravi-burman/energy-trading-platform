import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
  selector: '[appTime]'
})
export class TimeDirective {
  private regex: RegExp = new RegExp(/^\d{1,3}\:?\d{0,2}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private el: ElementRef) {
  }




  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? ':' : event.key, current.slice(position)].join('');

    // FOR 3 digit restriction - Starting
    if (next.split('').length <= 3) {
        if (next.split('').indexOf(':') <= 3) {
        } else {
            event.preventDefault();  
        }
    } else {
        if (next.split('').indexOf(':') === 1 || next.split('').indexOf(':') === 2 || next.split('').indexOf(':') === 3) {
        } else {
            event.preventDefault();  
        }
    }
    // - Ending

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}