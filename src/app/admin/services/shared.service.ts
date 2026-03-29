import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private fileData: File;
  private countryValue: string;

  setFileData(file: File) {
    this.fileData = file;
  }

  getFileData(): File {
    return this.fileData;
  }

  private fileUrls: { [fileName: string]: string } = {};

  setFileUrl(fileName: string, url: string) {
    this.fileUrls[fileName] = url;
  }
  
  getFileUrl(fileName: string): string {
    return this.fileUrls[fileName];
  }

  setCountryValue(country: string) {
    this.countryValue = country;
  }

  getCountryValue() {
    return this.countryValue;
  }
}