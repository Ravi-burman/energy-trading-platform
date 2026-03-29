import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import _ from 'lodash'
import { GlobalService } from './global.service';
declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean
  }
}
@Injectable()
export class HttpService {

  constructor(private http: HttpClient,
    private global: GlobalService) { }
  xhr(request: {
    url?: any,
    method?: any,
    data?: any,
    headers?: {},
    params?: {},
    file?: any,
    files?: any,
    fileInputName?: string
    type?: any
  }) {
    let params: HttpParams = new HttpParams();
    let headers: HttpHeaders = new HttpHeaders();
    _.forEach(request.params, (val, key) => {
      params = params.set(key.toString(), val);
    });
    const authHeaders = this.global.getAuthorization();

    _.forEach(authHeaders, (val, key) => {
      headers = headers.set(key.toString(), val);
    });

    _.forEach(request.headers, (val, key) => {
      headers = headers.set(key.toString(), val);
    });


    const options: any = { params, headers };

    let response: any;

    // if(request.method ==='P'){
    //  response = this.http.post(request.url, request.data, options )
    // }

    if (request.method === 'F') {
      response = this.http.post(request.url, request.data, options)
    }
    if (request.method === 'G') {
      response = this.http.get(request.url, options)
    }
    if (request.method === 'patch') {
      response = this.http.patch(request.url, request.data, options)
    }
    if (request.method === 'DW') {
      response = this.http.get(request.url, { ...options, responseType: 'arraybuffer', observe: 'response' });
    }
    if (request.method === 'P' && request.type === 'file') {
      // const formData: FormData = new FormData();
      // formData.append('file', request.file|| request.data?.file);
      // headers.append('Accept', 'application/json');
      // response = this.http.post(request.url, formData, options);

      const formData: FormData = new FormData();
      formData.append('file', request.file || request.data?.file);

      headers.append('Accept', 'application/json');
      response = this.http.post(request.url, formData, options);
    } else if (request.method === 'P' && request.type === 'envelop') {
      const formData: FormData = new FormData();
      formData.append('envelope_name', request.data.envelope_name);
      formData.append('group_id', request.data.group_id);
      formData.append('sender_id', request.data.sender_id);
      formData.append('status', request.data.status);
      // formData.append('signing_order', request.data.signing_order);
      formData.append('recepients', JSON.stringify(request.data.recepients));
      for (let i = 0; i < request.data.files.length; i++) {
        formData.append('files', request.files || request.data.files[i]);
      }

      headers.append('Accept', 'application/json');
      response = this.http.post(request.url, formData, options);
    } else if (request.method === 'P' && request.type === 'sendEnvelope') {
      const formData: FormData = new FormData();
      formData.append('envelope_id', request.data.envelope_id);
      formData.append('sender_id', request.data.sender_id);
      formData.append('document_ids', request.data.document_ids);
      formData.append('signatures_status', request.data.signatures_status);
      // for(let i=0; i < request.data.files.length; i++){
      //   formData.append('files', request.files || request.data.files[i]);
      // }

      headers.append('Accept', 'application/json');
      response = this.http.post(request.url, formData, options);
    } else if (request.method === 'P') {
      response = this.http.post(request.url, request.data, options)
    }
    if (request.method === 'D' && request.type === 'deleteEnvelope') {
      const envelopeData = request[0];
      const data = [
        {
          envelope_id: envelopeData.envelope_id,
          sender_id: envelopeData.sender_id
        }
      ];
      response = this.http.delete(request.url, { body: data });
    } else if (request.method === 'D') {
      const options1 = { body: request.data, params: params, headers: headers };
      response = this.http.delete(request.url, options1)
    }

    return response.pipe(map((res: any) => {
      if (res.status === 'FAILURE') {
        this.handleError(res.error);
      }
      if (request.method === 'DW') {
        const a = document.createElement('a');
        document.body.appendChild(a);
        if (res) {
          const file = new Blob([res.body], {
            type: res.headers.get('content-type')
          });
          // if (navigator.appVersion.toString().indexOf('.NET') > 0) {
          //   window.navigator.msSaveBlob(file, res.headers.get('filename'));
          // }
          if (navigator.msSaveBlob) {
            // use navigator.msSaveBlob
            navigator.msSaveBlob(file, res.headers.get('filename'));
          }
          else {
            const fileURL = URL.createObjectURL(file);
            a.href = fileURL;
            a.download = res.headers.get('filename');
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(fileURL);
            }, 10);
          }
        }

        return res;
      } else {
        return res as Object;
      }


    }),

      catchError((err) => {
        if (err && err.error && err.error.code === 'EC_INVALID_APITOKEN') {
          //this.authService.invalidApiToken();
          this.global.invalidApiToken();

        }
        return new Observable(observer => {
          observer.error(err);
        });
      }
      )
    );
  }
  handleError(err) {

    if (err && err.code === 'EC_INVALID_APITOKEN') {
      //this.authService.invalidApiToken();
      this.global.invalidApiToken();

    }
    return new Observable(observer => {
      observer.error(err);
    });
  }
}
