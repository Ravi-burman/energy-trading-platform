import { Component, ViewChild } from '@angular/core';
import { AuthServices } from '../../auth/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { CommonService } from '../services/common.service';
import { CommonUtilityService } from 'src/app/services/common-utility.service';
import { TableModule } from 'primeng/table';
import { Paginator } from 'primeng/paginator';



@Component({
  selector: 'app-admin-status',
  templateUrl: './admin-status.component.html',
  styleUrls: ['./admin-status.component.scss']
})
export class AdminStatusComponent {
  @ViewChild('graphDt') graphDt: Table;
  @ViewChild('paginator') paginator: Paginator;
  loginUser: any;
  getDataLoading: boolean = true;
  paginatorOptions: any = {};
  currentPageIndex = 0;
  filteredData: any;
  iexCombineData: any;
  wbesCombineData: any;
  filteredAndComibnedData: any;
  dataArray: any[];
  newDataArray: any
  foreCastData:any;
  rtmForecastData: any;
  pxilForecastData: any;
  igxStatusData: any;
  rtmData: any[] = [];
  damData: any[] = [];
  mergedData: any[];

  iexData: {
    DAM: { last_update: string; next_update: string; last_market_datetime: string; next_market_datetime: string; last_profile_update: string; etl_status:string; last_etl_run:string};
    HP_DAM: { last_update: string; next_update: string; last_market_datetime: string; next_market_datetime: string; last_profile_update: string; etl_status:string; last_etl_run:string};
    GDAM: { last_update: string; next_update: string; last_market_datetime: string; next_market_datetime: string; last_profile_update: string; etl_status:string; last_etl_run:string};
    RTM: { last_update: string; next_update: string; last_market_datetime: string; next_market_datetime: string; last_profile_update: string; etl_status:string; last_etl_run:string};
  };

  pxilData: {
    DAM: { last_update: string; next_update: string; last_market_datetime: string; next_market_datetime: string; last_profile_update: string; etl_status:string; last_etl_run:string};
    HP_DAM: { last_update: string; next_update: string; last_market_datetime: string; next_market_datetime: string; last_profile_update: string; etl_status:string; last_etl_run:string};
    GDAM: { last_update: string; next_update: string; last_market_datetime: string; next_market_datetime: string; last_profile_update: string; etl_status:string; last_etl_run:string};
    RTM: { last_update: string; next_update: string; last_market_datetime: string; next_market_datetime: string; last_profile_update: string; etl_status:string; last_etl_run:string};
  };

  wbesData: {
    Demand: {
      LAST_RUN: string;
      LAST_SCHEDULE_DATETIME: string;
      NEXT_SCHEDULE_DATETIME: string;
      NEXT_UPDATE: string;
      LAST_PROFILE_UPDATE: string;
      NEXT_PROFILE_UPDATE: string;
      ETL_STATUS:string;
      LAST_ETL_RUN:string;
    };
    Supply: {
      LAST_RUN: string;
      LAST_SCHEDULE_DATETIME: string;
      NEXT_SCHEDULE_DATETIME: string;
      NEXT_UPDATE: string;
      LAST_PROFILE_UPDATE: string;
      NEXT_PROFILE_UPDATE: string;
      ETL_STATUS:string;
      LAST_ETL_RUN:string;
      
    }
  };




  constructor(
    private authService: AuthServices,
    private commonService: CommonService,
    // private commonUtilityService: CommonUtilityService,
    // private messageService: MessageService, private router: Router,
  ) {
    this.loginUser = this.authService.getLocalItem('loginUser', true);
    this.paginatorOptions = {
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      rows: 10,
      first: 0
    };
  }

  ngOnInit() {
    this.getIEX();
    this.getWBES();
    this.getForecastStatus();
    this.getRtmForecastStatus();
    this.getPxilStatus();
    this.getIgxStatusData();
  }


  
  getIEX() {
    this.commonService.getIEX({}).subscribe((res) => {
      if (res) {
        this.iexData = res
        this.getDataLoading = false;
      } else {
        this.getDataLoading = false;
      }
    }, (err: any) => {
      this.getDataLoading = false;
    });
  }

  getPxilStatus() {
    this.commonService.getPxilForecastStatus({}).subscribe((res) => {
      if (res) {
        this.pxilData = res.data.data[0];
        this.getDataLoading = false;
      } else {
        this.getDataLoading = false;
      }
    }, (err: any) => {
      this.getDataLoading = false;
    });
  }

  getWBES() {
    this.commonService.getWBES({}).subscribe((res) => {
      if (res) {
        this.wbesData = res;
        this.getDataLoading = false;
      }
      else {
        this.getDataLoading = false;
      }
    }, (err: any) => {
      this.getDataLoading = false;

    });

  }
  getForecastStatus() {
    this.getDataLoading = true
    this.commonService.getForecastStatus({}).subscribe((res) => {
      if (res) {
        this.foreCastData = res
        this.damData = res.map(item => ({ ...item, category: "Dam" }));
        this.mergeDataArrays();
        this.getDataLoading = false
      } else {
        this.getDataLoading = false;
      }
    }, (err: any) => {
      this.getDataLoading = false;

    })
  }

  getRtmForecastStatus(){
    this.getDataLoading = true;
    this.commonService.getRtmForecastStatus({}).subscribe((res)=>{
      if(res){
        this.rtmForecastData = res.data.data;
        this.rtmData = Object.keys(this.rtmForecastData).map(key => ({ category: key, ...this.rtmForecastData[key] }));
        this.mergeDataArrays();
        this.getDataLoading = false;
      } else{
        this.getDataLoading = false;
      }
    }, (err: any) =>{
      this.getDataLoading = false;
    })
  }


  getIgxStatusData() {
    this.commonService.getIgxStatus({}).subscribe((res) => {
      if (res ) {
        this.igxStatusData = res.data.data[0];
       console.log(this.igxStatusData , "satyaaaaaa")
      } else {
        this.getDataLoading = false;
      }
 
    }, (err: any) => {
      this.getDataLoading = false;
    });
  }

  mergeDataArrays() {
    this.mergedData = [...this.damData, ...this.rtmData,];
  }

  ngAfterViewInit() {
  
    if (this.graphDt) { }
  }



}

