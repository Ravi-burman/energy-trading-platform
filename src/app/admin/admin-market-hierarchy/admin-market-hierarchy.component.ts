import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonService } from '../services/common.service';
import { CommonUtilityService } from 'src/app/services/common-utility.service';
import { Paginator } from 'primeng/paginator';

interface City {
  name: string,
  code: string
}
@Component({
  selector: 'app-admin-market-hierarchy',
  templateUrl: './admin-market-hierarchy.component.html',
  styleUrls: ['./admin-market-hierarchy.component.scss']
})
export class AdminMarketHierarchyComponent {
  @ViewChild('mktHierarchydt') mktHierarchydt: Table;
  @ViewChild('paginator') paginator: Paginator;
  areas: any = [];
  loading: boolean = true;
  searchValue: any;
  mktObj: any = {};
  addMktHierarchySection: boolean = false;
  listViewSection: boolean = true;
  submitted: boolean = false;
  selectedOption: any;
  getMktHierarchyLoading: boolean = false;
  currentPageIndex = 0;
  paginatorOptions: any = {};
  currentListPage: any;
  defaultSortField = 'name';
  defaultSortOrder = 1;
  retainedSortOrder: number;
  retainedSortField: string;
  hasMktHierarchy = false;
  countriesList: any = [];
  market_providers: any[];
  market_providers_hierarchy: any[] = [];
  rldcsList: any = [];
  data: any = [100, 80, 60]
  sectionStyles: { 'border-bottom': string; }[];

  cities!: City[];

  selectedCities!: City[];
  countryId: any;
  mkt_provider_ids: any[] = [];
  countryMktId: any;
  mktId: any;
  // dataPoints: any[] = [];
  convertedData: any[] = [];
  firstProviderName: any;


  constructor(private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private messageService: MessageService,
    private commonUtilityService: CommonUtilityService) {

    this.paginatorOptions = {
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      rows: 10,
      first: 0
    };

  }

  ngOnInit() {

    this.selectedOption = '';
    this.loading = false;
  }


  ngAfterViewInit() {
    if (this.mktHierarchydt) {
    }
  }

  onPageChange(event: any) {
    this.currentPageIndex = event.page;
    this.currentPageIndex = event.first;
    this.currentListPage = event.rows;
  }
  activeStatusChange(status) { }

  chartOptions = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: "IEX",
      fontSize: 18,
      horizontalAlign: 'left'

    },
    data: [
      {
        type: 'pyramid',
        indexLabelFontSize: 16,
        //showInLegend: true,
        legendText: '{indexLabel}',
        toolTipContent: '{indexLabel}',
        dataPoints:
          [
            {
              y: 20, indexLabel: 'Individual Entities (N/A)', indexLabelFontColor: 'gray', color: '#D3D3D3',
              indexLabelLineDashType: 'dash'
            },

            {
              y: 20, indexLabel: 'States (N/A)', indexLabelFontColor: 'gray', color: '#D3D3D3',
              indexLabelLineDashType: 'dash'
            },
            { y: 20, indexLabel: 'Market Areas (13)' },
            { y: 20, indexLabel: 'RLDCs(5)' },
            { y: 20, indexLabel: 'India' },
          ],
      },
    ],
  };

  cOptions = {
    animationEnabled: true,
    theme: 'light2',

    title: {
      text: "WBES",
      fontSize: 18,
      horizontalAlign: 'left'
    },
    data: [
      {
        type: 'pyramid',
        indexLabelFontSize: 16,
        legendText: '{indexLabel}',
        toolTipContent: '{indexLabel}',
        dataPoints:
          [
            { y: 20, indexLabel: 'Individual Entities(599)' },
            { y: 20, indexLabel: 'States (42)' },
            { y: 20, indexLabel: 'Market Areas (13)' },
            { y: 20, indexLabel: 'RLDCs(5)' },
            { y: 20, indexLabel: 'India' },
          ],
      },
    ],
  };



}
