import { Component, Input } from '@angular/core';
import { AuthServices } from '../../auth/auth.service';
import { CommonService } from '../services/common.service';
import { CommonUtilityService } from 'src/app/services/common-utility.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @Input() min: any;
  loginUser: any;
  getDataLoading: boolean = false;
  selectedTab: string = 'priceDemand';
  priceDemandData: any;
  FromDate: any;
  ToDate: any;
  currentDate: any;
  startDate: any;
  currentMeanDate: any;
  startMeanDate: any;
  priceVolumeDamData: any;
  priceVolumeGdamData: any;
  priceVolumeRtmData: any;
  priceMeanVolumeDamData: any;
  priceMeanVolumeGdamData: any;
  priceMeanVolumeRtmData: any;
  dateRange: FormGroup;
  dateVolumeRange: FormGroup
  meanVolumeRange: FormGroup
  meanRange: FormGroup;
  selectedOption: any;
  onMeanSelection: any;
  priceDemandMeanData: any;
  priceVolumeMeanData: any;
  maxDate: Date;



  public graph = {
    priceData: [] as {
      y: any[];
      type: string;
      mode: string;
      marker: { color: string };
      yaxis: string;
      name: string;
    }[],
    layout: {
      title: {
        text: 'India Price Vs ISTS Demand Graph',
        font: {
          size: 15,
        },
        y: 0.95,
      },
      xaxis: {
        autorange: true,
        hoverformat: '%d %b %Y %H:%M',
        zeroline: true, 
        zerolinewidth: 2,
        showline: true, 
      },
      yaxis: {
        title: {
          text: 'Price (INR/MWH)',
          font: {
            size: 13,
            family: 'Roboto, sans-serif',
          },
        },
        showgrid: true,
        automargin: true,
        tickfont: {
          size: 11,
          family: 'Roboto, sans-serif',
        },
      },
      yaxis2: {
        title: {
          text: 'ISTS Demand (MW)',
          font: {
            size: 13,
            family: 'Roboto, sans-serif',
          },
        },
        overlaying: 'y',
        side: 'right',
        showgrid: false,
        tickfont: {
          size: 11,
          family: 'Roboto, sans-serif',
        },
      },
      legend: {
        orientation: 'h',
        x: 0.3,
      },
      hovermode: 'x unified',
      height: 550,
    },
    config: { responsive: true },
  };
  
  
  public volumeGraph = {
    volumeData: [] as { y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string }[],
    layout: {
      title: {
        text: '',
        font: {
          size: 15,
        },
        y: 0.95
      },
      xaxis: {
        hoverformat: '%d %b %Y %H:%M',
        

      },
      yaxis: { title: 'Price (INR/MWH)', showgrid: true },
      yaxis2: {
        title: 'Volume (MW)', overlaying: 'y', side: 'right', showgrid: false, visible: true,

      },
      legend: { orientation: 'h', x: 0.3 },
      hovermode: 'x unified',
      height: 550
    },
    config: { responsive: true }
  };
  public meanGraph = {
    meanData: [] as { y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string }[],
    layout: {
      title: {
        text: 'India Price Vs ISTS Demand Statistics Graph',
        font: {
          size: 15,
        },
        y: 0.95
      },
      xaxis: {
        hoverformat: '%d %b %Y',
        zeroline: true, 
        zerolinewidth: 2,
        showline: true, 

      },
      yaxis: { title: 'Price (INR/MWH)', showgrid: true },
      yaxis2: {
        title: 'ISTS Demand (MW)', overlaying: 'y', side: 'right',
        showgrid: false,
        visible: true,
      },
      legend: { orientation: 'h', x: 0.3 },
      hovermode: 'x unified',
      height: 550
    },
    config: { responsive: true }
  };
  public meanVolumeGraph = {
    meanVolumeData: [] as { y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string }[],
    layout: {
      title: {
        text: '',
        font: {
          size: 15,
        },
        y: 0.95
      },
      xaxis: {
        hoverformat: '%d %b %Y',


      },
      yaxis: { title: 'Price (INR/MWH)', showgrid: true },
      yaxis2: {
        title: 'Volume (MW)', overlaying: 'y', side: 'right',
        showgrid: false,
        visible: true,
      },
      legend: { orientation: 'h', x: 0.3 },
      hovermode: 'x unified',
      height: 550
    },
    config: { responsive: true }
  };

  priceVolumeOptions: any = [{ name: 'DAM', value: 'DAM' }, { name: 'GDAM', value: 'GDAM' }, { name: 'RTM', value: 'RTM' }];
  priceMeanVolumeOptions: any = [{ name: 'DAM', value: 'DAM' }, { name: 'GDAM', value: 'GDAM' }, { name: 'RTM', value: 'RTM' }];

  constructor(
    private authService: AuthServices,
    public sanitizer: DomSanitizer,
    private commonService: CommonService,
    private commonUtilityService: CommonUtilityService,
    private fb: FormBuilder,
    public datepipe: DatePipe,
    private router: Router,
    private messageService: MessageService,

  ) {
    this.loginUser = this.authService.getLocalItem('loginUser', true);
    this.selectedOption = this.priceVolumeOptions[0]
    this.onMeanSelection = this.priceMeanVolumeOptions[0]
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());
    this.getDataLoading = false;
    this.currentMeanDate = new Date();
    this.startMeanDate = new Date();
    this.startMeanDate.setDate(this.currentMeanDate.getDate() - 31);
    this.meanVolumeRange = this.fb.group({
      StartMeanDate: [this.startMeanDate],
      CurrentMeanDate: [this.currentMeanDate, Validators.required],
    });
    this.dateVolumeRange = this.fb.group({
      FromDate: [''],
      ToDate: ['', Validators.required],
    })
    this.currentDate = new Date();
    this.startDate = new Date();
    this.startDate.setDate(this.currentDate.getDate() - 31);
    this.meanRange = this.fb.group({
      StartDate: [this.startDate],
      CurrentDate: [this.currentDate, Validators.required],
    });
    this.dateRange = this.fb.group({
      FromDate: [''],
      ToDate: ['', Validators.required],
    });



  }



  ngOnInit() {
    this.clickNavigationButton();
    this.dateRange.patchValue({
      FromDate: new Date(),
      ToDate: new Date(),
    });
    this.dateVolumeRange.patchValue({
      FromDate: new Date(),
      ToDate: new Date(),
    });
    // this.meanRange.patchValue({
    //   StartDate: new Date(), 
    //   CurrentDate: new Date(),  
    // });  
    // this.meanVolumeRange.patchValue({
    //   FromDate: new Date(), 
    //   ToDate: new Date(),    
    // }); 
    this.getPriceDemandData();
  }
  clickNavigationButton() {
    if (this.loginUser?.privilege_code === 'system_admin') {
      this.router.navigate(['/status']);
    }
  }

  onDateRangeChange() {
    if (this.dateRange.valid) {
      this.getPriceDemandData();
    }
  }
  onDateVolumeRangeChange() {
    if (this.dateVolumeRange.valid) {
      this.getPriceVsVolume(this.selectedOption.value);
    }
  }
  onMeanDateRangeChange() {
    if (this.meanRange.valid) {
      this.getMeanPriceDemandGraphData();
    }
  }
  onMeanVolumeDateRange() {
    if (this.meanVolumeRange.valid) {
      this.getMeanPriceVolumeGraphData(this.onMeanSelection.value);
    }
  }

  getPriceDemandData() {
    this.getDataLoading = true;
    var FromDate = this.datepipe.transform(this.dateRange.value['FromDate'], "dd-MMM-yyyy")?.toString();
    var ToDate = this.datepipe.transform(this.dateRange.value['ToDate'], "dd-MMM-yyyy")?.toString();


    this.commonService.getPvdGraphData({
      params: {
        start_date: FromDate,
        end_date: ToDate
      },
    }).subscribe((res) => {
      if (res && res.data && res.data.data) {
        this.priceDemandData = res.data.data
        this.getPriceVsDemand();
        this.getDataLoading = false;

      } else {
        this.getDataLoading = false;
        this.graph.priceData = [];
      }

    }, (err: any) => {
      this.getDataLoading = false;
      this.graph.priceData = [];
      const errorMessage = `There is no data available for the date range ${FromDate} to ${ToDate}.`;
      this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
    });
  }

  getPriceVsDemand() {
    if (this.priceDemandData && this.priceDemandData.length > 0) {
      const mockData: any[] = [];
      this.priceDemandData.forEach((entry: any) => {
        mockData.push({ start_time: entry.START_TIME, dam: entry.DAM, gdam: entry.GDAM, rtm: entry.RTM, demand: entry.DEMAND });
      });
      this.graph.priceData = [
        {
          x: mockData.map(entry => entry.start_time),
          y: mockData.map(entry => entry.dam),
          type: 'scatter',
          mode: 'lines+points',
          marker: { color: 'blue' },
          yaxis: 'y1',
          name: 'DAM',
        } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
        {
          x: mockData.map(entry => entry.start_time),
          y: mockData.map(entry => entry.gdam),
          type: 'scatter',
          mode: 'lines+points',
          marker: { color: 'green' },
          yaxis: 'y1',
          name: 'GDAM',
        } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
        {
          x: mockData.map(entry => entry.start_time),
          y: mockData.map(entry => entry.rtm),
          type: 'scatter',
          mode: 'lines+points',
          marker: { color: 'red' },
          yaxis: 'y1',
          name: 'RTM',
        } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
        {
          x: mockData.map(entry => entry.start_time),
          y: mockData.map(entry => entry.demand),
          type: 'scatter',
          mode: 'lines+points',
          marker: { color: 'yellow' },
          yaxis: 'y2',
          name: 'DEMAND',
        }
      ];
    }

  }

  onPriceVolumeOptionChange() {
    this.getPriceVsVolume(this.selectedOption.value);
  }
  onMeanPriceVolumeOptionChange() {
    this.getMeanPriceVolumeGraphData(this.onMeanSelection.value);
  }

  getPriceVsVolume(market: string) {
    this.getDataLoading = true;
    var FromDate = this.datepipe.transform(this.dateVolumeRange.value['FromDate'], 'dd-MMM-yyyy')?.toString();
    var ToDate = this.datepipe.transform(this.dateVolumeRange.value['ToDate'], 'dd-MMM-yyyy')?.toString();

    this.commonService.getPriceVolumesGraph({
      params: {
        start_date: FromDate,
        end_date: ToDate,
        market: market,
      },
    }).subscribe((res) => {
      if (res && res.data && res.data.data) {
        const marketData = res.data.data;
        if (market === 'DAM') {
          this.priceVolumeDamData = marketData;
        } else if (market === 'GDAM') {
          this.priceVolumeGdamData = marketData;
        } else if (market === 'RTM') {
          this.priceVolumeRtmData = marketData;
        }
        this.getDataLoading = false;
        this.updateVolumeGraphData();

      } else {
        this.getDataLoading = false;
        if (market === 'DAM') {
          this.volumeGraph.volumeData = [];
        } else if (market === 'GDAM') {
          this.volumeGraph.volumeData = [];
        } else if (market === 'RTM') {
          this.volumeGraph.volumeData = [];
        }
      }

    }, (err: any) => {
      this.getDataLoading = false;
      this.volumeGraph.volumeData = [];
      const errorMessage = `There is no data available for the date range ${FromDate} to ${ToDate}.`;
      this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
    });
  }
  updateVolumeGraphData() {
    const volumeGraphData: any[] = [];
    let titleText: string = '';
    let priceColor: string = '';
    if (this.selectedOption.value === 'DAM' && this.priceVolumeDamData) {
      this.priceVolumeDamData.forEach(entry => volumeGraphData.push({ key: 'DAM', start_time: entry.START_TIME, clearVolume: entry.CLEARED_VOLUME, price: entry.PRICE, price1: entry.PRICE_10, price9: entry.PRICE_90 }));
      titleText = 'India DAM Price Vs Volume Graph';
      priceColor = 'blue'
    } else if (this.selectedOption.value === 'GDAM' && this.priceVolumeGdamData) {
      this.priceVolumeGdamData.forEach(entry => volumeGraphData.push({ key: 'GDAM', start_time: entry.START_TIME, clearVolume: entry.CLEARED_VOLUME, price: entry.PRICE, price1: entry.PRICE_10, price9: entry.PRICE_90 }));
      titleText = 'India GDAM Price Vs Volume Graph';
      priceColor = 'green'
    } else if (this.selectedOption.value === 'RTM' && this.priceVolumeRtmData) {
      this.priceVolumeRtmData.forEach(entry => volumeGraphData.push({ key: 'RTM', start_time: entry.START_TIME, clearVolume: entry.CLEARED_VOLUME, price: entry.PRICE, price1: entry.PRICE_10, price9: entry.PRICE_90 }));
      titleText = 'India RTM Price Vs Volume Graph';
      priceColor = 'red'
    }
    this.volumeGraph.layout.title.text = titleText;
    this.volumeGraph.volumeData = [
      {
        x: volumeGraphData.map(entry => entry.start_time),
        y: volumeGraphData.map(entry => entry.clearVolume),
        type: 'bar',
        mode: 'lines+points',
        marker: { color: 'silver' },
        yaxis: 'y2',
        opacity: 0.2,
        name: 'CLEARED VOLUME',
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      {
        x: volumeGraphData.map(entry => entry.start_time),
        y: volumeGraphData.map(entry => entry.price),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: priceColor },
        yaxis: 'y1',
        name: 'PRICE',
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      {
        x: volumeGraphData.map(entry => entry.start_time),
        y: volumeGraphData.map(entry => entry.price1),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'red' },
        yaxis: 'y1',
        line: { dash: 'dot' },
        name: 'PRICE 10',
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      {
        x: volumeGraphData.map(entry => entry.start_time),
        y: volumeGraphData.map(entry => entry.price9),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'green' },
        line: { dash: 'dot' },
        yaxis: 'y1',
        name: 'PRICE 90',
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
    ];
  }

  updateMeanVolumeGraphData() {
    const volumeGraphData: any[] = [];
    let titleText: string = '';
    let priceColor: string = '';
    if (this.onMeanSelection.value === 'DAM' && this.priceMeanVolumeDamData) {
      this.priceMeanVolumeDamData.forEach(entry => volumeGraphData.push({ key: 'DAM', start_time: entry.DATE, clearVolume: entry.CLEARED_VOLUME, price: entry.PRICE, price1: entry.PRICE_10, price9: entry.PRICE_90 }));
      titleText = 'India DAM Price Vs Volume Statistics Graph';
      priceColor = 'blue'
    } else if (this.onMeanSelection.value === 'GDAM' && this.priceMeanVolumeGdamData) {
      this.priceMeanVolumeGdamData.forEach(entry => volumeGraphData.push({ key: 'GDAM', start_time: entry.DATE, clearVolume: entry.CLEARED_VOLUME, price: entry.PRICE, price1: entry.PRICE_10, price9: entry.PRICE_90 }));
      titleText = 'India GDAM Price Vs Volume Statistics Graph';
      priceColor = 'green'
    } else if (this.onMeanSelection.value === 'RTM' && this.priceMeanVolumeRtmData) {
      this.priceMeanVolumeRtmData.forEach(entry => volumeGraphData.push({ key: 'RTM', start_time: entry.DATE, clearVolume: entry.CLEARED_VOLUME, price: entry.PRICE, price1: entry.PRICE_10, price9: entry.PRICE_90 }));
      titleText = 'India RTM Price Vs Volume Statistics Graph';
      priceColor = 'red'
    }
    this.meanVolumeGraph.layout.title.text = titleText;
    this.meanVolumeGraph.meanVolumeData = [
      {
        x: volumeGraphData.map(entry => entry.start_time),
        y: volumeGraphData.map(entry => entry.clearVolume),
        type: 'bar',
        mode: 'lines+points',
        marker: { color: 'silver' },
        yaxis: 'y2',
        opacity: 0.2,
        name: 'CLEARED VOLUME',
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      {
        x: volumeGraphData.map(entry => entry.start_time),
        y: volumeGraphData.map(entry => entry.price),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: priceColor },
        yaxis: 'y1',
        name: 'PRICE',
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      {
        x: volumeGraphData.map(entry => entry.start_time),
        y: volumeGraphData.map(entry => entry.price1),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'orange' },
        yaxis: 'y1',
        line: { dash: 'dot' },
        name: 'PRICE 10',
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      {
        x: volumeGraphData.map(entry => entry.start_time),
        y: volumeGraphData.map(entry => entry.price9),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'orange' },
        line: { dash: 'dot' },
        yaxis: 'y1',
        name: 'PRICE 90',
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
    ];
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
    if (this.selectedTab === 'priceVolume') {
      this.getPriceVsVolume(this.selectedOption.value);
    } else if (this.selectedTab === 'priceDemandStatistics') {
      this.getMeanPriceDemandGraphData();
    } else if (this.selectedTab === 'priceVolumeStatistics') {
      this.getMeanPriceVolumeGraphData(this.onMeanSelection.value)
    }
  }
  getMeanPriceDemandGraphData() {
    this.getDataLoading = true;
    var FromDate = this.datepipe.transform(this.meanRange.value['StartDate'], "dd-MMM-yyyy")?.toString();
    var ToDate = this.datepipe.transform(this.meanRange.value['CurrentDate'], "dd-MMM-yyyy")?.toString();
    if (this.meanRange.value['CurrentDate']-this.meanRange.value['StartDate']!=0){
      this.commonService.getMeanPvdGraphData({
        params: {
          start_date: FromDate,
          end_date: ToDate,
        },
      }).subscribe((res) => {
        if (res && res.data && res.data.data) {
          this.priceDemandMeanData = res.data.data;
          this.getMeanDemandPriceOptions();
          this.getDataLoading = false;
        } else {
          this.getDataLoading = false;
          this.meanGraph.meanData = [];
        }

      }, (err: any) => {
        this.getDataLoading = false;
        this.meanGraph.meanData = [];
        const errorMessage = `There is no data available for the date range ${FromDate} to ${ToDate}.`;
        this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
      });
    }
    else{
      this.getDataLoading=false;
      this.meanGraph.meanData=[]
    }
}
 getMeanDemandPriceOptions() {
    if (this.priceDemandMeanData && this.priceDemandMeanData.length > 0) {
      const mockData: any[] = [];
      this.priceDemandMeanData.forEach((entry: any) => {
        mockData.push({ start_time: entry.START_TIME, dam: entry.DAM, gdam: entry.GDAM, rtm: entry.RTM, demand: entry.DEMAND });
      });
      this.meanGraph.meanData = [
        {
          x: mockData.map(entry => entry.start_time),
          y: mockData.map(entry => entry.dam),
          type: 'scatter',
          mode: 'lines+points',
          marker: { color: 'blue' },
          yaxis: 'y1',
          name: 'DAM',
        } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
        {
          x: mockData.map(entry => entry.start_time),
          y: mockData.map(entry => entry.gdam),
          type: 'scatter',
          mode: 'lines+points',
          marker: { color: 'green' },
          yaxis: 'y1',
          name: 'GDAM',
        } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
        {
          x: mockData.map(entry => entry.start_time),
          y: mockData.map(entry => entry.rtm),
          type: 'scatter',
          mode: 'lines+points',
          marker: { color: 'red' },
          yaxis: 'y1',
          name: 'RTM',
        } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
        {
          x: mockData.map(entry => entry.start_time),
          y: mockData.map(entry => entry.demand),
          type: 'scatter',
          mode: 'lines+points',
          marker: { color: 'yellow' },
          yaxis: 'y2',
          name: 'DEMAND',
        } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      ];
    }
  }


  getMeanPriceVolumeGraphData(market) {
    this.getDataLoading = true;
    var FromDate = this.datepipe.transform(this.meanVolumeRange.value['StartMeanDate'], 'dd-MMM-yyyy')?.toString();
    var ToDate = this.datepipe.transform(this.meanVolumeRange.value['CurrentMeanDate'], 'dd-MMM-yyyy')?.toString();
    if (this.meanVolumeRange.value['CurrentMeanDate']-this.meanVolumeRange.value['StartMeanDate']!=0){


      this.commonService.getMeanPvvGraphData({
        params: {
          start_date: FromDate,
          end_date: ToDate,
          market: market,
        },
      }).subscribe((res) => {
        if (res && res.data && res.data.data) {
          const marketData = res.data.data;
          if (market === 'DAM') {
            this.priceMeanVolumeDamData = marketData;
          } else if (market === 'GDAM') {
            this.priceMeanVolumeGdamData = marketData;
          } else if (market === 'RTM') {
            this.priceMeanVolumeRtmData = marketData;
          }
          this.getDataLoading = false;
          this.updateMeanVolumeGraphData();
        } else {
          this.getDataLoading = false;
          this.meanVolumeGraph.meanVolumeData = []
        }

      }, (err: any) => {
        this.getDataLoading = false;
        if (market === 'DAM') {
          this.meanVolumeGraph.meanVolumeData = [];
        } else if (market === 'GDAM') {
          this.meanVolumeGraph.meanVolumeData = [];
        } else if (market === 'RTM') {
          this.meanVolumeGraph.meanVolumeData = [];
        }
        const errorMessage = `There is no data available for the date range ${FromDate} to ${ToDate}.`;
        this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
      });
    }
    else{
      this.getDataLoading=false;
      this.meanVolumeGraph.meanVolumeData=[];
    }
  }
  
}