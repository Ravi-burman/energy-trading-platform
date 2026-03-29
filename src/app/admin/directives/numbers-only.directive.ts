import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector:'[numbersOnly]'
})
export class AllowNumberDirective{
  regexStr = '^[0-9]+$';

  constructor(private _el: ElementRef){
    let input: HTMLInputElement = this._el.nativeElement;
    // disable the scroll wheel
    input.onwheel = () => {
      return false;
    };
    // disable the up/down arrow keys
    input.onkeydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') return false;
      else return true;
    };
  }
    @HostListener('keypress', ['$event'])
    onKeyPress(event){
      return new RegExp(this.regexStr).test(event.key);
    }

    //Block from event copy paste special characters
    @HostListener('paste', ['$event'])
    blockPaste(event: ClipboardEvent){
      this.validateFields(event);
    }

    validateFields(event: ClipboardEvent){
      event.preventDefault();
      const pasteData = event.clipboardData.getData('text/plain').replace(/[^0-9]/g,'');
      document.execCommand('insertHTML', false, pasteData);

      // event.preventDefault();
      // const pasteData = event.clipboardData.getData('text/plain').replace(/[^0-9]/g,'');
      // const inputElement = this._el.nativeElement as HTMLInputElement;
      // inputElement.value = pasteData;
      // inputElement.dispatchEvent(new Event('input'));
    }



}
