import { Component } from '@angular/core';
import { CommonService } from '../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-admin-forecast-vs-actual',
  templateUrl: './admin-forecast-vs-actual.component.html',
  styleUrls: ['./admin-forecast-vs-actual.component.scss']
})
export class AdminForecastVsActualComponent {
  getDataLoading: boolean = false;
  graphMetricsData: any;
  selectedOption: any;
  graphMetricsGraphData: any;
  damGraphMetricsData: any;
  rtmGraphMetricsData: any;
  rtmData: any[] = [];
  damData: any[] = [];
  mergedGraphMetricsData: any[] = [];
  dateRange: FormGroup;
  maxDate: Date;
  graphData: any;
  gdamGraph: any;
  metricsData: any;
  rtmGraphShow: boolean = false;
  getRtmForeCastData: any;
  approvedForecast: any;
  currentForecast: any;
  tentativeForecast: any;
  actualForeCast: any;
  selectedMetric: any;
  latestRtmMetrics: any[] = [];
  dailyRtmMetrics: any[] = [];
  gdamGraphMetricsData: any;
  gdamData: any[] = [];
  gdamGraphData: any;
  gdamMetricGraphData: any;
  rowSpan: number = 0;
  selectRange: any;
  dateChange: boolean = false;


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
  public foreCastGraphData = {
    foreCastData: [] as { y: any[]; type: string; marker: { color: string }, mode: string; yaxis: string; name: string }[],
    layout: {
      title: {
        text: 'India Forecast Vs Actual',
        font: {
          size: 15,
        },
      },
      xaxis: {
        rangeslider: { type: 'date' },
        hoverformat: '%d %b %Y %H:%M',

      },
      yaxis: { title: 'Price (INR/MWH)', showgrid: false },
      legend: { orientation: 'h', x: 0.2, y: -0.5 },
      hovermode: 'x unified',
      height: 550,
      shapes: [],
    },
    config: { responsive: true }
  };

  graphMetricsOptions: any = [{ name: 'Graph And Metrics', value: 'graph_and_metrics' }, { name: 'Graph', value: 'graph' }, { name: 'Metrics', value: 'metrics' }];
  metricsOptions: any = [{ name: 'DAM', value: 'DAM' }, { name: 'GDAM', value: 'GDAM' }, { name: 'RTM', value: 'RTM' }, { name: 'All', value: 'All' }];
  dateRanges: any = [{ name: 'Today', value: 'today' }, { name: 'Tomorrow', value: 'tomorrow' }, { name: 'Yesterday', value: 'yesterday' }, { name: 'Lastweek', value: 'last_8_days' }, { name: 'Lastmonth', value: 'last_31_days' }, { name: 'Custom Range', value: 'customRange' }]



  constructor(
    private commonService: CommonService,
    public datepipe: DatePipe,
    private fb: FormBuilder, private messageService: MessageService,
  ) {
    this.selectedOption = this.graphMetricsOptions[0]
    this.selectedMetric = this.metricsOptions[0];
    this.selectRange = this.dateRanges[0];
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 1);
    this.dateRange = this.fb.group({
      FromDate: [''],
      ToDate: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.dateRange.patchValue({
      FromDate: new Date(),
      ToDate: new Date(),
    });
    this.getForecastVsActualData(this.selectedOption.value, this.selectRange.value);
    //this.getRtmForeCastVsActualData(this.selectedOption.value);
    // this.getLatestMetricsData();
    //this.getDailyMetricsData(this.selectedOption.value);
    //this.getForecastVsActualGdamData(this.selectedOption.value)
  }



  onPriceVolumeOptionChange() {
    if (this.selectRange.value !== 'customRange') {
      this.onMetricOptionChange();
    }
    else if (this.selectRange.value === 'customRange' && this.dateChange) {
      this.onMetricOptionChange();

    }
  }

  onDateRangeChange() {
    this.dateChange = true
    if (this.dateRange.valid) {
      this.onMetricOptionChange();
    }
    this.rowSpan = 0;
  }

  getForecastVsActualData(view_type, timeframe) {
    this.getDataLoading = true;
    var FromDate = this.datepipe.transform(this.dateRange.value['FromDate'], "dd-MMM-yyyy")?.toString();
    var ToDate = this.datepipe.transform(this.dateRange.value['ToDate'], "dd-MMM-yyyy")?.toString();
    let params: any = {}
    if (this.selectRange.value === 'customRange') {
      params = {
        start_date: FromDate,
        end_date: ToDate,
        view_type: view_type
      }
    }
    else {
      params = {
        timeframe: timeframe,
        view_type: view_type
      }
    }
    this.commonService.getForecastActualGraph({
      params
    }).subscribe((res) => {
      if (res.status_code === 200) {
        this.rowSpan += 1
        if (res.data && res.data.data) {
          if (view_type === 'graph_and_metrics') {
            this.graphMetricsGraphData = res.data.data.graph_data;
            this.damGraphMetricsData = res.data.data.metrics_data;
            this.damData = this.damGraphMetricsData.map((item) => {
              return { ...item, "category": "DAM FORECAST" };
            })
            this.mergeMetricsData();
          } else if (view_type === 'graph' ) {
            this.graphData = res.data.data.graph_data;
          } else if (view_type === 'metrics') {
            this.damGraphMetricsData = res.data.data.metrics_data;
            this.damData = this.damGraphMetricsData.map((item) => {
              return { ...item, "category": "DAM FORECAST" };
            })
            this.mergeMetricsData();
          }

        }
        this.getDataLoading = false;
        this.getGraphForeCastData()
      }
      else if (res.status_code === 503) {
        if (view_type === 'graph_and_metrics') {
          this.foreCastGraphData.foreCastData = [];
          this.graphMetricsGraphData = [];
          this.graphData = [];
          this.damData = [];
          this.mergeMetricsData();
        } else if (view_type === 'graph') {
          this.graphData = [];
        } else if (view_type === 'metrics') {
          this.damData = [];
          this.mergeMetricsData();
        }
        this.getDataLoading = false;
        const errorMessage = `There is no DAM data available for the date range ${FromDate} to ${ToDate}.`;
        this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
        this.getGraphForeCastData()
      }
    }, (err: any) => {
      this.getDataLoading = false;
      if (view_type === 'graph_and_metrics') {
        this.foreCastGraphData.foreCastData = [];
        this.graphMetricsGraphData = [];
        this.graphData = [];
        this.damData = [];
        this.mergeMetricsData();
      } else if (view_type === 'graph') {
        this.graphData = [];
      } else if (view_type === 'metrics') {
        this.damData = [];
        this.mergeMetricsData();
      }
      this.getDataLoading = false;
      const errorMessage = `There is no DAM data available for the date range ${FromDate} to ${ToDate}.`;
      this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
      this.getGraphForeCastData();
    });
  }
  getForecastVsActualGdamData(view_type, timeframe) {
    this.getDataLoading = true;
    var FromDate = this.datepipe.transform(this.dateRange.value['FromDate'], "dd-MMM-yyyy")?.toString();
    var ToDate = this.datepipe.transform(this.dateRange.value['ToDate'], "dd-MMM-yyyy")?.toString();
    let params: any = {}
    if (this.selectRange.value === 'customRange') {
      params = {
        start_date: FromDate,
        end_date: ToDate,
        view_type: view_type
      }
    }
    else {
      params = {
        timeframe: timeframe,
        view_type: view_type
      }
    }
    this.commonService.getGdamForecastGraph({
      params
    }).subscribe((res) => {
      if (res.status_code === 200) {
        this.rowSpan += 1
        if (res.data && res.data.data) {
          if (view_type === 'graph_and_metrics') {
            this.gdamMetricGraphData = res.data.data.graph_data;
            this.gdamGraphMetricsData = res.data.data.metrics_data;
            this.gdamData = this.gdamGraphMetricsData.map((item) => {
              return { ...item, "category": "GDAM FORECAST" };
            })
            this.mergeMetricsData();
          } else if (view_type === 'graph') {
            this.gdamGraphData = res.data.data.graph_data;
          } else if (view_type === 'metrics') {
            this.gdamGraphMetricsData = res.data.data.metrics_data;
            this.gdamData = this.gdamGraphMetricsData.map((item) => {
              return { ...item, "category": "GDAM FORECAST" };
            })
            this.mergeMetricsData();
          }

        }
        this.getDataLoading = false;
        this.getGraphForeCastData()
      }
      else if (res.status_code === 503) {
        if (view_type === 'graph_and_metrics') {
          this.foreCastGraphData.foreCastData = [];
          this.gdamMetricGraphData = [];
          this.graphMetricsGraphData = [];
          this.gdamGraphData = [];
          this.gdamData = [];
          this.mergeMetricsData();
        } else if (view_type === 'graph') {
          this.gdamGraphData = [];
        } else if (view_type === 'metrics') {
          this.gdamData = [];
          this.mergeMetricsData();
        }
        this.getDataLoading = false;
        const errorMessage = `There is no GDAM data available for the date range ${FromDate} to ${ToDate}.`;
        this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
        this.getGraphForeCastData()
      }
    }, (err: any) => {
      this.getDataLoading = false;
      if (view_type === 'graph_and_metrics') {
        this.foreCastGraphData.foreCastData = [];
        this.gdamMetricGraphData = [];
        this.gdamGraphData = [];
        this.gdamData = [];
        this.mergeMetricsData();
      } else if (view_type === 'graph') {
        this.gdamGraphData = [];
      } else if (view_type === 'metrics') {
        this.gdamData = [];
        this.mergeMetricsData();
      }
      this.getDataLoading = false;
      const errorMessage = `There is no GDAM data available for the date range ${FromDate} to ${ToDate}.`;
      this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
      this.getGraphForeCastData();
    });
  }
  getRtmForeCastVsActualData(view_type, timeframe) {
    this.getDataLoading = true;
    var FromDate = this.datepipe.transform(this.dateRange.value['FromDate'], "dd-MMM-yyyy")?.toString();
    var ToDate = this.datepipe.transform(this.dateRange.value['ToDate'], "dd-MMM-yyyy")?.toString();
    let params: any = {}
    if (this.selectRange.value === 'customRange') {
      params = {
        start_date: FromDate,
        end_date: ToDate,
        view_type: view_type
      }
    }
    else {
      params = {
        timeframe: timeframe,
        view_type: view_type
      }
    }
    this.commonService.getRtmForecastVsActual({
      params
    }).subscribe((res) => {
      if (res.status_code === 200) {
        this.rowSpan += 1
        if (res.data && res.data.data) {
          if (view_type === 'graph_and_metrics') {
            this.approvedForecast = res.data.data.graph_data.approved_forecast;
            this.currentForecast = res.data.data.graph_data.current_forecast;
            this.tentativeForecast = res.data.data.graph_data.tentative_forecast;
            this.actualForeCast = res.data.data.graph_data.actual
            this.rtmGraphMetricsData = res.data.data.rtm_metrics;
            this.rtmData = this.rtmGraphMetricsData;
            this.rtmData = this.rtmGraphMetricsData.map((item) => {
              return { ...item, "category": "RTM FORECAST" };
            })
            this.mergeMetricsData();
          } else if (view_type === 'graph') {
            this.approvedForecast = res.data.data.graph_data.approved_forecast;
            this.currentForecast = res.data.data.graph_data.current_forecast;
            this.tentativeForecast = res.data.data.graph_data.tentative_forecast;
            this.actualForeCast = res.data.data.graph_data.actual;

          } else if (view_type === 'metrics') {
            this.rtmGraphMetricsData = res.data.data.rtm_metrics;
            this.rtmData = this.rtmGraphMetricsData;
            this.rtmData = this.rtmGraphMetricsData.map((item) => {
              return { ...item, "category": "RTM FORECAST" };
            })
            this.mergeMetricsData();
          }
        }
        this.getDataLoading = false;
        this.getGraphForeCastData();
      }
      else if (res.status_code === 503) {
        if (view_type === 'graph_and_metrics') {
          this.foreCastGraphData.foreCastData = [];
          this.approvedForecast = [];
          this.currentForecast = [];
          this.tentativeForecast = [];
          this.actualForeCast = [];
          this.rtmData = [];
          this.mergeMetricsData();
        } else if (view_type === 'graph') {
          this.foreCastGraphData.foreCastData = [];
        } else if (view_type === 'metrics') {
          this.rtmData = [];
          this.mergeMetricsData();
        }
        const errorMessage = `There is no Actual RTM data available for the date range ${FromDate} to ${ToDate}.`;
        this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
        this.getDataLoading = false;
        this.getGraphForeCastData();
      }
      this.getDataLoading = false;
    }, (err: any) => {
      if (view_type === 'graph_and_metrics') {
        this.foreCastGraphData.foreCastData = [];
        this.approvedForecast = [];
        this.currentForecast = [];
        this.tentativeForecast = [];
        this.actualForeCast = [];
        this.rtmData = [];
        this.mergeMetricsData();
      } else if (view_type === 'graph') {
        this.foreCastGraphData.foreCastData = [];
      } else if (view_type === 'metrics') {
        this.rtmData = [];
        this.mergeMetricsData();
      }
      const errorMessage = `There is no Actual RTM data available for the date range ${FromDate} to ${ToDate}.`;
      this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
      this.getDataLoading = false;
      this.getGraphForeCastData();

    });
  }

  getDailyMetricsData(view_type, timeframe) {
    this.getDataLoading = true;
    var FromDate = this.datepipe.transform(this.dateRange.value['FromDate'], "dd-MMM-yyyy")?.toString();
    var ToDate = this.datepipe.transform(this.dateRange.value['ToDate'], "dd-MMM-yyyy")?.toString();
    let params: any = {}
    if (this.selectRange.value === 'customRange') {
      params = {
        start_date: FromDate,
        end_date: ToDate,
        view_type: view_type
      }
    }
    else {
      params = {
        timeframe: timeframe,
        view_type: view_type
      }
    }

    this.commonService.getDailyRtmMetrics({
      params
    }).subscribe((res) => {
      if (res.status_code === 200) {
        this.rowSpan += 1;
        if (res.data && res.data.data) {
          this.dailyRtmMetrics = res.data.data;
          this.dailyRtmMetrics = this.dailyRtmMetrics.map((item) => {
            return { ...item, "category": "RTM 96 FORECAST" };
          });
          this.mergeMetricsData();
        }
        this.getDataLoading = false;
      }
      else if (res.status_code === 503) {
        this.dailyRtmMetrics = [];
        this.getDataLoading = false;
        // const errorMessage = `There is no Daily RTM_96 data available for the date range ${FromDate} to ${ToDate}.`;
        // this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
      }
    }, (err: any) => {
      this.dailyRtmMetrics = [];
      this.getDataLoading = false;
      // const errorMessage = `There is no Daily RTM_96  data available for the date range ${FromDate} to ${ToDate}.`;
      // this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
    });
  }

  mergeMetricsData() {
    this.mergedGraphMetricsData = [...this.damData, ...this.gdamData, ...this.rtmData, ...this.dailyRtmMetrics];
    this.mergedGraphMetricsData.forEach(item => {
      item.sortDate = new Date(item.DATE || item.Date).getTime();
    });

    this.mergedGraphMetricsData.sort((a, b) => b.sortDate - a.sortDate);
  }


  getGraphForeCastData() {
    let graphData;
    let gdamGraph;
    const damMockData: any[] = [];
    const gdamMockData: any[] = [];
    const rtmMockData: any[] = [];

    if (this.selectedOption.value === 'graph_and_metrics') {
      graphData = this.graphMetricsGraphData;
    } else if (this.selectedOption.value === 'graph') {
      graphData = this.graphData;
    }
    if (this.selectedOption.value === 'graph_and_metrics') {
      gdamGraph = this.gdamMetricGraphData;
    } else if (this.selectedOption.value === 'graph') {
      gdamGraph = this.gdamGraphData;
    }

    if (graphData) {
      graphData.forEach(entry => {
        damMockData.push({
          key: this.selectedOption.value,
          start_time: entry.START_TIME,
          actual: entry.ACTUAL,
          forecast: entry.FORECAST,
        });
      });
    }
    if (gdamGraph) {
      gdamGraph.forEach(entry => {
        gdamMockData.push({
          key: this.selectedOption.value,
          start_time: entry.START_TIME,
          actual: entry.ACTUAL,
          forecast: entry.FORECAST,
        });
      });
    }

    if ((this.selectedOption.value === 'graph_and_metrics' || this.selectedOption.value === 'graph') && (this.approvedForecast || this.currentForecast || this.tentativeForecast || this.actualForeCast)) {
      const name = this.selectedOption.value === 'graph_and_metrics' ? 'graph_and_metrics' : 'graph';

      this.approvedForecast?.forEach(entry => rtmMockData.push({ key: name, start_time: entry.START_TIME, approved: entry.FORECAST }));
      this.currentForecast?.forEach(entry => rtmMockData.push({ key: name, start_time: entry.START_TIME, current: entry.FORECAST }));
      this.tentativeForecast?.forEach(entry => rtmMockData.push({ key: name, start_time: entry.START_TIME, tentative: entry.FORECAST }));
      this.actualForeCast?.forEach(entry => rtmMockData.push({ key: name, start_time: entry.START_TIME, rtmActual: entry.RTM }));
    }

    this.foreCastGraphData.layout.shapes = [];
    if (this.currentForecast && this.currentForecast.length >= 3) {
      const lastApprovedForeCast = this.currentForecast[0].START_TIME;
      const thirdBlockStartTime = this.currentForecast[2].START_TIME;

      this.foreCastGraphData.layout.shapes.push({
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

      this.foreCastGraphData.layout.shapes.push({
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
    }

    this.foreCastGraphData.foreCastData = [
      {
        x: damMockData.map(entry => entry.start_time),
        y: damMockData.map(entry => entry.actual),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'blue' },
        yaxis: 'y1',
        name: damMockData.some(entry => entry.actual) ? 'DAM ACTUAL' : undefined,
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      {
        x: damMockData.map(entry => entry.start_time),
        y: damMockData.map(entry => entry.forecast),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'cyan' },
        yaxis: 'y1',
        name: damMockData.some(entry => entry.forecast) ? 'DAM FORECAST' : undefined,
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      {
        x: gdamMockData.map(entry => entry.start_time),
        y: gdamMockData.map(entry => entry.actual),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'green' },
        yaxis: 'y1',
        name: gdamMockData.some(entry => entry.actual) ? 'GDAM ACTUAL' : undefined,
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      {
        x: gdamMockData.map(entry => entry.start_time),
        y: gdamMockData.map(entry => entry.forecast),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: '#32CD32' },
        yaxis: 'y1',
        name: gdamMockData.some(entry => entry.forecast) ? 'GDAM FORECAST' : undefined,
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      {
        x: rtmMockData.map(entry => entry.start_time),
        y: rtmMockData.map(entry => entry.approved),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'yellow' },
        yaxis: 'y1',
        name: rtmMockData.some(entry => entry.approved) ? 'RTM FORECAST' : undefined,
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      {
        x: rtmMockData.map(entry => entry.start_time),
        y: rtmMockData.map(entry => entry.current),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: '#0FFF50' },
        line: { type: 'arrowed' },
        yaxis: 'y1',
        name: rtmMockData.some(entry => entry.current) ? 'RTM CURRENT' : undefined,
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      {
        x: rtmMockData.map(entry => entry.start_time),
        y: rtmMockData.map(entry => entry.tentative),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'orange' },
        line: { dash: 'dot' },
        yaxis: 'y1',
        name: rtmMockData.some(entry => entry.tentative) ? 'RTM TENTATIVE' : undefined,
      } as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      {
        x: rtmMockData.map(entry => entry.start_time),
        y: rtmMockData.map(entry => entry.rtmActual),
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'red' },
        yaxis: 'y1',
        name: rtmMockData.some(entry => entry.rtmActual) ? 'RTM ACTUAL' : undefined,
      },
    ].filter(trace => trace.name !== undefined);
  }



  getDayColor(day: string) {
    return this.dayColors[day] || this.dayColors['default'];
  }

  onMetricOptionChange() {
    this.rowSpan = 0
    if (this.selectedMetric.value === 'All') {
      this.getForecastVsActualData(this.selectedOption.value, this.selectRange.value);
      this.getRtmForeCastVsActualData(this.selectedOption.value, this.selectRange.value);
      this.getDailyMetricsData(this.selectedOption.value, this.selectRange.value);
      this.getForecastVsActualGdamData(this.selectedOption.value, this.selectRange.value);
    }
    else if (this.selectedMetric.value === 'DAM') {
      this.getForecastVsActualData(this.selectedOption.value, this.selectRange.value);
      this.foreCastGraphData.foreCastData = [];
      this.approvedForecast = [];
      this.currentForecast = [];
      this.tentativeForecast = [];
      this.actualForeCast = [];
      this.rtmData = [];
      this.graphMetricsGraphData = [];
      this.damData = [];
      this.gdamData = [];
      this.gdamGraphData = [];
      this.gdamMetricGraphData = [];
      this.dailyRtmMetrics = [];

    }
    else if (this.selectedMetric.value === 'GDAM') {
      this.getForecastVsActualGdamData(this.selectedOption.value, this.selectRange.value);
      this.foreCastGraphData.foreCastData = [];
      this.approvedForecast = [];
      this.currentForecast = [];
      this.tentativeForecast = [];
      this.actualForeCast = [];
      this.rtmData = [];
      this.graphMetricsGraphData = [];
      this.damData = [];
      this.gdamData = [];
      this.graphData = [];
      this.dailyRtmMetrics = [];
    }
    else if (this.selectedMetric.value === 'RTM') {
      this.getRtmForeCastVsActualData(this.selectedOption.value, this.selectRange.value);
      this.getDailyMetricsData(this.selectedOption.value, this.selectRange.value);
      this.foreCastGraphData.foreCastData = [];
      this.graphMetricsGraphData = [];
      this.gdamMetricGraphData = [];
      this.graphData = [];
      this.gdamGraphData = [];
      this.damData = [];
      this.gdamData = [];
    }
  }

}
