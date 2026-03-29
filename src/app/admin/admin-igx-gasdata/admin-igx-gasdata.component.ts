import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthServices } from 'src/app/auth/auth.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-admin-igx-gasdata',
  templateUrl: './admin-igx-gasdata.component.html',
  styleUrls: ['./admin-igx-gasdata.component.scss']
})
export class AdminIgxGasdataComponent {
  @Input() min: any;
  loginUser: any;
  getDataLoading: boolean = false;
  priceVolumeData: any
  FromDate: any;
  ToDate: any;
  dateRange: FormGroup;
  selectedDeliveryArea: any;
  maxDate: Date;
  deliveryAreaCode: any;
  selectedDeliveryCode: any;
  dateChanged: any;
  priceVsVolumeData: any;
  deliveryAreaOptions: any;
  selectedTab: string = 'igxPrice';
  priceBarGraphData: any;
  selectedOption : any;

  profiledayOptions: any = [{ name: 'Weekday Price', value: 'wdp' }, { name: 'Weekend Price', value: 'wep' }, { name: 'Weekday Volume', value: 'wdv' } , { name: 'Weekend Volume', value: 'wev' }];
  public graph = {
    priceData: [] as { y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string }[],
    layout: {
      title: {
        text: 'India IGX Graph',
        font: {
          size: 15,
        },
        y: 0.95
      },
      xaxis: {
        rangeslider: { type: 'date' },
        autorange: true,
        hoverformat: '%d %b %Y %H:%M',
      },
      yaxis: {
        title: 'Price (INR/MMBTU)',
        side: 'left',
        showgrid: true,
        font: {
          size: 130,
          family: 'Roboto, sans-serif',
        },
        automargin: true,
        tickfont: {
          size: 11,
          family: 'Roboto, sans-serif',
        },
        autorange: true,
      },
      yaxis2: {
        title: 'VOLUME (MMBTU)',
        side: 'right',
        showgrid: false,
        visible: true,

        automargin: true,
        font: {
          size: 13,
          family: 'Roboto, sans-serif',
        },
        overlaying: 'y',
        tickfont: {
          size: 11,
          family: 'Roboto, sans-serif',
        },
        autorange: true,
      },
      legend: { orientation: 'h', x: 0.3, y: -0.5 },
      hovermode: 'x unified',
      height: 600
    },
    config: { responsive: true }
  };
  public barGraph = {
    priceBarGraphData: [] as { x: any[]; y: any[]; z: any[]; type: string; showscale: boolean , }[],
    priceLayout: {} ,
    config: { responsive: true }
  };
  deliveryCodeOptions: any[];

  constructor(
    private authService: AuthServices,
    private commonService: CommonService,
    private fb: FormBuilder,
    public datepipe: DatePipe,
    private messageService: MessageService,

  ) {
    this.loginUser = this.authService.getLocalItem('loginUser', true);
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 90);
    this.getDataLoading = false;
    this.dateRange = this.fb.group({
      FromDate: [''],
      ToDate: ['', Validators.required],
    });
    const currentDate = new Date();
    const last30Days = new Date();
    last30Days.setDate(currentDate.getDate() - 30);
    const next30Days = new Date();
    next30Days.setDate(currentDate.getDate() + 30);

    this.dateRange.patchValue({
      FromDate: last30Days,
      ToDate: next30Days,
    });
    this.selectedOption = this.profiledayOptions[0]
  }


  ngOnInit() {
    this.getIgxDeliveryArea();
  }

  onDateRangeChange() {
    if (this.dateRange.valid) {
      if (this.selectedDeliveryArea === 'DELIVERY POINT') {
        this.getPriceVolumeData('DELIVERY_POINT', this.selectedDeliveryCode);
        this.getIgxPriceVolumeData('DELIVERY_POINT', this.selectedDeliveryCode);
      }
      else {
        this.getPriceVolumeData(this.selectedDeliveryArea, this.selectedDeliveryCode)
        this.getIgxPriceVolumeData(this.selectedDeliveryArea, this.selectedDeliveryCode);
      }
    }
  }

  onProfileOptionChange() {
    this.getIgxBarGraphData(this.selectedDeliveryArea, this.selectedDeliveryCode , this.selectedOption.value)
  }
  getPriceVolumeData(delivery_area: string, delivery_area_code: any) {
    this.getDataLoading = true;
    var FromDate = this.datepipe.transform(this.dateRange.value['FromDate'], "dd-MMM-yyyy")?.toString();
    var ToDate = this.datepipe.transform(this.dateRange.value['ToDate'], "dd-MMM-yyyy")?.toString();

    this.commonService.getIgxGraphData({
      params: {
        start_date: FromDate,
        end_date: ToDate,
        delivery_area: delivery_area,
        delivery_area_code: delivery_area_code

      },
    }).subscribe((res) => {
      if (res.status_code === 200) {
        if (res && res.data && res.data.data) {
          this.priceVolumeData = res.data.data
          this.getPriceVsVolume();
          this.getDataLoading = false;
        }
      } else {
        this.getDataLoading = false;
        this.priceVolumeData = [];
        this.graph.priceData = [];
        const errorMessage = `There is no data available for the date range ${FromDate} to ${ToDate}.`;
        this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
      }
      this.getDataLoading = false;

    }, (err: any) => {
      this.getDataLoading = false;
      this.graph.priceData = [];
      this.priceVolumeData = [];
      const errorMessage = `There is no data available for the date range ${FromDate} to ${ToDate}.`;
      this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
    });
  }
  getIgxDeliveryAreaCode(delivery_area: string) {
    this.commonService.getIgxDeliveryCodeData({
      params: {
        delivery_area: delivery_area,
      },
    }).subscribe((res) => {
      this.deliveryAreaCode = res.data.data;
      this.deliveryCodeOptions = this.deliveryAreaCode.map((code => code.CODE));
      this.selectedDeliveryCode = this.deliveryCodeOptions[0];
      if (this.selectedTab === 'barGraph') {
        if (this.selectedDeliveryArea === 'DELIVERY POINT') {
          this.getIgxBarGraphData('DELIVERY_POINT', this.selectedDeliveryCode , this.selectedOption.value)
        }
        else {
          this.getIgxBarGraphData(this.selectedDeliveryArea, this.selectedDeliveryCode , this.selectedOption.value)
        }
      }
      else {
        if (this.selectedDeliveryArea === 'DELIVERY POINT') {
          this.getPriceVolumeData('DELIVERY_POINT', this.selectedDeliveryCode);
          this.getIgxPriceVolumeData('DELIVERY_POINT', this.selectedDeliveryCode);
        }
        else {
          this.getPriceVolumeData(this.selectedDeliveryArea, this.selectedDeliveryCode);
          this.getIgxPriceVolumeData(this.selectedDeliveryArea, this.selectedDeliveryCode);
        }
      }
    })

  }

  getIgxDeliveryArea() {
    this.commonService.getIgxDeliveryArea({

    }).subscribe((res) => {
      this.deliveryAreaOptions = res.data.data;
      this.selectedDeliveryArea = this.deliveryAreaOptions[0];
      this.deliveryAreaOptions[3] = 'DELIVERY POINT'
      this.getIgxDeliveryAreaCode(this.selectedDeliveryArea)
    })

  }
  selectTab(tab: string) {
    this.selectedTab = tab;
    if (this.selectedTab === 'barGraph') {
      this.getIgxBarGraphData(this.selectedDeliveryArea, this.selectedDeliveryCode , this.selectedOption.value)
    }
  }

  getPriceVsVolume() {
    const mockData: any[] = [];
    const igxPriceData: any[] = [];
    let priceName: string = '';
    let volumeName: string = '';

    if (this.selectedDeliveryArea === 'COUNTRY' && this.priceVolumeData) {
      this.priceVolumeData.forEach((entry: any) => {
        mockData.push({ start_time: entry.START_TIME, price: entry.PRICE, volume: entry.VOLUME });
      });
      this.priceVsVolumeData.forEach((entry: any) => {
        igxPriceData.push({ start_time: entry.START_TIME, price_10: entry.PRICE_10, price_90: entry.PRICE_90 })
      })
      priceName = this.selectedDeliveryCode + ' PRICE';
      volumeName = this.selectedDeliveryCode + ' VOLUME';

    }
    else if (this.selectedDeliveryArea === 'HUB') {
      this.priceVolumeData.forEach((entry: any) => {
        mockData.push({ start_time: entry.START_TIME, price: entry.PRICE, volume: entry.VOLUME });
      });
      this.priceVsVolumeData.forEach((entry: any) => {
        igxPriceData.push({ start_time: entry.START_TIME, price_10: entry.PRICE_10, price_90: entry.PRICE_90 })
      })
      priceName = this.selectedDeliveryCode + ' PRICE';
      volumeName = this.selectedDeliveryCode + ' VOLUME';
    }
    else if (this.selectedDeliveryArea === 'STATE') {
      this.priceVolumeData.forEach((entry: any) => {
        mockData.push({ start_time: entry.START_TIME, price: entry.PRICE, volume: entry.VOLUME });
      });
      this.priceVsVolumeData.forEach((entry: any) => {
        igxPriceData.push({ start_time: entry.START_TIME, price_10: entry.PRICE_10, price_90: entry.PRICE_90 })
      })

      priceName = this.selectedDeliveryCode + ' PRICE';
      volumeName = this.selectedDeliveryCode + ' VOLUME';
    }
    else if (this.selectedDeliveryArea === 'DELIVERY POINT') {
      this.priceVolumeData.forEach((entry: any) => {
        mockData.push({ start_time: entry.START_TIME, price: entry.PRICE, volume: entry.VOLUME });

      });
      this.priceVsVolumeData.forEach((entry: any) => {
        igxPriceData.push({ start_time: entry.START_TIME, price_10: entry.PRICE_10, price_90: entry.PRICE_90 })
      })
      priceName = this.selectedDeliveryCode + ' PRICE';
      volumeName = this.selectedDeliveryCode + ' VOLUME';

    }
    this.graph.priceData = [
      {
        x: mockData.map(entry => entry.start_time),
        y: mockData.map(entry => entry.volume),
        type: 'bar',
        mode: 'lines+points',
        marker: { color: 'silver' },
        yaxis: 'y2',
        name: volumeName,
        opacity: 0.3,
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      {
        x: mockData.map(entry => entry.start_time),
        y: mockData.map(entry => entry.price),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'blue' },
        yaxis: 'y1',
        name: priceName,

      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      {
        x: igxPriceData.map(entry => entry.start_time),
        y: igxPriceData.map(entry => entry.price_10),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'red' },
        yaxis: 'y1',
        line: { dash: 'dot' },
        name: 'PRICE 10',
        opacity: 0.3,
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },

      {
        x: igxPriceData.map(entry => entry.start_time),
        y: igxPriceData.map(entry => entry.price_90),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'green' },
        yaxis: 'y1',
        line: { dash: 'dot' },
        name: 'PRICE 90',
        opacity: 0.3,
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
    ];
  }
  onDeliveryAreaChange() {
    if (this.selectedDeliveryArea === 'DELIVERY POINT') {
      this.getIgxDeliveryAreaCode("DELIVERY_POINT")
    }
    else {
      this.getIgxDeliveryAreaCode(this.selectedDeliveryArea)
    }
  }
  onDeliveryCodeChange() {
    if (this.selectedTab === 'barGraph') {
      if (this.selectedDeliveryArea === 'DELIVERY POINT') {
        this.getIgxBarGraphData('DELIVERY_POINT', this.selectedDeliveryCode , this.selectedOption.value)
      }
      else {
        this.getIgxBarGraphData(this.selectedDeliveryArea, this.selectedDeliveryCode , this.selectedOption.value)
      }
    }
    else {
      if (this.selectedDeliveryArea === 'DELIVERY POINT') {
        this.getPriceVolumeData("DELIVERY_POINT", this.selectedDeliveryCode);
        this.getIgxPriceVolumeData("DELIVERY_POINT", this.selectedDeliveryCode);
      }
      else {
        this.getPriceVolumeData(this.selectedDeliveryArea, this.selectedDeliveryCode);
        this.getIgxPriceVolumeData(this.selectedDeliveryArea, this.selectedDeliveryCode);
      }
    }
  }

  getIgxPriceVolumeData(delivery_area: string, delivery_area_code: any) {
    this.getDataLoading = true;
    var FromDate = this.datepipe.transform(this.dateRange.value['FromDate'], "dd-MMM-yyyy")?.toString();
    var ToDate = this.datepipe.transform(this.dateRange.value['ToDate'], "dd-MMM-yyyy")?.toString();
    this.commonService.getIgxPriceVolumeData({
      params: {
        start_date: FromDate,
        end_date: ToDate,
        delivery_area: delivery_area,
        delivery_area_code: delivery_area_code
      },
    }).subscribe((res) => {
      if (res.status_code === 200) {
        if (res && res.data && res.data.data) {
          this.priceVsVolumeData = res.data.data
          this.getPriceVsVolume();
          this.getDataLoading = false;
        }
      } else {
        this.getDataLoading = false;
        this.graph.priceData = [];
      }
      this.getDataLoading = false;

    }, (err: any) => {
      this.getDataLoading = false;
      this.graph.priceData = [];
    });
  }
  getIgxBarGraphData(delivery_area: string, delivery_area_code: any , weekprice:string) {
    this.getDataLoading = true;
    this.commonService.getIgxBarGraph({
      params: {
        delivery_area: delivery_area,
        delivery_area_code: delivery_area_code,
        attribute  :weekprice
      },
    }).subscribe((res) => {
      if (res.status_code === 200) {
        if (res && res.data && res.data.data) {
          const weekpriceData = res.data.data;
          if (weekprice === 'wdp' || weekprice === 'wep' || weekprice === 'wdv' || weekprice === 'wev') {
            this.priceBarGraphData = weekpriceData;
            this.getPriceBarGraph();
            this.getDataLoading = false;
        }
      }
      } else {
        this.getDataLoading = false;
        this.barGraph.priceBarGraphData = [];
        const errorMessage = `There is no data available.`;
        this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
      }
      this.getDataLoading = false;

    }, (err: any) => {
      this.getDataLoading = false;
      this.barGraph.priceBarGraphData = [];
      const errorMessage = `There is no data available.`;
      this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
    });
  }
  getPriceBarGraph() {
    const x: any[] = []; 
    const y: any[] = []; 
    const z: any[] = [];      
  if (this.selectedDeliveryArea === 'COUNTRY' && this.selectedOption.value === 'wdp' || this.selectedOption.value === 'wep' || this.selectedOption.value === 'wdv' || this.selectedOption.value === 'wev') {
    this.priceBarGraphData.forEach(item => {
      const month = item.month;
      const hour = item.hour;
      const price = item.price;
    if (!x.includes(hour)) {
      x.push(hour);
    }
    if (!y.includes(month)) {
      y.push(month);
    }
    const hourIndex = x.indexOf(hour);
    const monthIndex = y.indexOf(month);
    if (!z[monthIndex]) {
      z[monthIndex] = [];
    }
    z[monthIndex][hourIndex] = price;
  });
  }
    else if (this.selectedDeliveryArea === 'HUB') {
      this.priceBarGraphData.forEach(item => {
        const month = item.month;
        const hour = item.hour;
        const price = item.price;
      if (!x.includes(hour)) {
        x.push(hour);
      }
      if (!y.includes(month)) {
        y.push(month);
      }
      const hourIndex = x.indexOf(hour);
      const monthIndex = y.indexOf(month);
      if (!z[monthIndex]) {
        z[monthIndex] = [];
      }
      z[monthIndex][hourIndex] = price;
    });

    }
    else if (this.selectedDeliveryArea === 'STATE') {
      this.priceBarGraphData.forEach(item => {
        const month = item.month;
        const hour = item.hour;
        const price = item.price;
      if (!x.includes(hour)) {
        x.push(hour);
      }
      if (!y.includes(month)) {
        y.push(month);
      }
      const hourIndex = x.indexOf(hour);
      const monthIndex = y.indexOf(month);
      if (!z[monthIndex]) {
        z[monthIndex] = [];
      }
      z[monthIndex][hourIndex] = price;
    });
    }
    else if (this.selectedDeliveryArea === 'DELIVERY POINT') {
      this.priceBarGraphData.forEach(item => {
        const month = item.month;
        const hour = item.hour;
        const price = item.price;
      if (!x.includes(hour)) {
        x.push(hour);
      }
      if (!y.includes(month)) {
        y.push(month);
      }
      const hourIndex = x.indexOf(hour);
      const monthIndex = y.indexOf(month);
      if (!z[monthIndex]) {
        z[monthIndex] = [];
      }
      z[monthIndex][hourIndex] = price;
    });
    }
    
  this.barGraph.priceBarGraphData = [{
    x: x,
    y: y,
    z: z,
    type: 'surface',
    showscale: false
  }];
  this.barGraph.priceLayout = {
    title: {
      text: 'Profile Picture',
      font: { size: 15 },
      y: 0.95
    },
    scene : {
      xaxis: { title: 'Hours', tickvals: x, ticktext: x ,  tickfont: {size:10} }, 
      yaxis: { title: 'Months', tickvals: y, ticktext: y ,  tickfont: {size:10} },
      zaxis: { title: this.selectedOption.value === 'wev' || this.selectedOption.value === 'wdv' ? 'Volume' : 'Price',  tickfont: {size:10} },
      camera: {
        eye: {
          x: 1,
          y: -2.7,
          z: 1,
        }
      },
    },
    height: 650
  };
  }
}