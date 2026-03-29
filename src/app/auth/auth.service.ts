import { EventEmitter, Injectable } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { HttpService } from '../services/http.service';
import { ApiConfigService } from '../admin/services/api-config.service';
import { Subject } from 'rxjs';

@Injectable()
export class AuthServices {
  public apiToken;
  public authentication;
  public onInvalidApiToken: EventEmitter<any>;
  public onLogOut: EventEmitter<any>;
  private loginStatusSubject = new Subject<boolean>();

  loginStatus$ = this.loginStatusSubject.asObservable();
  constructor(private api: GlobalService,
              private http: HttpService,
              private apiConfig: ApiConfigService) {
                this.init();
                this.onInvalidApiToken = new EventEmitter();
                this.onLogOut = new EventEmitter();
               }

  login(obj:{headers?:any,params?:any,data?:any}):any{
    let url = this.api.getApiUrl('login');
    return this.http.xhr({url,method:'P', ...obj})
  }
  
  setLoginStatus(isLoggedIn: boolean) {
    this.loginStatusSubject.next(isLoggedIn);
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
    value = (value) ? JSON.parse((decoded) ? atob(value) : value) : null;
    return value;
  }

  invalidApiToken(): void {
    this.onInvalidApiToken.emit(true);
  }

  init(): void {
    this.apiToken = null;
    this.authentication = null;
    const data = this.getLocalItem('gtmsauth', true);
    if (data) {
      // this.authentication = data['data'];
      // this.apiToken = this.authentication['apiToken'];

      if (data['data'] !== undefined) {
        this.authentication = data['data'];
        this.apiToken = this.authentication['apiToken'];
      } else {
        this.apiToken = data['apiToken'];
      }
      
    }
  }




  hasLoginSession(): boolean {
    const data = this.getLocalItem('gtmsauth', true);
    return (data) ? true : false;
  }

  // login(data): void {
  //   this.setLocalItem('gtmsauth', data, true);
  //   this.init();
  // }

  logout(): void {
    this.removeLocalItem('roles');    
    this.removeLocalItem('gtmsauth');
    this.removeLocalItem('selectedDepts');
    this.removeLocalItem('selectedChannels');
    this.removeLocalItem('RouterChange');
    this.init();
    this.onLogOut.emit();
  }

  getAuthorization(): any {
    const authorization = {
      'Client-Type': 'WEB',
      'App-Id': 'GTMSAPP',
    }
    if (this.authentication) {
      authorization['Authorization'] = 'Basic' + this.apiToken;
    }
    return authorization;
  }

}
