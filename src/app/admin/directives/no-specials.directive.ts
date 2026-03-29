import { Directive, HostListener, ElementRef, Input } from "@angular/core";
@Directive({
  selector:'[specialIsAlphaNumeric]'
})
export class SpecialCharacterDirective{
  regexStr = '^[a-zA-Z0-9_]*$';

  constructor(private el: ElementRef){

  }
  //check for keypress event in input field, allow only those that matches the regex
  @HostListener('keypress', ['$event'])
  onKeyPress(event){
    return new RegExp(this.regexStr).test(event.key);
  }

  //Check for paste event, and validate if matches the regex below
  @HostListener('paste',['$event'])
  blockPaste(event:ClipboardEvent){
    this.validateFields(event);
  }
  validateFields(event: ClipboardEvent){
    event.preventDefault();
    const pasteData = event.clipboardData.getData('text/plain').replace(/[^a-zA-Z0-9_]/g,'');
    document.execCommand('insertHTML', false, pasteData);
  }
}
