import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable()
export class GlobalService {
baseUrl = environment.baseUrl;
public apiToken;
public authentication;
public onInvalidApiToken: EventEmitter<any>;
public onLogOut: EventEmitter<any>;
  constructor() {
    this.init();
    this.onInvalidApiToken = new EventEmitter();
    this.onLogOut = new EventEmitter();
  }

  apiUrl:any = {
    file: '/api/file',
    // login: '/login'
    login:'/auth/login/'

  }
  getApiUrl(key:any){
    return this.baseUrl + this.apiUrl[key];
  }
  setLocalItem(key, value, encoded): void {
    value = JSON.stringify(value);
    if (encoded) {
      value = btoa(value);
    }
    localStorage.setItem(key, value);
  }

  removeLocalItem(key): void {
    localStorage.removeItem(key);
  }



  getLocalItem(key, decoded): any {
    let value = localStorage.getItem(key);
    try {
      value = (value) ? JSON.parse((decoded) ? atob(value) : value) : null;
       return value;
      } catch (e) {
        return false;
    }
  }

  invalidApiToken(): void {
    this.onInvalidApiToken.emit(true);
  }

  init(): void {
    this.apiToken = null;
    this.authentication = null;
    const data = this.getLocalItem('etdauth', true);

    if (data) {
      this.authentication = data['data'];
      this.apiToken = this.authentication;
    }
}

  hasLoginSession(): boolean {
    const data = this.getLocalItem('etdauth', true);
    return (data) ? true : false;
  }

  login(data): void {
    this.setLocalItem('etdauth', data, true);
    this.init();
  }

  logout(): void {
    this.removeLocalItem('etdauth');
    this.init();
    this.onLogOut.emit();
  }

  getAuthorization(): any {
    const authorization = {
      // 'App-Id': 'ETDAPP',
    }
    
    if (this.authentication) {
      authorization['Authorization'] = 'bearer ' + this.apiToken;
    }
    return authorization;
  }
}
