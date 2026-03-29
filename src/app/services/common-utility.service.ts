import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { HttpService } from './http.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
// import {ApiConfigService} from './api-config.service';

@Injectable()
export class CommonUtilityService {
  paginatorOptions = {
    totalRecords: 0,
    rows: 25,
    rowsPerPageOptions: [ 25, 50, 75, 100],
    first: 0,
  };

  pages: any = {};

  contexts: any = {
    DEPT_CONFIG: 'DEPT_CONFIG',
    LOCATION_CONFIG: 'LOCATION_CONFIG',
    DEPT_USER_CONFIG: 'DEPT_USER_CONFIG',
  };
  keys: any = {
    RESPONSIBLE: 'RESPONSIBLE',
    OWNER: 'OWNER',
    COORDINATOR: 'COORDINATOR',
    ACCOUNTABLE: 'ACCOUNTABLE',
  };
  SUCCESS = 'SUCCESS';
  FAILURE = 'FAILURE';

  successLife = 1000;
  errorLife = 3000;

  constructor(
    private messageService: MessageService,
    private httpService: HttpService,
    private global: GlobalService,
    private router: Router,
    private apiConfig: GlobalService
  ) {}

  showErrorMessage(err): void {
    let msg = '';
    if (err) {
      if (err.error?.error.message && err.error.error.message.length > 0) {
       
          msg = msg + err.error.error.message;
      
      } else if (
        err.error?.error &&
        err.error.error.length > 0
      ) {
        err.error.error.forEach((a) => {
          msg = msg + a.message + '\n';
          if (a.code === 'EC_INVALID_TOKEN') {
            this.global.logout();
            this.router.navigate(['/login']);
          }
        });
      } else {
        msg = err.error?.message;
      }
    } else {
      msg = 'Network error, try again.';
    }
    if (msg) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        life: this.errorLife,
        detail: msg,
      });
      // this.messageService.add({severity:'success', summary:'Service Message', detail:'Via MessageService'});
    }
  }

  // showErrorMessage(err): void {
  //   let msg = '';
  //   if (err) {
  //     if (err.error.error.error.length > 0) {
  //       err.error.error.error.forEach(a => {
  //         msg = msg + a.message + '\n';
  //       });
  //     } else {
  //       msg = err.error.message;
  //     }

  //   } else {
  //     msg = 'Network error, try again.';
  //   }
  //   if (msg) {
  //     this.messageService.clear();
  //     this.messageService.add({severity: 'error', life: this.errorLife, detail: msg});
  //   }
  // }

  singleErrorMsg(error): void {
    let msg = '';
    msg = error.message;
    if (msg) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        life: this.errorLife,
        detail: msg,
      });
    }
  }
  // showRequiredFieldMessage(err): void {

  //   let msg = '';
  //   if (err) {
  //    err.forEach(element => {
  //     msg = msg + element.message + '\n';
  //    });

  //   }
  //   if (msg) {
  //     this.messageService.clear();
  //     this.messageService.add({severity: 'error', life: this.errorLife, detail: msg});
  //   }
  // }
  showSuccessMessage(detail): void {
    this.messageService.clear();
    this.messageService.add({
      severity: 'success',
      life: this.successLife,
      detail,
    });
  }

  fileUpload(obj?: any) {
    const url = this.apiConfig.getApiUrl('uploadFile');
    return this.httpService.xhr({ url, method: 'F', ...obj });
  }

  

  // downloadFile(file: any, obj) {
  //   const url = this.apiConfig.getServiceUrl('downloadFile').replace('{docId}', file.docId);
  //   return this.httpService.xhr({url, method: 'DW', ...obj});
  // }

  // getFileUrl() {
  //   return this.apiConfig.getServiceUrl('getFile');
  // }

  // getApiUrl(serviceName) {
  //   return this.apiConfig.getServiceUrl(serviceName);
  // }

  // copyObject(object) {
  //   return JSON.parse(JSON.stringify(object));
  // }
}
