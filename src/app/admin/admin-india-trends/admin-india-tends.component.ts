import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import * as Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-admin-india-tends',
  templateUrl: './admin-india-tends.component.html',
  styleUrls: ['./admin-india-tends.component.scss']
})
export class AdminIndiaTendsComponent implements OnInit {
  getDataLoading: boolean = false;
  indiaGraphData: any;
  dateRange: FormGroup;
  igxDateRange :FormGroup;
  maxDate: Date;
  plotData: any[];
  plotLayout: any;
  geoJsonResponse: any;
  geoStateNames: any;
  lats: number[] = [];
  lons: number[] = [];
  capacityLats: number[] = [];
  capacityLons: number[] = [];
  generatorsLats: number[] = [];
  generatorLons: number[] = [];
  normalizedDemands: number[] = [];
  startTime: any[] = [];
  igxStartTime :any[] = [];
  stateName: any[] = [];
  demandContribution: number[] = [];
  normalizedDemand: any;
  frames: any;
  ISTSDemand: any[] = [];
  firstBlockData: any;
  igxFirstBlockData : any;
  selectedTab: string = 'istsDemand';
  indiaIgxGraphData :any;
  igxPlotData : any[];
  installedCapacityData : any[];
  capacityLayout:any;
  igxLayout:any;
  igxFrames: any;
  config: any;
  pieChartData: any;
  states: any[] = [];
  installedCapacities: any[] = [];
  selectedState: any = "INDIA";
  gasValues: any;
  chartData: any;
  installedCapacityPlotData: any;
  chartLayout: any;
  isSecondGraphVisible: boolean = false;
  generatorsData : any;
  generatorsPlotData :any[]
  genProjectName : any[] = [];
  generatorLayout : any;
  fuelTypes : any[] = [];
  remainingCapacity:any;
  title:any;
  legendClicked:any={};
  blockSelection:any;
  filteredGeneratorsData:any;
  blockOptions: any  = [ { name: '>= 500', value: '> 500' }, { name: '>= 250', value: '> 250' }, { name: '>= 100', value: '> 100' } ,  { name: 'All', value: 'All' }];
  isIstsGraphVisible:boolean=false



  constructor(
    private commonService: CommonService,
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private messageService: MessageService,
    private http: HttpClient,
  ) {
    this.blockSelection = this.blockOptions[0]
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 1);
    this.dateRange = this.fb.group({
      FromDate: [''],
      ToDate: ['', Validators.required],
    });
    this.igxDateRange = this.fb.group({
      FromDate: [''],
      ToDate: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.dateRange.patchValue({
      FromDate: new Date(),
      ToDate: new Date(),
    });
    this.igxDateRange.patchValue({
      FromDate: new Date(),
      ToDate: new Date(),
    });
    this.http.get('assets/india/india-map.json').subscribe((geoJsonData: any) => {
      this.geoJsonResponse = geoJsonData
      const features = this.geoJsonResponse.features;
      this.geoStateNames = features.map(feature => feature.properties.st_nm)
      this.getIndiaMapData();
    })
    
  }
  onInstallCapacityChange(){
  this.getGeneratorsMapData()
  }
  onDateRangeChange() {
    if (this.dateRange.valid) {
      this.lats = []
      this.lons = []
      this.startTime = []
      this.stateName = []
      this.normalizedDemands = []
      this.demandContribution = []
      this.getIndiaMapData()
    }
  }
  igxDateRangeChange() {
    if (this.dateRange.valid) {
      this.lats = []
      this.lons = []
      this.igxStartTime = []
      this.stateName = []
      this.normalizedDemands = []
      this.demandContribution = []
      this.getIgxIndiaMapData()
    }
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
    if (this.selectedTab === 'gasPrice') {
      this.getIgxIndiaMapData();
      this.installedCapacityPlotData = []
      this.chartData = []
    } else if (this.selectedTab === 'installedCapacity') {
      this.getInstalledCapacity();
    } else if (this.selectedTab === 'generators') {
      this.getGeneratorsMap();
      this.installedCapacityPlotData = []
      this.gasValues = []

    }
  }
  getIndiaMapData() {
    this.getDataLoading = true;
    var FromDate = this.datepipe.transform(this.dateRange.value['FromDate'], "dd-MMM-yyyy")?.toString();
    var ToDate = this.datepipe.transform(this.dateRange.value['ToDate'], "dd-MMM-yyyy")?.toString();
    this.commonService.getIndiaMapGraph({
      params: {
        start_date: FromDate,
        end_date: ToDate,
      },
    }).subscribe((res) => {
      if (res.status_code === 200) {
        this.isIstsGraphVisible=true
        this.indiaGraphData = res.data.data;
        this.indiaGraphData.forEach((innerArray: any[]) => {
          innerArray.forEach((item: any) => {
            const LATITUDE = item.LATITUDE;
            const LONGITUDE = item.LONGITUDE;
            const STATE = item.STATE;
            const START_TIME = item.START_TIME;
            const NORMALIZED_DEMAND = item.NORMALIZED_DEMAND;
            const DEMAND_CONTRIBUTION = item.DEMAND_CONTRIBUTION;
            const ISTS_DEMAND = item["ISTS DEMAND"];
            // this.lats.push(LATITUDE);
            // this.lons.push(LONGITUDE);
            // this.stateName.push(STATE);
            this.startTime.push(START_TIME);
            // this.normalizedDemands.push(NORMALIZED_DEMAND);
            // this.demandContribution.push(DEMAND_CONTRIBUTION);
            // this.ISTSDemand.push(ISTS_DEMAND);
          });
        });
        const timeInterval = 15;
        const numTimeBlocks = 24 * 60 / timeInterval;
        this.firstBlockData = Array.from({ length: numTimeBlocks }, (_, index) => {
          const frameStartTime = new Date(this.startTime[0]);
          frameStartTime.setMinutes(frameStartTime.getMinutes() + index * timeInterval);
          const frameEndTime = new Date(frameStartTime.getTime() + timeInterval * 60000);
          const frameData = this.indiaGraphData.flatMap((innerArray: any[]) =>
            innerArray.filter((item: { START_TIME: string | number | Date; }) => {
              const itemTime = new Date(item.START_TIME);
              return itemTime >= frameStartTime && itemTime < frameEndTime;
            })
          );
          const frameDataForFirstBlock = frameData.length < 0 ? frameData : this.indiaGraphData[0] || [];
          this.plotData = [{
            type: 'scattermapbox',
            lat: frameDataForFirstBlock.map((item: any) => item.LATITUDE),
            lon: frameDataForFirstBlock.map((item: any) => item.LONGITUDE),
            hoverinfo: 'text',
            marker: {
              size: frameDataForFirstBlock.map((item: any) => item.DEMAND_CONTRIBUTION*4),
              cmin: 0,
              cmax: 100,
              color: frameDataForFirstBlock.map((item: any) => item.NORMALIZED_DEMAND),
              opacity: 0.5,
              colorscale: [
                [0.00, 'blue'],
                [0.25, 'blue'],
                [0.25, 'green'],
                [0.75, 'green'],
                [0.75, 'orange'],
                [0.90, 'orange'],
                [0.90, 'red'],
                [1.0, 'red'],
              ],
              // colorbar: {
              //   thickness: 25,
              //   ticklen: 3,
              //   tickvals: [0, 20, 40, 60, 80, 100],
              //   ticktext: ['0', '20', '40', '60', '80', '100']
              // },
            },
            text: frameDataForFirstBlock.map((item: any) => item.STATE),
            hovertext: frameDataForFirstBlock.map((item: any) => `State: ${item.STATE}<br>Start Time: ${item.START_TIME}<br>ISTS Demand: ${item["ISTS DEMAND"]} MW<br>All India Demand Contribution(%): ${item.DEMAND_CONTRIBUTION}<br>State Normalized Demand(%): ${item.NORMALIZED_DEMAND}`),
            mode: 'markers+text',
          }];
          return {
            name: index.toString(),
            data: this.plotData,
          };
        });
        // const timeInterval = 15;
        //const numTimeBlocks = 24 * 60 / timeInterval;
        const sliderSteps = Array.from({ length: numTimeBlocks }, (_, index) => {
          const stepTime = new Date(this.startTime[0]);
          stepTime.setHours(0, 0);
          stepTime.setMinutes(stepTime.getMinutes() + index * timeInterval);       
          const hours = stepTime.getHours().toString().padStart(2, '0');
          const minutes = stepTime.getMinutes().toString().padStart(2, '0');
          const time = `${hours}:${minutes}`;          
          return {
              label: time,
              method: 'animate',
              args: [[index], { mode: 'immediate', transition: { duration: 0 } }],
          };
      });
        this.plotLayout = {
          hovermode: 'closest',
          mapbox: {
            bearing: 0,
            center: { lat: 24, lon: 78 },
            pitch: 0,
            zoom: 3,
            style: 'white-bg',
            layers: [
              {
                source: this.geoJsonResponse,
                below: "traces",
                type: "line",
                color: "purple",
                line: { width: 0.5 },

              },

            ],
          },
          updatemenus: [{
            buttons: [
              {
                args: [null, { frame: { duration: 500, redraw: true }, mode: "immediate", fromcurrent: true }],
                label: 'Play',
                method: 'animate'
              },
              {
                args: [[null], {
                  mode: "immediate",
                  fromcurrent: false,
                  transition: { duration: 0 },
                  frame: { duration: 0, redraw: false }
                }],
                label: 'Pause',
                method: 'animate'
              }
            ],
            direction: 'left',
            pad: { 'r': 10, 't': 87 },
            showactive: false,
            type: 'buttons',
            x: 0.0,
            xanchor: 'right',
            y: 0.1,
            yanchor: 'top',
            bgcolor: '#FFFFFF',
            bordercolor: '#000000',
            borderwidth: 1,
            font: { size: 11 }
          }],
          sliders: [{
            active: 0,
            steps: sliderSteps
          }],
          height: 600
        }
        this.frames = Array.from({ length: numTimeBlocks }, (_, index) => {
          const frameStartTime = new Date(this.startTime[0]);
          frameStartTime.setMinutes(frameStartTime.getMinutes() + index * timeInterval);
          const frameEndTime = new Date(frameStartTime.getTime() + timeInterval * 60000);
          const frameData = this.indiaGraphData.flatMap((innerArray: any[]) =>
            innerArray.filter((item: { START_TIME: string | number | Date; }) => {
              const itemTime = new Date(item.START_TIME);
              return itemTime >= frameStartTime && itemTime < frameEndTime;
            })
          );
          const traceData = [{
            type: 'scattermapbox',
            lat: frameData.map((item: any) => item.LATITUDE),
            lon: frameData.map((item: any) => item.LONGITUDE),
            hoverinfo: 'text',
            marker: {
              size: frameData.map((item: any) => item.DEMAND_CONTRIBUTION*4),
              cmin: 0,
              cmax: 100,
              color: frameData.map((item: any) => item.NORMALIZED_DEMAND),
              opacity: 0.5,
              colorscale: [
                [0.00, 'blue'],
                [0.25, 'blue'],
                [0.25, 'green'],
                [0.75, 'green'],
                [0.75, 'orange'],
                [0.90, 'orange'],
                [0.90, 'red'],
                [1.0, 'red'],
              ],
              // colorbar: {
              //   thickness: 25,
              //   ticklen: 3,
              //   tickvals: [0, 20, 40, 60, 80, 100],
              //   ticktext: ['0', '20', '40', '60', '80', '100']
              // },
            },
            text: frameData.map((item: any) => item.STATE),
            hovertext: frameData.map((item: any) => `State: ${item.STATE}<br>Start Time: ${item.START_TIME}<br>ISTS Demand: ${item["ISTS DEMAND"]}<br>All India Demand Contribution(%): ${item.DEMAND_CONTRIBUTION}<br>State Normalized Demand(%): ${item.NORMALIZED_DEMAND}`),
            mode: 'markers+text',
          }];
          return {
            name: index.toString(),
            data: traceData,
          };
        });
        this.getDataLoading = false;

      }
      else {
        this.indiaGraphData = [];
        const errorMessage = `There is no data available for the date range ${FromDate} to ${ToDate}.`;
        this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
      }
      this.getDataLoading = false;
    }, (err: any) => {
      this.getDataLoading = false;
      this.indiaGraphData = [];
      const errorMessage = `There is no data available for the date range ${FromDate} to ${ToDate}.`;
      this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });

    });
    this.config = { responsive: true ,  displayModeBar: false,}
  }
  getIgxIndiaMapData() {
    this.getDataLoading = true;
    var FromDate = this.datepipe.transform(this.igxDateRange.value['FromDate'], "dd-MMM-yyyy")?.toString();
    var ToDate = this.datepipe.transform(this.igxDateRange.value['ToDate'], "dd-MMM-yyyy")?.toString();
    this.commonService.getIgxIndiaMap({
      params: {
        start_date: FromDate,
        end_date: ToDate,
      },
    }).subscribe((res) => {
      if (res.status_code === 200) {
        this.indiaIgxGraphData = res.data.data;
        this.indiaIgxGraphData.forEach((innerArray: any[]) => {
          innerArray.forEach((item: any) => {
            const START_TIME = item.START_TIME;
            this.igxStartTime.push(START_TIME);
          });
        });
        const timeInterval = 15;
        const numTimeBlocks = 24 * 60 / timeInterval;
        this.igxFirstBlockData = Array.from({ length: numTimeBlocks }, (_, index) => {
          const frameStartTime = new Date(this.igxStartTime[0]);
          frameStartTime.setMinutes(frameStartTime.getMinutes() + index * timeInterval);
          const frameEndTime = new Date(frameStartTime.getTime() + timeInterval * 60000);
          const frameData = this.indiaIgxGraphData.flatMap((innerArray: any[]) =>
            innerArray.filter((item: { START_TIME: string | number | Date; }) => {
              const itemTime = new Date(item.START_TIME);
              return itemTime >= frameStartTime && itemTime < frameEndTime;
            })
          );
          const frameDataForFirstBlock = frameData.length < 0 ? frameData : this.indiaIgxGraphData[0] || [];
          this.igxPlotData = [{
            type: 'scattermapbox',
            lat: frameDataForFirstBlock.map((item: any) => item.LATITUDE),
            lon: frameDataForFirstBlock.map((item: any) => item.LONGITUDE),
            hoverinfo: 'text',
            marker: {
              size: 25,
              cmin: 0,
              cmax: 100,
              color: frameDataForFirstBlock.map((item: any) => item.NORMALIZED_PRICE),
              opacity: 0.5,
              colorscale: [
                [0.00, 'blue'],
                [0.25, 'blue'],
                [0.25, 'green'],
                [0.75, 'green'],
                [0.75, 'orange'],
                [0.90, 'orange'],
                [0.90, 'red'],
                [1.0, 'red'],
              ],
              // colorbar: {
              //   thickness: 25,
              //   ticklen: 3,
              //   tickvals: [0, 20, 40, 60, 80, 100],
              //   ticktext: ['0', '20', '40', '60', '80', '100']
              // },
            },
            text: frameDataForFirstBlock.map((item: any) => item.IGX_NAME),
            hovertext: frameDataForFirstBlock.map((item: any) => `IGX NAME: ${item.IGX_NAME}<br>Start Time: ${item.START_TIME}<br>NORMALIZED PRICE: ${item.NORMALIZED_PRICE}<br>PRICE: ${item.PRICE}`),
            mode: 'markers+text',
          }];
          return {
            name: index.toString(),
            data: this.igxPlotData,
          };
        });
        const sliderSteps = Array.from({ length: numTimeBlocks }, (_, index) => {
          const stepTime = new Date(this.igxStartTime[0]);
          stepTime.setHours(0, 0, 0, 0);
          stepTime.setMinutes(stepTime.getMinutes() + index * timeInterval);
          var date = new Date(stepTime);
          const time = date.toTimeString().split(' ')[0];
          return {
            label: time,
            method: 'animate',
            args: [[index], { mode: 'immediate', transition: { duration: 0 } }],
          };
        });
        this.igxLayout = {
          hovermode: 'closest',
          mapbox: {
            bearing: 0,
            center: { lat: 24, lon: 78 },
            pitch: 0,
            zoom: 3,
            style: 'white-bg',
            layers: [
              {
                source: this.geoJsonResponse,
                below: "traces",
                type: "line",
                color: "purple",
                line: { width: 0.5 },

              },

            ],
          },
          updatemenus: [{
            buttons: [
              {
                args: [null, { frame: { duration: 500, redraw: true }, mode: "immediate", fromcurrent: true }],
                label: 'Play',
                method: 'animate'
              },
              {
                args: [[null], {
                  mode: "immediate",
                  fromcurrent: false,
                  transition: { duration: 0 },
                  frame: { duration: 0, redraw: false }
                }],
                label: 'Pause',
                method: 'animate'
              }
            ],
            direction: 'left',
            pad: { 'r': 10, 't': 87 },
            showactive: false,
            type: 'buttons',
            x: 0.0,
            xanchor: 'right',
            y: 0.1,
            yanchor: 'top',
            bgcolor: '#FFFFFF',
            bordercolor: '#000000',
            borderwidth: 1,
            font: { size: 11 }
          }],
          sliders: [{
            active: 0,
            steps: sliderSteps
          }],
          height: 600
        }
        this.igxFrames = Array.from({ length: numTimeBlocks }, (_, index) => {
          const frameStartTime = new Date(this.igxStartTime[0]);
          frameStartTime.setMinutes(frameStartTime.getMinutes() + index * timeInterval);
          const frameEndTime = new Date(frameStartTime.getTime() + timeInterval * 60000);
          const frameData = this.indiaIgxGraphData.flatMap((innerArray: any[]) =>
            innerArray.filter((item: { START_TIME: string | number | Date; }) => {
              const itemTime = new Date(item.START_TIME);
              return itemTime >= frameStartTime && itemTime < frameEndTime;
            })
          );
          const traceData = [{
            type: 'scattermapbox',
            lat: frameData.map((item: any) => item.LATITUDE),
            lon: frameData.map((item: any) => item.LONGITUDE),
            hoverinfo: 'text',
            marker: {
              size: frameData.map((item: any) => item.NORMALIZED_PRICE*1.5),
              cmin: 0,
              cmax: 100,
              color: frameData.map((item: any) => item.NORMALIZED_PRICE),
              opacity: 0.5,
              colorscale: [
                [0.00, 'blue'],
                [0.25, 'blue'],
                [0.25, 'green'],
                [0.75, 'green'],
                [0.75, 'orange'],
                [0.90, 'orange'],
                [0.90, 'red'],
                [1.0, 'red'],
              ],
              // colorbar: {
              //   thickness: 25,
              //   ticklen: 3,
              //   tickvals: [0, 20, 40, 60, 80, 100],
              //   ticktext: ['0', '20', '40', '60', '80', '100']
              // },
            },
            text: frameData.map((item: any) => item.IGX_NAME),
            hovertext: frameData.map((item: any) => `IGX NAME: ${item.IGX_NAME}<br>Start Time: ${item.START_TIME}<br>NORMALIZED PRICE: ${item.NORMALIZED_PRICE}<br>PRICE: ${item.PRICE}`),
            mode: 'markers+text',
          }];
          return {
            name: index.toString(),
            data: traceData,
          };
        });
        this.getDataLoading = false;

      }
      else {
        this.indiaIgxGraphData = [];
        const errorMessage = `There is no data available for the date range ${FromDate} to ${ToDate}.`;
        this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
      }
      this.getDataLoading = false;
    }, (err: any) => {
      this.getDataLoading = false;
      this.indiaIgxGraphData = [];
      const errorMessage = `There is no data available for the date range ${FromDate} to ${ToDate}.`;
      this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });

    });
   
    this.config = { responsive: true ,displayModeBar: false, }
  }
  getInstalledCapacity(){
    this.getDataLoading = true;
    this.commonService.getInstCapacityData({ 
    }).subscribe((res) => {
      if (res && res.data && res.data.data) {
        this.installedCapacityData = res.data.data;
        this.getInstCapacityData();
        this.getDataLoading = false;

      } else {
        this.getDataLoading = false;
      }

    }, (err: any) => {
      this.getDataLoading = false;
    });
  }
  getInstCapacityData() {
    this.capacityLats = [];
    this.capacityLons = [];
    this.states = [];
    this.installedCapacities = [];
    if (this.installedCapacityData && this.installedCapacityData.length > 0) {
      this.installedCapacityData.forEach((item: any) => {
      const LATITUDE = item.LATITUDE
      const LONGITUDE = item.LONGITUDE
      const State = item.ENTITY
      const Installed_Capacity = item.INSTALLED_CAPACITY
      this.capacityLats.push(LATITUDE);
      this.capacityLons.push(LONGITUDE);
      this.states.push(State);
      this.installedCapacities.push(Installed_Capacity)
    //   document.addEventListener('DOMContentLoaded', function() {
    //     // Create the style element
    //     const style = document.createElement('style');
    //     style.type = 'text/css';
    
    //     // Define the CSS content
    //     const cssContent = `
    //         .mapboxgl-map {
    //             top: 0px !important;
    //             visibility: visible !important;
    //         }`;
    
    //     // Add the CSS content to the style element
    //     if ((style as any).styleSheet) {
    //         // For IE
    //         (style as any).styleSheet.cssText = cssContent;
    //     } else {
    //         style.appendChild(document.createTextNode(cssContent));
    //     }
    
    //     // Append the style element to the head of the document
    //     document.head.appendChild(style);
    // });
    this.installedCapacityPlotData = [{
      type: 'scattermapbox',
      lat: this.capacityLats,
      lon: this.capacityLons,
      text: this.states,
      mode: 'markers+text',
      marker: {
        size: 15,
        color: "green",
        textposition: 'top center',

      },

      hoverinfo: 'text',
      hovertext: this.installedCapacityData.map((item: any) => `State: ${item.ENTITY}<br>Installed Capacity: ${item.INSTALLED_CAPACITY} MW`),
    }];
    this.capacityLayout = {
      hovermode: 'closest',
      mapbox: {
        bearing: 0,
        center: { lat: 20.5937, lon: 78.9629 },
        pitch: 0,
        zoom: 3.27,
        style: 'white-bg',
        layers: [
          {
            source: this.geoJsonResponse,
            below: "traces",
            type: "line",
            color: "purple",
            line: { width: 0.5 },
          },
        ],
      },  
      height: 700 
    }
    this.getDataLoading = false;
    this.config = { responsive: true ,displayModeBar: false, }
      const event = { points: [{ text: this.selectedState }] };
      this.getStateData(event);
  });
  }
  }
  getGeneratorsMap(){
    this.getDataLoading = true;
    this.commonService.getGeneratorsData({ 
    }).subscribe((res) => {
      if (res && res.data && res.data.data) {
        this.generatorsData = res.data.data;
        this.getGeneratorsMapData();
        this.getDataLoading = false;

      } else {
        this.getDataLoading = false;
      }

    }, (err: any) => {
      this.getDataLoading = false;
    });
  }
  

  getGeneratorsMapData() {
    this.getDataLoading = true;
    let groupedData = {};
    let titleMessage = '';
    if (this.blockSelection.value === 'All') {
      titleMessage = `All Generator Installed Capacity`;
      this.filteredGeneratorsData = this.generatorsData;
  } else {
      const selectedCapacity = parseFloat(this.blockSelection.value.replace(">", ""));
      this.filteredGeneratorsData = this.generatorsData.filter(item => parseFloat(item.CAPACITY_IN_MW) >= selectedCapacity); 
      titleMessage = `Generators with Installed Capacity >= ${selectedCapacity} MW`;
  }
    let colors = {
      'hydro': '#1ca3ec',
      'coal': '#666666',
      'wind': '#dea0f4',
      'biomass': '#A3A101',
      'solar': '#ffb428',
      'gas': '#ef4444',
      'oil': '#181818'
    };
    this.filteredGeneratorsData.forEach(item => {
      const fuelType = item.FUEL_TYPE;
      if (!groupedData[fuelType]) {
        groupedData[fuelType] = {
          lat: [],
          lon: [],
          text: [],
          hovertext: []
        };
      }
      groupedData[fuelType].lat.push(item.LATITUDE);
      groupedData[fuelType].lon.push(item.LONGITUDE);
      groupedData[fuelType].text.push(item.NAME_OF_PROJECT);
      groupedData[fuelType].hovertext.push(`Power Station Name: ${item.NAME_OF_PROJECT}<br>Installed Capacity: ${item.CAPACITY_IN_MW} MW <br>Fuel Type: ${item.FUEL_TYPE}<br>Number of generators: ${item.UNIT}`);
    });

    this.generatorsPlotData = Object.keys(groupedData).map(fuelType => ({
      type: 'scattermapbox',
      lat: groupedData[fuelType].lat,
      lon: groupedData[fuelType].lon,
      text: groupedData[fuelType].text,
      mode: 'markers+text',
      name: fuelType, 
      marker: {
        size: 15,
        color: colors[fuelType]
      },
      hoverinfo: 'text',
      hovertext: groupedData[fuelType].hovertext
    }));
    this.generatorLayout = {
          hovermode: 'closest',
          mapbox: {
            bearing: 0,
            center: { lat: 24, lon: 78 },
            pitch: 0,
            zoom: 3,
            style: 'white-bg',
            layers: [
              {
                source: this.geoJsonResponse,
                below: "traces",
                type: "line",
                color: "purple",
                line: { width: 0.5 },
              },
            ],
           
    
          },
          showlegend:true,
          legend: { orientation:'v',x:1,y:1 },
          height: 600,
          title: {
            text: titleMessage, 
            font: {
              size: 15,
            },
          },
        }
  
   
    this.getDataLoading = false;
    this.config = { responsive: true, displayModeBar: false };
  }
  // this method is called when a state is selected and to fetch data for pie chart
getStateData(e: any) {
  if (e && e.points && e.points.length > 0 && e.points[0].text) {
      this.isSecondGraphVisible = true;
      this.selectedState = e.points[0].text;
      this.gasValues = this.installedCapacityData.find((state: any) => state.ENTITY === this.selectedState);
      this.title = this.selectedState + ':' + this.gasValues.INSTALLED_CAPACITY;
      this.fuelTypes=Object.keys(this.gasValues).slice(3,15).map((word)=>{
        return word[0].toUpperCase()+word.slice(1)
      })
      for (let i=0;i<this.fuelTypes.length;i++){
        if (this.fuelTypes[i]==='Small_hydro'){
          this.fuelTypes[i]='Small Hydro'
        }
      }
      this.chartData = [{
          type: "pie",
          lat: this.capacityLats,
          lon: this.capacityLons,
          values: Object.values(this.gasValues).slice(3,15),
          labels: this.fuelTypes,
          textposition: 'auto',
          textinfo:'label+percent',
          texttemplate:'%{label}:%{percent:.2%}',
          hovertemplate: '%{label}: %{value} MW<extra></extra>',
          textfont:{
            size:9,
          },
          marker:{
            colors: ["#181818", "#666666", "#ef4444", "#1ca3ec", "#181818", "#ffb428", "#dea0f4"]
          },
      }];
      this.chartLayout = {
          height: 400,
          annotations: [{
            text:this.title,
            font: {
                size: 12,
                color: '#000',
            },
            showarrow: false,
            x: 0.5,
            y: -0.009,
            xanchor: 'center',
            yanchor: 'top',
        }],
      };
        
  }
   else {
      console.error("Event data is invalid or does not contain the expected properties.");
  }

  let newColors = this.states.map(state => state === this.selectedState ? 'yellow' : 'green');
  this.installedCapacityPlotData[0].marker.color = newColors;

  // this method is used to create a pie chart and perform perations based on legend click

    Plotly.newPlot('pi-container', this.chartData, this.chartLayout).then((chart:any) => {
      if (chart.removeAllListeners) {
        chart.removeAllListeners('plotly_legendclick');
      }
      this.legendClicked={};
      this.remainingCapacity=this.gasValues.INSTALLED_CAPACITY
      chart.on('plotly_legendclick', (eventData: any) => {
        let label=eventData.label[0].toLowerCase()+eventData.label.slice(1)
        if(label==='small Hydro'){
          label='small_hydro'
        }
        if(label in this.legendClicked){
          this.remainingCapacity+=this.gasValues[label]
          this.title=this.selectedState+":"+Math.round((this.remainingCapacity+Number.EPSILON)*100)/100
          delete this.legendClicked[label]
        }
        else{
          this.remainingCapacity-=this.gasValues[label]
          this.legendClicked[label]=true
          this.title=this.selectedState+":"+Math.round((this.remainingCapacity+Number.EPSILON)*100)/100
        }
        this.chartLayout.annotations[0].text=this.title   
      });
    });
}

}
