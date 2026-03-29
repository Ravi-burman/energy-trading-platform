import { EventEmitter, Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ApiConfigService } from './api-config.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable()
export class CommonService {
  getUserById$: EventEmitter<any>;

  constructor(
    private apiConfigService: ApiConfigService,
    private http: HttpService,
    private sanitizer: DomSanitizer
  ) {
    this.getUserById$ = new EventEmitter();
  }

  // Roles
  getRoles(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getRoles');
    return this.http.xhr({ url, method: 'G', ...obj });
  }

  createRole(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('createRole');
    return this.http.xhr({ url: url, method: 'P', ...obj });
  }

  updateRole(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('updateRole');
    return this.http.xhr({ url: url, method: 'patch', ...obj });
  }

  deleteRole(id: any, obj?: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('deleteRole').replace('{id}', id);
    return this.http.xhr({ url, method: 'patch', ...obj });
  }

  getRoleById(roleId: any, obj: { params?: any; headers?: any }) {
    const url = this.apiConfigService.getApiUrl('getRoleById').replace('{roleId}', roleId);
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }

  getActiveRoles(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getActiveRoles');
    return this.http.xhr({ url, method: 'G', ...obj });
  }

  //Privileges
  getActivePrivileges(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getActivePrivileges');
    return this.http.xhr({ url, method: 'G', ...obj });
  }



  // Users
  getUsers(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getUsers');
    return this.http.xhr({ url, method: 'G', ...obj });
  }

  createUser(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('createUser');
    return this.http.xhr({ url: url, method: 'P', ...obj });
  }

  updateUser(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('updateUser');
    return this.http.xhr({ url: url, method: 'patch', ...obj });
  }

  deleteUser(id: any, obj?: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('deleteUser').replace('{id}', id);
    return this.http.xhr({ url, method: 'patch', ...obj });
  }

  getUserById(id: any) {
    const url = this.apiConfigService.getApiUrl('getUserById').replace('{id}', id);
    return this.http.xhr({ url: url, method: 'G' });
  }

  // User Profile

  // getCountryCodes(obj: { params?: any; headers?: any; data?: any }) {
  //   const url = this.apiConfigService.getApiUrl('getCountryCodes');
  //   return this.http.xhr({ url, method: 'G', ...obj });
  // }

  updateProfile(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('updateProfile');
    return this.http.xhr({ url: url, method: 'patch', ...obj });
  }

  // Country 
  getCountry(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getCountry');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  createCountry(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('createCountry');
    return this.http.xhr({ url: url, method: 'P', ...obj });
  }
  updateCountry(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('updateCountry');
    return this.http.xhr({ url: url, method: 'patch', ...obj });
  }
  deleteCountry(id: any, obj?: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('deleteCountry').replace('{id}', id);
    return this.http.xhr({ url, method: 'patch', ...obj });
  }

  //Market Provider
  getMarketProvider(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getMarketProvider');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  createMarketProvider(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('createMarketProvider');
    return this.http.xhr({ url: url, method: 'P', ...obj });
  }
  updateMarketProvider(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('updateMarketProvider');
    return this.http.xhr({ url: url, method: 'patch', ...obj });
  }
  deleteMarketProvider(id: any, obj?: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('deleteMarketProvider').replace('{id}', id);
    return this.http.xhr({ url, method: 'patch', ...obj });
  }

  //RLDCS
  getRldc(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getRldc');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getRldcForMarketAreas(id: any, obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getRldcForMarketAreas').replace('{id}', id);
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  createRldc(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('createRldc');
    return this.http.xhr({ url: url, method: 'P', ...obj });
  }
  updateRldc(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('updateRldc');
    return this.http.xhr({ url: url, method: 'patch', ...obj });
  }
  deleteRldc(id: any, obj?: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('deleteRldc').replace('{id}', id);
    return this.http.xhr({ url, method: 'patch', ...obj });
  }

  // Market Area


  getMarketArea(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getMarketArea');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getMarketAreaForState(id: any, obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getMarketAreaForState').replace('{id}', id);
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  createMarketArea(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('createMarketArea');
    return this.http.xhr({ url: url, method: 'P', ...obj });
  }
  updateMarketArea(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('updateMarketArea');
    return this.http.xhr({ url: url, method: 'patch', ...obj });
  }
  deleteMarketArea(id: any, obj?: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('deleteMarketArea').replace('{id}', id);
    return this.http.xhr({ url, method: 'patch', ...obj });
  }

  // Market Type


  getMarketType(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getMarketType');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getMarketProviderForMarketType(id: any, obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getMarketProviderForMarketType').replace('{id}', id);
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  createMarketType(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('createMarketType');
    return this.http.xhr({ url: url, method: 'P', ...obj });
  }
  updateMarketType(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('updateMarketType');
    return this.http.xhr({ url: url, method: 'patch', ...obj });
  }
  deleteMarketType(id: any, obj?: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('deleteMarketType').replace('{id}', id);
    return this.http.xhr({ url, method: 'patch', ...obj });
  }

  // States

  getState(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getState');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }

  getStateForEntity(id: any, obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getStateForEntity').replace('{id}', id);
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }

  createState(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('createState');
    return this.http.xhr({ url: url, method: 'P', ...obj });
  }
  updateState(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('updateState');
    return this.http.xhr({ url: url, method: 'patch', ...obj });
  }
  deleteState(id: any, obj?: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('deleteState').replace('{id}', id);
    return this.http.xhr({ url, method: 'patch', ...obj });
  }

  //Individual Entity

  getEntity(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getEntity');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  createEntity(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('createEntity');
    return this.http.xhr({ url: url, method: 'P', ...obj });
  }
  updateEntity(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('updateEntity');
    return this.http.xhr({ url: url, method: 'patch', ...obj });
  }
  deleteEntity(id: any, obj?: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('deleteEntity').replace('{id}', id);
    return this.http.xhr({ url, method: 'patch', ...obj });
  }
  getParentType(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getParentType');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  createParentType(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('createParentType');
    return this.http.xhr({ url: url, method: 'P', ...obj });
  }

  getEntityType(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getEntityType');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }

  //RealTime Data Population
  getIEX(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getIEX');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }

  getWBES(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getWBES');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }

  getForecastStatus(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getForecastStatus');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getRtmForecastStatus(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getRtmForecastStatus');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getPxilForecastStatus(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getPxilForecastStatus');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getIgxStatus(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getIgxStatus');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }

  //  Graph Data Population
  getPvdGraphData(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getPvdGraphData');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getPriceVolumesGraph(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getPriceVolumesGraph');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }

  getMeanPvdGraphData(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getMeanPvdGraphData');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getMeanPvvGraphData(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getMeanPvvGraphData');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getForecastActualGraph(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getForecastActualGraph');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getGdamForecastGraph(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getGdamForecastGraph');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getForecastModelwise(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getForecastModelwise');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }


  // india map
  getIgxIndiaMap(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getIgxIndiaMap');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getIrnsIndiaMapData(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getIrnsIndiaMapData');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getIndiaMapGraph(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getIndiaMapGraph');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  // getIndiaMapGraphOld(): SafeResourceUrl {
  //   const url = this.apiConfigService.getApiUrl('getIndiaMapGraphOld'); 
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  // }
  getInstCapacityData(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getInstCapacityData');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getGeneratorsData(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getGeneratorsData');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getGeneratorOutagesData(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getGeneratorOutagesData');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }


  getRtmForeCastData(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getRtmForeCastData');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getLatestMetrics(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getLatestMetrics');    
    return this.http.xhr({ url: url, method: 'G', ...obj }); //Latest RTM_96 (Get API)
  }
  getDailyRtmMetrics(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getDailyRtmMetrics');    
    return this.http.xhr({ url: url, method: 'G', ...obj }); //Daily RTM_96 (Post API)
  }
    getRtmForecastVsActual(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getRtmForecastVsActual');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getRtm192ForecastVsActual(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getRtm192ForecastVsActual');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getIgxDeliveryCodeData(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getIgxDeliveryCodeData');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getIexAreaCodeData(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getIexAreaCodeData');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getIexAreaTypes(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getIexAreaTypes');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getIgxGraphData(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getIgxGraphData');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getIgxDeliveryArea(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getIgxDeliveryArea');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getIgxPriceVolumeData(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getIgxPriceVolumeData');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getIgxBarGraph(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getIgxBarGraph');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getIexBarGraph(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getIexBarGraph');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  getGdamForecastModelwise(obj: { params?: any; headers?: any; data?: any }) {
    const url = this.apiConfigService.getApiUrl('getGdamForecastModewise');
    return this.http.xhr({ url: url, method: 'G', ...obj });
  }
  

}
