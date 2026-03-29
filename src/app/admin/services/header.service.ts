import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  headerTitleChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  updateHeaderTitle(title: string) {
    this.headerTitleChanged.emit(title);
  }
}
