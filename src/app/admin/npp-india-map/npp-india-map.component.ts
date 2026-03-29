import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_map from 'highcharts/modules/map';
HC_map(Highcharts);
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';

interface CustomPoint extends Highcharts.Point {
  custom?: {
    direction: number;
    blinkInterval:any
  };
}

@Component({
  selector: 'app-npp-india-map',
  templateUrl: './npp-india-map.component.html',
  styleUrls: ['./npp-india-map.component.scss']
})
export class NppIndiaMapComponent implements OnInit {
  visible: boolean = false;
  geoJsonResponse: any;
  geoStateNames: any[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  selectedLabel: Highcharts.SVGElement | null = null;
  nppGraphData: any[] = [];
  sourceLatitude: number;
  sourceLongitude: number;
  sinkLatitude: number;
  sinkLongitude: number;
  schedule: any;
  defaultColor: string = '#E0E0E0';
  stateName: any;
  timer: any;
  isPlaying: boolean = false;
  currentIndex: number = 0;
  maxIndex: number = 0;
  dateRange: FormGroup;
  selectRange:any;
  textElements: Highcharts.SVGElement[] = [];
  animationFrameId: number | null = null;
  sliderValue:any;
  windDirectionsSeries:any
  nextTimestamp:any;


  stateNameMapping: { [key: string]: string } = {
    // Northern Region
    "Jammu & Kashmir": "Northern Region",
    "Himachal Pradesh": "Northern Region",
    "Punjab": "Northern Region",
    "Chandigarh": "Northern Region",
    "Uttarakhand": "Northern Region",
    "Haryana": "Northern Region",
    "Delhi": "Northern Region",
    "Rajasthan": "Northern Region",
    "Uttar Pradesh": "Northern Region",

    // Western Region
    "Maharashtra": "Western Region",
    "Gujarat": "Western Region",
    "Goa": "Western Region",
    "Madhya Pradesh": "Western Region",
    "Chhattisgarh": "Western Region",
    "Dadra & Nagar Haveli": "Western Region",
    "Daman & Diu": "Western Region",

    // Southern Region
    "Andhra Pradesh": "Southern Region",
    "Karnataka": "Southern Region",
    "Kerala": "Southern Region",
    "Tamil Nadu": "Southern Region",
    "Telangana": "Southern Region",
    "Puducherry": "Southern Region",
    "Lakshadweep": "Southern Region",

    // Eastern Region
    "Bihar": "Eastern Region",
    "Jharkhand": "Eastern Region",
    "Odisha": "Eastern Region",
    "West Bengal": "Eastern Region",
    "Andaman & Nicobar Island": "Eastern Region",

    // North Eastern Region
    "Arunanchal Pradesh": "North Eastern Region",
    "Assam": "North Eastern Region",
    "Manipur": "North Eastern Region",
    "Meghalaya": "North Eastern Region",
    "Mizoram": "North Eastern Region",
    "Nagaland": "North Eastern Region",
    "Sikkim": "North Eastern Region",
    "Tripura": "North Eastern Region",
  };

  regionColors: { [key: string]: string } = {
    "Western Region": '#FFF2E6',   
    "Northern Region": '#E6FFF2',  
    "Southern Region": '#F2E6FF',  
    "Eastern Region": '#FFE6F2',   
    "North Eastern Region": '#E6F2FF'
  };
  irnsSelection: any = [{ name: 'Today', value: 'today' }, { name: 'Tomorrow', value: 'tomorrow' }, { name: 'Yesterday', value: 'yesterday' }, { name: 'Lastweek', value: 'last_8_days' }, { name: 'Lastmonth', value: 'last_31_days' }]


  constructor(private http: HttpClient, public datepipe: DatePipe,
    private commonService: CommonService,
    private fb: FormBuilder) {
    this.selectRange = this.irnsSelection[0];
    this.dateRange = this.fb.group({
      FromDate: [''],
      ToDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.dateRange.patchValue({
      FromDate: new Date(),
      ToDate: new Date(),
    });
    this.http.get('assets/india/india-map.json').subscribe((geoJsonData: any) => {
      this.geoJsonResponse = geoJsonData;
      const features = this.geoJsonResponse.features;
      this.geoStateNames = features.map((feature: any) => feature.properties.st_nm);
      this.loadNppData(this.selectRange.value);
    });
  }

  loadNppData(timeframe): void {
    // var FromDate = this.datepipe.transform(this.dateRange.value['FromDate'], "dd-MMM-yyyy")?.toString();
    // var ToDate = this.datepipe.transform(this.dateRange.value['ToDate'], "dd-MMM-yyyy")?.toString();
    // this.commonService.getIrnsIndiaMapData({
    //   params: {
    //     start_date: FromDate,
    //     end_date: ToDate,
    //   },
    // }).subscribe((res) => {
      this.http.get('assets/india/npp-map.json').subscribe((geoJsonData: any) => {
      this.nppGraphData = geoJsonData;
      if (Array.isArray(this.nppGraphData)) {
      this.nppGraphData.forEach((item) => {
        if (this.stateNameMapping[item.SOURCE]) {
          item.SOURCE = this.stateNameMapping[item.SOURCE];
        }
        if (this.stateNameMapping[item.SINK]) {
          item.SINK = this.stateNameMapping[item.SINK];
        }
        this.sourceLatitude = item.SOURCE_LATITUDE;
        this.sourceLongitude = item.SOURCE_LONGITUDE;
        this.sinkLatitude = item.SINK_LATITUDE;
        this.sinkLongitude = item.SINK_LONGITUDE;
        this.schedule = item.SCHEDULE;
      });
    }
      this.maxIndex = this.nppGraphData.length;
      this.renderMap();
    });
  }
  irnsDateRangeChange(){
   this.loadNppData(this.selectRange.value)
  }
  onDateRangeChange(){
    if (this.dateRange.valid) {
      this.loadNppData(this.selectRange.value);
    }
  }

  renderMap(): void {
    const self = this;
    if (Array.isArray(this.nppGraphData)) {
        const mapData = this.geoJsonResponse.features.map((feature: any) => {
            this.stateName = feature.properties.st_nm;
            const region = this.stateNameMapping[this.stateName];
            const color = region ? this.regionColors[region] : this.defaultColor;
            return {
                'hc-key': this.stateName,
                name: this.stateName,
                color: color
            };
        });

        const sinkData = this.nppGraphData.map((item: any) => ({
            lat: item.SINK_LATITUDE,
            lon: item.SINK_LONGITUDE,
            START_TIME: item.START_TIME,
            SCHEDULE: item.SCHEDULE,
        }));

        const sourceData = this.nppGraphData.map((item: any) => ({
            lat: item.SOURCE_LATITUDE,
            lon: item.SOURCE_LONGITUDE,
            START_TIME: item.START_TIME,
            SCHEDULE: item.SCHEDULE,
        }));
        const lineData = this.nppGraphData
        .filter((item: any) => item.SCHEDULE > 0) 
        .map((item: any) => ({
            geometry: {
                type: 'LineString',
                coordinates: [
                    [item.SOURCE_LONGITUDE, item.SOURCE_LATITUDE],
                    [item.SINK_LONGITUDE, item.SINK_LATITUDE]
                ]
            },
            color: '#BD00FF',
           dashStyle: 'Dash'
        }));
      

        // Define the animation keyframes
        const keyframes = `
            @keyframes dash-animation {
                from {
                    stroke-dashoffset: 100;
                }
                to {
                    stroke-dashoffset: 20;
                }
            }
        `;

        const style = document.createElement('style');
        style.innerHTML = keyframes;
        document.getElementsByTagName('head')[0].appendChild(style);

        const options: Highcharts.Options = {
            chart: {
                map: this.geoJsonResponse,
                renderTo: 'container',
                borderWidth: 0,
                events: {
                    load() {
                        const chart = this as Highcharts.Chart;
                        const resize = () => {
                            chart.setSize(null, null);
                        };
                        window.addEventListener('resize', resize);

                        // Apply animation to the line
                        chart.series.forEach(series => {
                            if (series.type === 'mapline') {
                            //   console.log(series.points,"graph")
                            //     const linePath = series.graph.element;
                            //     linePath.style.strokeDasharray = '5,5';
                            //     linePath.style.animation = 'dash-animation 2s linear infinite';
                            // }
                              series.points.forEach(point => {
                                const linePath = point.graphic?.element;
                                if (linePath) {
                                    linePath.style.strokeDasharray = '0.5,1';
                                    linePath.style.animation = 'dash-animation 60s linear infinite';
                                }
                            })
                          }
                        });
                    }
                }
            },
            title: {
                text: ''
            },
            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    alignTo: "spacingBox"
                }
            },
            plotOptions: {
                map: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return this.point['hc-key'];
                        },
                        style: {
                            fontSize: '10px',
                            color: '#333333',
                        }
                    }
                },
                series: {
                    states: {
                        inactive: {
                            enabled: false
                        }
                    }
                }
            },
            tooltip: {
                enabled: true,
                formatter() {
                    const point = this.point as any;
                    return `
                        ${point.SOURCE ? `Source: ${point.SOURCE}<br>` : ''}
                        ${point.SINK ? `Sink: ${point.SINK}<br>` : ''}
                        ${point.SCHEDULE ? `Schedule: ${point.SCHEDULE}<br>` : ''}
                        ${point.START_TIME ? `Start Time: ${point.START_TIME}<br>` : ''}
                    `;
                }
            },
            series: [
                {
                    type: 'map',
                    name: 'State',
                    data: mapData,
                    joinBy: ['st_nm', 'hc-key'],
                    borderWidth: 0.1,
                    borderColor: 'black'
                },
                {
                    type: 'mappoint',
                    name: 'Source',
                    data: sourceData,
                    color: 'red'
                },
                {
                    type: 'mappoint',
                    name: 'Sink',
                    data: sinkData,
                    color: 'blue'
                },
                {
                    type: 'mapline',
                    name:'wind',
                    data:lineData,
                    lineWidth: 3,
                    color: '#666', 
                }
            ],
            credits: {
                enabled: false
            }
        };

        Highcharts.mapChart('container', options);
    }
}

//   startAnimation(): void {
//     if (!this.isPlaying) {
//         this.isPlaying = true;
//         this.timer = setInterval(() => {
//           this.updatePoints();
//         }, 3000);
//        // this.updatePoints();
//         // Start the animation immediately
//     }
// }



updatePoints(): void {
  const chart = Highcharts.charts[0];
  if (!chart) return;
  const groupedData = this.groupDataBySourceAndTime(this.nppGraphData);
  const groupedDataKeys = Object.keys(groupedData).sort(); 
  if (this.currentIndex < 0 || this.currentIndex >= groupedDataKeys.length) {
    console.log('Invalid index');
    return;
  }

  const currentTimestamp = groupedDataKeys[this.currentIndex];
  console.log(currentTimestamp, "currentTimestamp");
  const timestampData = groupedData[currentTimestamp];

  console.log(timestampData,"tsd")
  if (!timestampData) {
    console.log('No data for this timestamp');
    return; 
  }
  Object.keys(timestampData).forEach(source => {
    const sourceData = timestampData[source];
    sourceData.forEach((currentData) => {
      const isFlowingSourceToSink = currentData.direction === 'source-to-sink';
      const sourcePoint: Highcharts.PointOptionsObject = {
        x: currentData.SOURCE_LONGITUDE,
        y: currentData.SOURCE_LATITUDE,
        name: currentData.SOURCE,
      };

      const sinkPoint: Highcharts.PointOptionsObject = {
        x: currentData.SINK_LONGITUDE,
        y: currentData.SINK_LATITUDE,
        name: currentData.SINK,
      };

      const sourceSeries = chart.series.find(series => series.name === 'Source');
      const sinkSeries = chart.series.find(series => series.name === 'Sink');
      this.windDirectionsSeries = chart.series.find(series => series.name === 'wind');

      if (sourceSeries) {
        sourceSeries.setData([sourcePoint], true);
      }

      if (sinkSeries) {
        sinkSeries.setData([sinkPoint], true);
      }

      if (this.windDirectionsSeries) {
        const startPoint = isFlowingSourceToSink ? sourcePoint : sinkPoint;
        const endPoint = isFlowingSourceToSink ? sinkPoint : sourcePoint;

        const animateArrow = (start: any, end: any, duration: number) => {
          const startTime = performance.now();

          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentX = start.x + (end.x - start.x) * progress;
            const currentY = start.y + (end.y - start.y) * progress;

            this.windDirectionsSeries.setData([{
              x: currentX,
              y: currentY,
              name: currentData.SCHEDULE,
              custom: {
                direction: isFlowingSourceToSink ? 45 : 225
              }
            }], true);

            if (progress < 1 && this.isPlaying) {
              this.animationFrameId = requestAnimationFrame(step);
            } else {
              this.currentIndex++;
              if (this.currentIndex >= groupedDataKeys.length) {
                this.currentIndex = 0;
                this.stopAnimation();
              } else if (this.isPlaying) {
                this.updateSliderAndPoints();
              }
            }
          };

          this.animationFrameId = requestAnimationFrame(step);
        };

        animateArrow(startPoint, endPoint, 1000);
      }

      // Clean up any previous text elements
      this.textElements.forEach(element => element.destroy());
      this.textElements = [];
    });
  });
}

updateSliderAndPoints(): void {
  const groupedDataKeys = Object.keys(this.groupDataBySourceAndTime(this.nppGraphData)).sort();
  if (this.currentIndex >= groupedDataKeys.length) {
    this.currentIndex = 0; 
  }
   this.nextTimestamp = groupedDataKeys[this.currentIndex];
  this.setCurrentTimestampFromIndex(this.nextTimestamp); 
  this.updatePoints(); 
  this.currentIndex++;
}

setCurrentTimestampFromIndex(index: number): void {
  const groupedDataKeys = Object.keys(this.groupDataBySourceAndTime(this.nppGraphData)).sort();
  if (index >= 0 && index < groupedDataKeys.length) {
    const nextTimestamp = groupedDataKeys[index];
    this.sliderValue = nextTimestamp; 
    this.updateSliderDisplay(nextTimestamp); 
  }
}

updateSliderDisplay(nextTimestamp: string): void {
  const sliderElement = document.getElementById('slider') as HTMLInputElement;
  if (sliderElement) {
    const sliderPosition = this.convertTimestampToSliderPosition(nextTimestamp);
    sliderElement.value = sliderPosition.toString();
  }
}

getCurrentTimestampFromSlider(): string {
  return this.nppGraphData[this.currentIndex].START_TIME;
}

startAnimation(): void {
  if (!this.isPlaying) {
    this.isPlaying = true;
    this.updateSliderAndPoints(); 
    this.timer = setInterval(() => {
      this.updateSliderAndPoints();
    }, 100);
  }
}

stopAnimation(): void {
  this.isPlaying = false;
  if (this.timer) {
    clearInterval(this.timer);
  }
  if (this.animationFrameId) {
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }
}

groupDataBySourceAndTime(data: any[]): { [key: string]: { [source: string]: any[] } } {
  return data.reduce((acc, item) => {
    const source = item.SOURCE;
    const timestamp = item.START_TIME;

    if (!acc[timestamp]) {
      acc[timestamp] = {};
    }
    if (!acc[timestamp][source]) {
      acc[timestamp][source] = [];
    }

    acc[timestamp][source].push(item);
    return acc;
  }, {} as { [key: string]: { [source: string]: any[] } });
}

convertTimestampToSliderPosition(timestamp: string): number {
  const groupedDataKeys = Object.keys(this.groupDataBySourceAndTime(this.nppGraphData)).sort();
  return groupedDataKeys.findIndex(key => key === timestamp);
}


  showDialog(): void {
    this.visible = true;
  }

  onSliderChange(event: any): void {
    this.currentIndex = event.target.value;
    this.updatePoints();
  }
}