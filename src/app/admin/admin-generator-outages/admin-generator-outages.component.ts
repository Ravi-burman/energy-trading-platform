import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Message, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { from } from 'rxjs';

@Component({
  selector: 'app-admin-generator-outages',
  templateUrl: './admin-generator-outages.component.html',
  styleUrls: ['./admin-generator-outages.component.scss']
})
export class AdminGeneratorOutagesComponent implements OnInit {
  getDataLoading: boolean = false;
  outagesData:any;
  dateRange:FormGroup;
  maxDate:Date;
  FromDate: any;
  ToDate: any;
  public graph = {
    graphOutageData: [] as { x:any[], y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string }[],
    layout: {
      title: {
        text: 'All India Generators Outage',
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
        title: 'Outage (MW)',
        side: 'left',
        showgrid: false,
        font: {
          size: 13,
          family: 'Roboto, sans-serif',
        },
      },
      legend: { orientation: 'h', x: 0.2, y: -0.5 },
      hovermode: 'x unified',
      height: 600
    },
    config: { responsive: true , displayModeBar: false }
  };
  constructor(private commonService:CommonService, private messageService: MessageService, private fb:FormBuilder,    public datepipe: DatePipe,

    )
    { this.dateRange = this.fb.group({
      FromDate: [''],
      ToDate: ['', Validators.required],
    });
    this.maxDate= new Date();
  }
  ngOnInit(){
   this.dateRange.patchValue({
      FromDate: new Date(),
      ToDate: new Date(),
    });
    let fromDate: Date = this.dateRange.value['FromDate'];
    fromDate.setDate(fromDate.getDate() - 5);
    let toDate: Date = this.dateRange.value['ToDate'];
    this.dateRange.patchValue({
      FromDate: fromDate,
      ToDate: toDate,
    });
   
    this.getGeneratorsOutagesData();
  }
  getGeneratorsOutagesData() {
    this.getDataLoading = true;
    var FromDate = this.datepipe.transform(this.dateRange.value['FromDate'], "dd-MMM-yyyy")?.toString();
    var ToDate = this.datepipe.transform(this.dateRange.value['ToDate'], "dd-MMM-yyyy")?.toString();
    var range=(this.dateRange.value['ToDate']-this.dateRange.value['FromDate'])/(1000*24*60*60)
    if(range<365){
      this.commonService.getGeneratorOutagesData({
        params: {
          start_date: FromDate,
          end_date: ToDate
        },
      }).subscribe((res) => {

        if (res && res.data && res.data.data) {
          this.outagesData = res.data.data
          this.getDataLoading = false;
          this.getGraphOutagesData();
        } else {
          this.getDataLoading = false;
        }

      }, (err: any) => {
        this.getDataLoading = false;
        const errorMessage = `There is no generators data available for ${FromDate} to ${ToDate} .`;
        this.messageService.add({ severity: 'error', summary: 'Service Message', detail: errorMessage });
      });
    }
    else{
      this.getDataLoading=false;
      this.graph.graphOutageData=[];
      const errorMessage = `Date Range should not exceed more than an year .`;
      this.messageService.add({ severity: 'error', detail: errorMessage });
    }
  }
  getGraphOutagesData() {
    if (this.outagesData && this.outagesData.length > 0) {
      const mockData: any[] = [];
      this.outagesData.forEach((entry: any) => {
        mockData.push({ start_time: entry.TIME_INTERVALS, outage: entry.OUTAGE });
      });
      this.graph.graphOutageData = [
        {
          x: mockData.map(entry => entry.start_time),
          y: mockData.map(entry => entry.outage),
          type: 'line',
          mode: 'lines+points',
          marker: { color: 'blue' },
          yaxis: 'y1',
          name: 'GeneratorsOutage',
        }as { x: any; y: any[]; type: string; mode: string; marker: { color: string }; yaxis: string; name: string },
      ];
    }

  }
  onDateRangeChange(){
    if (this.dateRange.valid){
    this.getGeneratorsOutagesData();
    }
  }
}
