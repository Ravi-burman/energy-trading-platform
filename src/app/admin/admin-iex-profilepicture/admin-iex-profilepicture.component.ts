import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommonService } from '../services/common.service';
import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-3d';

HC_more(Highcharts);  

@Component({
  selector: 'app-admin-iex-profilepicture',
  templateUrl: './admin-iex-profilepicture.component.html',
  styleUrls: ['./admin-iex-profilepicture.component.scss']
})
export class AdminIexProfilepictureComponent  {
  getDataLoading: boolean = false;
  selectedDeliveryArea: any;
  deliveryAreaCode: any;
  selectedDeliveryCode: any;
  deliveryAreaOptions: any;
  priceBarGraphData: any;
  selectedOption: any;
  marketOption: any;

  chart: Highcharts.Chart | undefined;

  profiledayOptions: any = [{ name: 'Weekday Price', value: 'wdp' }, { name: 'Weekend Price', value: 'wep' }, { name: 'Weekday Volume', value: 'wdv' }, { name: 'Weekend Volume', value: 'wev' }];
  selectMarketOptions: any = [{ name: 'DAM', value: 'DAM' }, { name: 'GDAM', value: 'GDAM' }, { name: 'RTM', value: 'RTM' }];

  public barGraph = {
    priceBarGraphData: [] as { x: any[]; y: any[]; z: any[]; type: string; showscale: boolean, }[],
    priceLayout: {},
    config: { responsive: true, displayModeBar: false }
  };
  deliveryCodeOptions: any[];

  constructor(
    private commonService: CommonService,
    private messageService: MessageService,
    private renderer: Renderer2, private elRef: ElementRef
  ) {
    this.getDataLoading = false;
    this.selectedOption = this.profiledayOptions[0];
    this.marketOption = this.selectMarketOptions[0];
  }

  ngOnInit() {
    this.getIexDeliveryArea();
  }

  onProfileOptionChange() {
    this.getIexBarGraphData(this.selectedDeliveryCode, this.marketOption.value, this.selectedOption.value);
  }

  getIexDeliveryArea() {
    this.commonService.getIexAreaTypes({}).subscribe((res) => {
      this.deliveryAreaOptions = res.data.data;
      this.selectedDeliveryArea = this.deliveryAreaOptions[0];
      this.deliveryAreaOptions[2] = 'MARKET AREA';
      this.getIexAreaCode(this.selectedDeliveryArea);
    });
  }

  getIexAreaCode(area_type: string) {
    this.commonService.getIexAreaCodeData({
      params: {
        area_type: area_type,
      },
    }).subscribe((res) => {
      this.deliveryAreaCode = res.data.data;
      this.deliveryCodeOptions = this.deliveryAreaCode.map((code => code.CODE));
      this.selectedDeliveryCode = this.deliveryCodeOptions[0];
      this.getIexBarGraphData(this.selectedDeliveryCode, this.marketOption.value, this.selectedOption.value);
    });
  }

  onDeliveryAreaChange() {
    if (this.selectedDeliveryArea === 'MARKET AREA') {
      this.getIexAreaCode('MARKET_AREA');
    } else {
      this.getIexAreaCode(this.selectedDeliveryArea);
    }
  }

  onDeliveryMarketChange() {
    this.getIexBarGraphData(this.selectedDeliveryCode, this.marketOption.value, this.selectedOption.value);
  }

  onDeliveryCodeChange() {
    this.getIexBarGraphData(this.selectedDeliveryCode, this.marketOption.value, this.selectedOption.value);
  }

  getIexBarGraphData(delivery_area: string, market: any, weekprice: string) {
    this.getDataLoading = true;
    this.commonService.getIexBarGraph({
      params: {
        area: delivery_area,
        market: market,
        attribute: weekprice
      },
    }).subscribe((res) => {
      if (res.status_code === 200) {
        if (res && res.data && res.data.data) {
          const marketData = res.data.data;
          this.priceBarGraphData = marketData;
          this.getPriceBarGraph();
          this.getDataLoading = false;
        }
      } else {
        this.getDataLoading = false;
        this.barGraph.priceBarGraphData = [];
        this.messageService.add({ severity: 'error', summary: 'Service Message', detail: 'There is no data available.' });
      }
      this.getDataLoading = false;
    }, (err: any) => {
      this.getDataLoading = false;
      this.barGraph.priceBarGraphData = [];
      this.messageService.add({ severity: 'error', summary: 'Service Message', detail: 'There is no data available.' });
    });
  }

  getPriceBarGraph() {
    const xCategories: any[] = [];  
    const zCategories: any[] = [];  
    const data: any[] = []; 
    this.priceBarGraphData.forEach(item => {
        const hour = item.hour;
        const month = item.month;
        const price = item.price;
        if (!xCategories.includes(hour)) {
            xCategories.push(hour);
        }

        if (!zCategories.includes(month)) {
            zCategories.push(month);
        }
        data.push({
            x: xCategories.indexOf(hour),  
            y: price,  
            z: zCategories.indexOf(month)  
        });
    });

    this.chart = Highcharts.chart({
      chart: {
        renderTo: 'container',  
        type: 'scatter3d',
        options3d: {
          enabled: true,
          alpha: 5,       
          beta: 50,          
          depth: 500,       
          viewDistance: 25,  
          fitToPlot: true,  
          frame: {
            bottom: { size: 1, color: 'rgba(255, 182, 193, 0.3)' },
            back: { size: 1, color: 'rgba(144, 238, 144, 0.3)' },   
            left: { size: 1, color: 'rgba(173, 216, 230, 0.3)' }    
          }
        }
      },
      title: {
        text: 'IEX Profile Picture',
      },
      legend: {
        enabled: true, 
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        x: 0,
        y: 0,
      },
      colorAxis: {
        reversed: false,
        stops: [
          [0, '#66cc66'],
          [0.5, '#fff566'], 
          [1, '#ff9966'],  
        ],
        tickPixelInterval: 30
      },
      xAxis: {
        title: { text: 'Hours' },
        categories: xCategories,  
      },
      yAxis: {
        title: { text: 'Price' }, 
        min: 0,
        gridLineWidth: 1,
      },
      zAxis: {
        title: { text: 'Months' }, 
        categories: zCategories,  
        showFirstLabel: false,
      },
      tooltip: {
        formatter: function () {
          const point = this.point as any; 
          return '<b>Hour:</b> ' + xCategories[point.x] + '<br>' +  
                 '<b>Month:</b> ' + zCategories[point.z] + '<br>' +  
                 '<b>Price:</b> ' + point.y;  
        }
      },
      series: [{
        name: 'Price/Volume',
        data: data,  
        type: 'scatter3d',
        showInLegend: false,
        colorKey: 'y', 
      }]
    });

    this.addDragRotation();
}

  getHighchartsSurfaceData(zData: number[][], xLength: number, yLength: number): [number, number, number][] {
    const surfaceData: [number, number, number][] = [];

    for (let i = 0; i < yLength; i++) {
      for (let j = 0; j < xLength; j++) {
        const price = zData[i] && zData[i][j] ? zData[i][j] : 0; 
        surfaceData.push([j, i, price]); 
      }
    }
    return surfaceData;
  }

  addDragRotation(): void {
    const chart = this.chart;
    if (!chart) return;

    (function (H) {
      H.addEvent(chart.container, 'mousedown', function (eStart: any) {
        eStart = chart.pointer.normalize(eStart);

        const posX = eStart.chartX;
        const posY = eStart.chartY;
        const alpha = chart.options.chart?.options3d?.alpha || 0;
        const beta = chart.options.chart?.options3d?.beta || 0;
        const sensitivity = 5;

        function drag(e: any) {
          e = chart.pointer.normalize(e);

          const newAlpha = alpha + (e.chartY - posY) / sensitivity;
          const newBeta = beta + (posX - e.chartX) / sensitivity;

          chart.update({
            chart: {
              options3d: {
                alpha: newAlpha,
                beta: newBeta
              }
            }
          }, undefined, undefined, false);
        }

        H.addEvent(document, 'mousemove', drag);

        H.addEvent(document, 'mouseup', function () {
          H.removeEvent(document, 'mousemove', drag);
        });
      });
    }(Highcharts));
  }
}
