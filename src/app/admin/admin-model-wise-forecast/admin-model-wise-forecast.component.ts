import { CommonService } from '../services/common.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-admin-model-wise-forecast',
  templateUrl: './admin-model-wise-forecast.component.html',
  styleUrls: ['./admin-model-wise-forecast.component.scss']
})
export class AdminModelWiseForecastComponent {
  getDataLoading: boolean = false;
  graphMetricsData: any;
  graphData: any;
  metricsData: any;
  damDateRange: FormGroup;
  gdamDateRange: FormGroup
  graphMetricsGraphData: any;
  graphMetricsMetricData: any;
  damOptions: any;
  rtmOptions:any;
  gdamOptions:any;
  maxDate: Date;
  currentDate: any;
  startDate: any;
  columns:any;
  selectedTab: string = 'damForecast';
  metricArrayData: any[] = [];
  graphForeCastData: any;
  blockSelection: any;
  graphRtmGraphData: any;
  graphRtmMetricData: any;
  approvedForeCast: any;
  currentForeCast: any;
  damForeCast: any;
  rtmForeCast: any;
  interval: any;
  gdamMetricsData:any;
  gdamGraphData:any;
  gdamColumns:any;
  dayColors: { [key: string]: string } = {
    'Mon': '#D5F5E3',
    'Tue': '#D6EAF8',
    'Wed': '#E8DAEF',
    'Thu': '#FADBD8',
    'Fri': '#BB8FCE',
    'Sat': '#ffe3b3',
    'Sun': '#ffff99',
    'default': '#CCCCCC'
  };
  public modelwiseGraphData = {
    modelwiseData: [] as { y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string }[],
    layout: {
      title: {
        text: 'India DAM Forecast Model-Wise',
        font: {
          size: 15,
        },
      },
      xaxis: {
        rangeslider: { type: 'date' },
        hoverformat: '%d %b %Y %H:%M',

      },
      yaxis: { title: 'Price (INR/MWH)', showgrid: true },
      legend: { orientation: 'h', x: 0, y: -0.5 },
      hovermode: 'x unified',
      height: 600
    },
    config: { responsive: true }
  };
  public rtmForeCastGraphData = {
    rtmForeCastData: [] as { y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string }[],
    layout: {
      title: {
        text: 'India RTM Forecast Model-Wise',
        font: {
          size: 15,
        },
      },
      xaxis: {
        rangeslider: { type: 'date' },
        hoverformat: '%d %b %Y %H:%M',

      },
      yaxis: { title: 'Price (INR/MWH)', showgrid: true },
      legend: { orientation: 'h', x: 0, y: -0.5 },
      hovermode: 'x unified',
      height: 600,
      shapes: [],
    },
    config: { responsive: true }
  };
  public gdamForeCastGraphData = {
    gdamForeCastData: [] as { y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string }[],
    layout: {
      title: {
        text: 'India GDAM Forecast Model-Wise',
        font: {
          size: 15,
        },
      },
      xaxis: {
        rangeslider: { type: 'date' },
        hoverformat: '%d %b %Y %H:%M',

      },
      yaxis: { title: 'Price (INR/MWH)', showgrid: true },
      legend: { orientation: 'h', x: 0, y: -0.5 },
      hovermode: 'x unified',
      height: 600,
      shapes: [],
    },
    config: { responsive: true }
  };

  damSelectOptions: any = [{ name: 'Graph & Metrics', value: 'graph_and_metrics' }, { name: 'Graph', value: 'graph' }, { name: 'Metrics', value: 'metrics' }];
  gdamSelectOptions: any = [{ name: 'Graph & Metrics', value: 'graph_and_metrics' }, { name: 'Graph', value: 'graph' }, { name: 'Metrics', value: 'metrics' }];
  rtmSelectOptions: any = [{ name: 'Graph & Metrics', value: 'graph_and_metrics' }, { name: 'Graph', value: 'graph' }, { name: 'Metrics', value: 'metrics' }];

  blockOptions: any = [{ name: '8 blocks', value: '8_blocks' }, { name: '96 blocks', value: '96_blocks' }];

  constructor(private commonService: CommonService,
    public datepipe: DatePipe,
    private fb: FormBuilder, private messageService: MessageService,
  ) {
    this.damOptions = this.damSelectOptions[0];
    this.gdamOptions = this.gdamSelectOptions[0];
    this.rtmOptions = this.rtmSelectOptions[0];
    this.blockSelection = this.blockOptions[0];
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 1);
    this.currentDate = new Date();
    this.startDate = new Date();
    this.startDate.setDate(this.currentDate.getDate() + 1);
    this.damDateRange = this.fb.group({
      StartDate: [this.startDate, Validators.required],
      CurrentDate: [this.currentDate],
    });
    this.gdamDateRange = this.fb.group({
      StartDate: [this.startDate, Validators.required],
      CurrentDate: [this.currentDate],
    });
    // this.dateRange = this.fb.group({
    //   FromDate: tomorrow,
    //   ToDate: tomorrow,
    // });
  }

  ngOnInit() {
    this.damDateRange.patchValue({
      StartDate: new Date(),
      CurrentDate: new Date(),
    });
    this.gdamDateRange.patchValue({
      StartDate: new Date(),
      CurrentDate: new Date(),
    });
    this.getModelwiseForeCastData(this.damOptions.value);
    this.interval = setInterval(() => {
      this.rtmIntervalUpdate();
    }, 30 * 60 * 1000);
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
    if (this.selectedTab === 'gdamForecast') {
      this.getGdamModelwiseForecast(this.gdamOptions.value)
    } else if (this.selectedTab === 'rtmForecast') {
      this.getRtmForeCastVsActualData(this.rtmOptions.value, this.blockSelection.value);
    } 
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
  onRtmOptionChange() {
    this.getRtmForeCastVsActualData(this.rtmOptions.value, this.blockSelection.value)
  }
  onRtmBlocksChange() {
    this.getRtmForeCastVsActualData(this.rtmOptions.value, this.blockSelection.value)

  }
  rtmIntervalUpdate() {
    this.commonService.getRtmForeCastData({
      params: {
        data_blocks: this.blockSelection.value,
        view_type: this.rtmOptions.value
      },
    }).subscribe((res) => {
      if (res && res.data && res.data.data) {
        const latestRtmForeCast = res.data.data.rtm_data;
        const lastUpdateTime = latestRtmForeCast[latestRtmForeCast.length - 1].START_TIME;
        if (lastUpdateTime !== this.rtmForeCast[this.rtmForeCast.length - 1].START_TIME) {
          const message = `Value is updated at ${lastUpdateTime}.`;
          this.messageService.add({ severity: 'info', summary: 'Update', detail: message });
          this.rtmForeCast = latestRtmForeCast;
          this.getRtmGraphForeCastData();
        }
      }

    });
  }
  getModelwiseForeCastData(view_type) {
    this.getDataLoading = true;
    var FromDate = this.datepipe.transform(this.damDateRange.value['CurrentDate'], "dd-MMM-yyyy")?.toString();
    var ToDate = this.datepipe.transform(this.damDateRange.value['StartDate'], "dd-MMM-yyyy")?.toString();
 
    this.commonService.getForecastModelwise({
      params: {
        start_date: FromDate,
        end_date: ToDate,
        view_type: view_type
      },
    }).subscribe((res) => {
      if (res && res.data && res.data.data) {
        if (view_type === 'graph_and_metrics') {
          this.metricsData = res.data.data.metrics_data;
          if (this.metricsData.length > 0) {
            this.columns = Object.keys(this.metricsData[0]).slice(2,);
          }
          this.graphMetricsGraphData = res.data.data.graph_data;
          this.graphMetricsMetricData = res.data.data.metrics_data;
        } else if (view_type === 'graph') {
          this.graphData = res.data.data.graph_data;
        } else if (view_type === 'metrics') {
          this.metricsData = res.data.data.metrics_data;
          if (this.metricsData.length > 0) {
            this.columns = Object.keys(this.metricsData[0]).slice(2,);
          }
          this.graphMetricsMetricData = res.data.data.metrics_data;
        }
 
        this.getDataLoading = false;
        this.getGraphForeCastData();
 
      } else {
        if (view_type === 'graph_and_metrics') {
          this.modelwiseGraphData.modelwiseData = []
          this.graphMetricsMetricData = [];
          this.metricsData = [];
          this.columns = [];
        } else if (view_type === 'graph') {
          this.graphData = [];
        } else if (view_type === 'metrics') {
          this.graphMetricsMetricData = [];
          this.metricsData = [];
          this.columns = [];
        }
        this.getDataLoading = false;
        const errorMessage = `There is no data available for the date range ${FromDate} to ${ToDate}.`;
        this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
      }
    }, (err: any) => {
      if (view_type === 'graph_and_metrics') {
        this.modelwiseGraphData.modelwiseData = [];
        this.metricsData = [];
        this.columns = [];
        this.graphMetricsMetricData = [];
      } else if (view_type === 'graph') {
        this.graphData = [];
      } else if (view_type === 'metrics') {
        this.graphMetricsMetricData = [];
        this.metricsData = [];
        this.columns = [];
      }
      this.getDataLoading = false;
      const errorMessage = `There is no data available for the date range ${FromDate} to ${ToDate}.`;
      this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
    });
  }
  getGdamGraphData(){
    const gdamMockData: any[] = [];
    const numModels = 25;
    if ((this.gdamOptions.value === 'graph_and_metrics' && this.graphMetricsGraphData) || (this.gdamOptions.value === 'graph' && this.graphData)) {
        const data = this.gdamOptions.value === 'graph_and_metrics' ? this.gdamGraphData : this.graphData;
        data.forEach(entry => {
            const dataEntry: any = { key: this.gdamOptions.value === 'graph_and_metrics' ? 'graph_and_metrics' : 'graph', start_time: entry.START_TIME,actual:entry.ACTUAL };
            for (let i = 1; i <= numModels; i++) {
                const modelKey = `MODEL_${i}`;
                dataEntry[`model${i}`] = entry[modelKey];
            }
            gdamMockData.push(dataEntry);
        });
    }
    this.gdamForeCastGraphData.gdamForeCastData = [
        {
            x: gdamMockData.map(entry => entry.start_time),
            y: gdamMockData.map(entry => entry.actual),
            type: 'scatter',
            mode: 'lines+points',
            marker: { color: 'blue' }, 
            yaxis: 'y1',
            name: 'Actual',
        } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
        ...Array.from({ length: numModels }, (_, i) => {
            const modelData = gdamMockData.map(entry => entry[`model${i + 1}`]);
            const allModelDataUndefined = modelData.every(val => val === undefined);
            if (allModelDataUndefined) {
                return null;
            }
            return {
                x: gdamMockData.map(entry => entry.start_time),
                y: modelData,
                type: 'scatter',
                mode: 'lines+points',
                marker: { color: '' }, 
                yaxis: 'y1',
                name: `Model${i + 1}`,
            };
        }).filter(trace => trace !== null), 
    ];
  }


  onDamModelwiseOptionChange() {
    if (this.selectedTab==='damForecast'){
      this.getModelwiseForeCastData(this.damOptions.value);
    }
  }
  onGdamModelwiseOptionChange(){
    if (this.selectedTab==='gdamForecast'){
      this.getGdamModelwiseForecast(this.gdamOptions.value);
    }
  }
  onDateRangeChange() {
    if (this.damDateRange.valid) {
      this.getModelwiseForeCastData(this.damOptions.value);
      
    }
  }
  onGdamRangeChange(){
    if (this.gdamDateRange.valid){
      this.getGdamModelwiseForecast(this.gdamOptions.value)
    }
  
    
  
  }
  getGraphForeCastData() {
    const mockData: any[] = [];
    const numModels = 24;
    if ((this.damOptions.value === 'graph_and_metrics' && this.graphMetricsGraphData) || (this.damOptions.value === 'graph' && this.graphData)) {
        const data = this.damOptions.value === 'graph_and_metrics' ? this.graphMetricsGraphData : this.graphData;
        data.forEach(entry => {
            const dataEntry: any = { key: this.damOptions.value === 'graph_and_metrics' ? 'graph_and_metrics' : 'graph', start_time: entry.START_TIME, actual: entry.ACTUAL };
            for (let i = 1; i <= numModels; i++) {
                const modelKey = `MODEL_${i}`;
                dataEntry[`model${i}`] = entry[modelKey];
            }
            mockData.push(dataEntry);
        });
    }
    this.modelwiseGraphData.modelwiseData = [
        {
            x: mockData.map(entry => entry.start_time),
            y: mockData.map(entry => entry.actual),
            type: 'scatter',
            mode: 'lines+points',
            marker: { color: 'blue' }, 
            yaxis: 'y1',
            name: 'Actual',
        } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
        ...Array.from({ length: numModels }, (_, i) => {
            const modelData = mockData.map(entry => entry[`model${i + 1}`]);
            const allModelDataUndefined = modelData.every(val => val === undefined);
            if (allModelDataUndefined) {
                return null;
            }
            return {
                x: mockData.map(entry => entry.start_time),
                y: modelData,
                type: 'scatter',
                mode: 'lines+points',
                marker: { color: '' }, 
                yaxis: 'y1',
                name: `Model${i + 1}`,
            };
        }).filter(trace => trace !== null), 
    ];
}
getRtmForeCastVsActualData(view_type, data_blocks) {
  this.getDataLoading = true;
  this.commonService.getRtmForeCastData({
    params: {
      data_blocks: data_blocks,
      view_type: view_type
    },
  }).subscribe((res) => {
    if (res) {
      if (res.data && res.data.data) {
        if (view_type === 'graph_and_metrics') {
          this.approvedForeCast = res.data.data.approved_forecast;
          this.currentForeCast = res.data.data.current_forecast;
          this.damForeCast = res.data.data.dam_data;
          this.rtmForeCast = res.data.data.rtm_data;
          this.graphRtmMetricData = res.data.data.metrics[0];
          const metrics = res.data.data.metrics[0];
          if (metrics) {
            const date = metrics.Date;
            const categories = ["FULL_DAY", "TRAILING_N"];
            this.graphRtmMetricData = categories.map(category => ({
              date: date,
              category: category,
              ...metrics[category]
            }));
          }
          this.graphRtmMetricData.forEach((item)=>{
            if(item.category==='FULL_DAY'){
              item.category='Full Day'
            }
            else if (item.category==='TRAILING_N'){
              item.category=`Trailing 'n'`
            }
          })
          // this.metricArrayData = Object.keys(this.graphRtmMetricData).map(key => ({ category: key, ...this.graphRtmMetricData[key] }));
          if (data_blocks === '96_blocks') {
            this.damForeCast = [];
          } else {
            this.damForeCast = res.data.data.dam_data;
          }

        } else if (view_type === 'graph') {
          this.approvedForeCast = res.data.data.approved_forecast;
          this.currentForeCast = res.data.data.current_forecast;
          this.damForeCast = res.data.data.dam_data;
          this.rtmForeCast = res.data.data.rtm_data;
          if (data_blocks === '96_blocks') {
            this.damForeCast = [];
          } else {
            this.damForeCast = res.data.data.dam_data;
          }
        } else if (view_type === 'metrics') {
          this.graphRtmMetricData = res.data.data[0];
          const metrics = res.data.data[0];
          if (metrics) {
            const date = metrics.Date;
            const categories = ["FULL_DAY", "TRAILING_N"];
            this.graphRtmMetricData = categories.map(category => ({
              date: date,
              category: category,
              ...metrics[category]
            }));
          }
          this.graphRtmMetricData.forEach((item)=>{
            if(item.category==='FULL_DAY'){
              item.category='Full Day'
            }
            else if (item.category==='TRAILING_N'){
              item.category=`Trailing 'n'`
            }
          })
          // this.metricArrayData = Object.keys(this.graphRtmMetricData).map(key => ({ category: key, ...this.graphRtmMetricData[key] }));
        }
      }
      this.getDataLoading = false;
      this.getRtmGraphForeCastData();
    } else {
      if (view_type === 'graph_and_metrics') {
        this.rtmForeCastGraphData.rtmForeCastData = []
        this.graphRtmMetricData = [];
      } else if (view_type === 'graph') {
        this.graphData = [];
      } else if (view_type === 'metrics') {
        this.graphRtmMetricData = [];
      }
      this.getDataLoading = false;
    }
  }, (err: any) => {
    this.getDataLoading = false;
    if (view_type === 'graph_and_metrics') {
      this.rtmForeCastGraphData.rtmForeCastData = []
      this.graphRtmMetricData = [];
    } else if (view_type === 'graph') {
      this.graphData = [];
    } else if (view_type === 'metrics') {
      this.graphRtmMetricData = [];
    }
    this.getDataLoading = false;
    const errorMessage = `There is no data available for Today.`;
    this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
  });
}
getRtmGraphForeCastData() {
  const mockData: any[] = [];

  if (this.rtmOptions.value === 'graph_and_metrics' || this.blockSelection.value === 'graph_and_metrics' && this.approvedForeCast && this.currentForeCast) {
    const mergedForeCastData = this.approvedForeCast.concat(this.currentForeCast).concat(this.damForeCast).concat(this.rtmForeCast);
    mergedForeCastData.forEach(entry => {
      mockData.push({ key: 'graph_and_metrics', start_time: entry.START_TIME, actual: entry.ACTUAL, forecast: entry.FORECAST, model1: entry.MODEL_1, model2: entry.MODEL_2, model3: entry.MODEL_3, model4: entry.MODEL_4, model5: entry.MODEL_5, model6: entry.MODEL_6, model7: entry.MODEL_7, model8: entry.MODEL_8, model9: entry.MODEL_9, model10: entry.MODEL_10, model11: entry.MODEL_11, model12: entry.MODEL_12, model13: entry.MODEL_13, model14: entry.MODEL_14, model15: entry.MODEL_15, model16: entry.MODEL_16, model17: entry.MODEL_17, model18: entry.MODEL_18, model19: entry.MODEL_19, model20: entry.MODEL_20, model21: entry.MODEL_21, model22: entry.MODEL_22, model23: entry.MODEL_23, model24: entry.MODEL_24, dam: entry.DAM, rtm: entry.RTM })
    });

    const lastApprovedForeCast = this.currentForeCast[0].START_TIME;
    const thirdBlockStartTime = this.currentForeCast[2].START_TIME;

    this.rtmForeCastGraphData.layout.shapes.push({
      type: 'scatter',
      mode: 'lines+points',
      x0: lastApprovedForeCast,
      x1: lastApprovedForeCast,
      y0: 0,
      y1: 1,
      yref: 'paper',
      line: {
        color: 'teal',
        width: 1,
        dash: 'dash',
      },
    });

    this.rtmForeCastGraphData.layout.shapes.push({
      type: 'scatter',
      mode: 'lines+points',
      x0: thirdBlockStartTime,
      x1: thirdBlockStartTime,
      y0: 0,
      y1: 1,
      yref: 'paper',
      line: {
        color: 'teal',
        width: 1,
        dash: 'dash',
      },
    });

  } else if (this.rtmOptions.value === 'graph' && this.approvedForeCast && this.currentForeCast) {
    const mergedForeCastData = this.approvedForeCast.concat(this.currentForeCast).concat(this.damForeCast).concat(this.rtmForeCast);
    mergedForeCastData.forEach(entry => {
      mockData.push({ key: 'graph', start_time: entry.START_TIME, actual: entry.ACTUAL, forecast: entry.FORECAST, model1: entry.MODEL_1, model2: entry.MODEL_2, model3: entry.MODEL_3, model4: entry.MODEL_4, model5: entry.MODEL_5, model6: entry.MODEL_6, model7: entry.MODEL_7, model8: entry.MODEL_8, model9: entry.MODEL_9, model10: entry.MODEL_10, model11: entry.MODEL_11, model12: entry.MODEL_12, model13: entry.MODEL_13, model14: entry.MODEL_14, model15: entry.MODEL_15, model16: entry.MODEL_16, model17: entry.MODEL_17, model18: entry.MODEL_18, model19: entry.MODEL_19, model20: entry.MODEL_20, model21: entry.MODEL_21, model22: entry.MODEL_22, model23: entry.MODEL_23, model24: entry.MODEL_24, dam: entry.DAM, rtm: entry.RTM })
    });


    const lastApprovedForeCast = this.currentForeCast[0].START_TIME;
    const thirdBlockStartTime = this.currentForeCast[2].START_TIME;

    this.rtmForeCastGraphData.layout.shapes.push({
      type: 'scatter',
      mode: 'lines+points',
      x0: lastApprovedForeCast,
      x1: lastApprovedForeCast,
      y0: 0,
      y1: 1,
      yref: 'paper',
      line: {
        color: 'teal',
        width: 1,
        dash: 'dash',
      },
    });

    this.rtmForeCastGraphData.layout.shapes.push({
      type: 'scatter',
      mode: 'lines+points',
      x0: thirdBlockStartTime,
      x1: thirdBlockStartTime,
      y0: 0,
      y1: 1,
      yref: 'paper',
      line: {
        color: 'teal',
        width: 2,
        dash: 'dash',
      },
    });

  }

  const modelTraces = Array.from({ length: 24 }, (_, i) => ({
    x: mockData.map(entry => entry.start_time),
    y: mockData.map(entry => entry[`model${i + 1}`]),
    type: 'scatter',
    mode: 'lines+points',
    marker: { color: '' },
    yaxis: 'y1',
    name: `Model${i + 1}`,
  })).filter(trace => trace.y.some(value => value !== null && value !== undefined));

  const graphData = [
    {
      x: mockData.map(entry => entry.start_time),
      y: mockData.map(entry => entry.forecast),
      type: 'scatter',
      mode: 'lines+points',
      marker: { color: 'orange' },
      yaxis: 'y1',
      name: 'Forecast',
    },
    ...modelTraces,
    {
      x: mockData.map(entry => entry.start_time),
      y: mockData.map(entry => entry.dam),
      type: 'scatter',
      mode: 'lines+points',
      marker: { color: 'blue' },
      yaxis: 'y1',
      name: 'DAM',
    },
    {
      x: mockData.map(entry => entry.start_time),
      y: mockData.map(entry => entry.rtm),
      type: 'scatter',
      mode: 'lines+points',
      marker: { color: 'red' },
      yaxis: 'y1',
      name: 'RTM',
    },
  ];

  this.rtmForeCastGraphData.rtmForeCastData = graphData;
}
getGdamModelwiseForecast(view_type){
  this.getDataLoading = true;
    var FromDate = this.datepipe.transform(this.gdamDateRange.value['CurrentDate'], "dd-MMM-yyyy")?.toString();
    var ToDate = this.datepipe.transform(this.gdamDateRange.value['StartDate'], "dd-MMM-yyyy")?.toString();
 
    this.commonService.getGdamForecastModelwise({
      params: {
        start_date: FromDate,
        end_date: ToDate,
        view_type: view_type
      },
    }).subscribe((res) => {
      if (res && res.data && res.data.data) {
        if (view_type === 'graph_and_metrics') {
          this.metricsData = res.data.data.metrics_data;
          if (this.metricsData.length > 0) {
            this.gdamColumns = Object.keys(this.metricsData[0]).slice(4,);
          }
          this.gdamGraphData = res.data.data.graph_data;
          this.gdamMetricsData = res.data.data.metrics_data;
        } else if (view_type === 'graph') {
          this.graphData = res.data.data.graph_data;
        } else if (view_type === 'metrics') {
          this.gdamMetricsData = res.data.data.metrics_data;
          if (this.metricsData.length > 0) {
            this.gdamColumns = Object.keys(this.metricsData[0]).slice(4,);
          }
          this.gdamMetricsData = res.data.data.metrics_data;
        }
 
        this.getDataLoading = false;
        this.getGdamGraphData();
 
      } else {
        if (view_type === 'graph_and_metrics') {
          this.gdamForeCastGraphData.gdamForeCastData = []
          this.gdamGraphData = [];
          this.gdamMetricsData = [];
          this.gdamColumns=[] ; 
      } else if (view_type === 'graph') {
          this.gdamGraphData = [];
        } else if (view_type === 'metrics') {
          this.gdamGraphData = [];
          this.gdamMetricsData = [];
          this.gdamColumns=[];
        }
        this.getDataLoading = false;
        const errorMessage = `There is no  GDAM data available for the date range ${FromDate} to ${ToDate}.`;
        this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
      }
    }, (err: any) => {
      if (view_type === 'graph_and_metrics') {
        this.modelwiseGraphData.modelwiseData = [];
        this.metricsData = [];
        this.gdamColumns = [];
        this.graphMetricsMetricData = [];
      } else if (view_type === 'graph') {
        this.graphData = [];
      } else if (view_type === 'metrics') {
        this.graphMetricsMetricData = [];
        this.metricsData = [];
        this.gdamColumns = [];
      }
      this.getDataLoading = false;
      const errorMessage = `There is no GDAM data available for the date range ${FromDate} to ${ToDate}.`;
      this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
    });
}
  getDayColor(day: string): string {
    return this.dayColors[day] || this.dayColors['default'];
  }
  getColor(metric: any, model: any) {
    if (metric === 'RMSE') {
      if (model > 1600) {
        return 'red'
      }
      else {
        return 'green'
      }
    }
    else if (metric === 'RMSEP') {
      if (model > 25) {
        return 'red'
      }
      else {
        return 'green'
      }
    }
    else if (metric === 'MAE') {
      if (model > 1200) {
        return 'red'
      }
      else {
        return 'green'
      }
    }
    else if (metric === 'MAPE') {
      if (model > 18) {
        return 'red'
      }
      else {
        return 'green'
      }
    }
    else if (metric === 'MBE') {
      if (model > 600 || model < -600) {
        return 'red'
      }
      else if (model <= 600 && model >= -600) {
        return 'green'
      }
    }
  }
}
