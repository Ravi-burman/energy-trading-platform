import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonService } from '../services/common.service';
import { CommonUtilityService } from 'src/app/services/common-utility.service';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-admin-market-type',
  templateUrl: './admin-market-type.component.html',
  styleUrls: ['./admin-market-type.component.scss']
})
export class AdminMarketTypeComponent {
  @ViewChild('marketdt') marketdt: Table;
  @ViewChild('paginator') paginator: Paginator;
  marketType: any = [];
  loading: boolean = true;
  searchValue: any = '';
  mktTypeObj: any = {};
  addMarketSection: boolean = false;
  listViewSection: boolean = true;
  submitted: boolean = false;
  statuses: any = [{ name: 'All', value: '' }, { name: 'Active', value: 'Active' }, { name: 'Inactive', value: 'Inactive' }];
  options: any = [{ name: 'Market Name', value: 'name' }, { name: 'Market Provider', value: 'market_provider_name' }, { name: 'Country', value: 'country_name' }];
  selectedStatus: any;
  filteredMarkets: any[] = [];
  selectedOption: any;
  getStatesLoading: boolean = false;
  currentPageIndex = 0;
  paginatorOptions: any = {};
  currentListPage: any;
  defaultSortField = 'name';
  defaultSortOrder = 1;
  retainedSortOrder: number;
  retainedSortField: string;
  hasMkt = false;
  countriesList: any = [];
  mktTypes: any = [];
  selectedMktTypeOption: any;


  constructor(private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private commonUtilityService: CommonUtilityService) {

    this.paginatorOptions = {
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      rows: 10,
      first: 0
    };

  }

  ngOnInit() {
    this.selectedOption = '';
    this.getMarketType();
    this.getCountry();
    this.loading = false;
  }


  ngAfterViewInit() {
    if (this.marketdt) {
    }
  }

  onPageChange(event: any) {
    this.currentPageIndex = event.page;
    this.currentPageIndex = event.first;
    this.currentListPage = event.rows;
  }

  getMarketType() {
    this.getStatesLoading = true;
    this.commonService.getMarketType({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.marketType = res.data.mkt_type_list;
        this.filteredMarkets = this.marketType;
        this.hasMkt = this.marketType && this.marketType.length > 0;
        this.getStatesLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getStatesLoading = false;
      }
    }, (err: any) => {
      this.getStatesLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
  }

  getMarketProvider(id) {
    this.getStatesLoading = true;
    this.commonService.getMarketProviderForMarketType(id, {}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.mktTypes = res.data.market_providers.filter((mktType) => { return mktType.is_active === true })
          .map((mktType) => ({ ...mktType, name: mktType.name.toUpperCase() }));
        this.getStatesLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getStatesLoading = false;
      }
    }, (err: any) => {
      this.getStatesLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
  }

  getCountry() {
    this.getStatesLoading = true;
    this.commonService.getCountry({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.countriesList = res.data.country_list.filter((country) => { return country.is_active === true });
        this.getStatesLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getStatesLoading = false;
      }
    }, (err: any) => {
      this.getStatesLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
  }

  onCountryChange(country) {
    if (country) {
      this.getMarketProvider(country.id)
    }
  }
  // this method is used to add a new market or edit the existing market
  add_or_edit_marketType(mkt?) {
    if (mkt === undefined) {
      this.mktTypeObj = {};
      this.mktTypeObj.is_active = true;
    }
    else if (mkt.id) {
      this.getMarketProvider(mkt.country_id)
      this.loading = true;
      setTimeout(() => {
        this.mktTypeObj = mkt;
        const selectedmarkets = this.countriesList.filter((b: any) => b.id === mkt.country_id)
        this.mktTypeObj.selectedCountry = selectedmarkets[0];
        this.mktTypeObj.selectedMktTypeOption = this.mktTypes.find(option => option.id === mkt.market_provider_id);
        this.loading = false;
      }, 2000);

      this.mktTypeObj.is_active = mkt.is_active;
    }
    this.addMarketSection = true;
    this.listViewSection = false;

  }

  cancelForm() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Cancel?',
      header: 'Confirmation',
      accept: () => {
        this.addMarketSection = false;
        this.listViewSection = true;
        this.getMarketType()
      },
      reject: (type: any) => {
      }
    });
  }

  search(event: any) {
    this.searchValue = event;
    this.filterUsers();
  }

  changeDropdown() {
    this.searchValue = '';
    this.filteredMarkets = this.marketType;
    this.selectedStatus = this.statuses[0].name
  }
  // this method is used to filter search based on status
  filterUsers() {
    // if (this.selectedOption.value==='name'){
    //   if (this.selectedStatus.value === '') {
    //     this.filteredMarkets = this.marketType.filter((markets)=>
    //     markets.name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Active') {
    //     this.filteredMarkets = this.marketType.filter((markets) => 
    //     markets.is_active === true && markets.name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredMarkets = this.marketType.filter((markets) => 
    //     markets.is_active === false && markets.name.toLowerCase().includes(this.searchValue));
    //   }
    // }
    // else if(this.selectedOption.value==='market_provider_name') {
    //   if (this.selectedStatus.value === '') {
    //     this.filteredMarkets = this.marketType.filter((markets)=>
    //     markets.market_provider_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Active') {
    //     this.filteredMarkets = this.marketType.filter((markets) => 
    //     markets.is_active === true && markets.market_provider_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredMarkets = this.marketType.filter((markets) => 
    //     markets.is_active === false && markets.market_provider_name.toLowerCase().includes(this.searchValue));
    //   }
    // }
    // else if (this.selectedOption.value==='country_name'){
    //   if (this.selectedStatus.value === '') {
    //     this.filteredMarkets = this.marketType.filter((markets)=>
    //     markets.country_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Active') {
    //     this.filteredMarkets = this.marketType.filter((markets) => 
    //     markets.is_active === true && markets.country_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredMarkets = this.marketType.filter((markets) => 
    //     markets.is_active === false && markets.country_name.toLowerCase().includes(this.searchValue));
    //   }
    // }
    if (this.selectedOption.value === 'name') {
      this.filteredMarkets = this.marketType.filter((markets) =>
        markets.name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }
    else if (this.selectedOption.value === 'market_provider_name') {
      this.filteredMarkets = this.marketType.filter((markets) =>
        markets.market_provider_name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }
    else if (this.selectedOption.value === 'country_name') {
      this.filteredMarkets = this.marketType.filter((markets) =>
        markets.country_name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }


  }

  // this method is used to create a new market or updates the existing markets
  create_or_update_MarketType(form: NgForm, type, mkt) {
    if (form.invalid) {
      return;
    }
    this.submitted = true;
    this.loading = true;
    let data = form.value;
    if (data.country) {
      if (data.country.id) {
        data.country_id = form.value.country.id;
      } else if (data.country_id) {
        data.country_id = form.value.country_id
      }
    }
    data.market_provider_id = this.mktTypeObj.selectedMktTypeOption.id;
    if (type === 'add') {
      delete data.country;
      this.commonService.createMarketType(
        {
          data,
          headers: {
          }
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.loading = false;
          this.getMarketType();
          this.selectedStatus = '';
          this.listViewSection = true;
          this.addMarketSection = false;
        } else {
          this.commonUtilityService.singleErrorMsg(res.data);
          this.loading = false;
        }
      }, (err: any) => {
        this.loading = false;
        this.commonUtilityService.showErrorMessage(err);
      })
    } if (type === 'update') {
      delete data.country;
      data.id = mkt.id;
      this.loading = true;
      this.commonService.updateMarketType(
        {
          data,
          headers: {
          }
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.loading = false;
          this.listViewSection = true;
          this.addMarketSection = false;
          this.getMarketType()
        } else {
          this.commonUtilityService.singleErrorMsg(res.error);
          this.loading = false;
        }
      }, (err: any) => {
        this.loading = false;
        this.commonUtilityService.showErrorMessage(err);
      })
    }


  }

  resetForm(marketsForm: NgForm) {
    this.mktTypeObj = {};
    this.mktTypeObj.is_active = true;
    this.getMarketType();

  }

  activeStatusChange(status) {

  }


  clear(table: Table) {
    this.searchValue = '';
    this.selectedStatus = '';
    const retainedSortOrder = table.sortOrder;
    const retainedSortField = 'name';
    table.clear();
    table.sortOrder = retainedSortOrder;
    table.sortField = retainedSortField;
    this.defaultSortField = 'name';
    this.getMarketType();
    this.selectedOption = this.options[0].name

  }



  // Update your existing changeStatus method to call the new method
  changeStatus(selectedStatus: string) {
    if (selectedStatus === '') {
      this.filteredMarkets = this.marketType;
    } else if (selectedStatus === 'Active') {
      this.filteredMarkets = this.marketType.filter((markets) => markets.is_active === true);
    } else if (selectedStatus === 'Inactive') {
      this.filteredMarkets = this.marketType.filter((markets) => markets.is_active === false);
    }
  }
  deleteMarketType(mkt) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete <b>${mkt?.name.toUpperCase()}</b>?`,
      header: 'Confirmation',
      accept: () => {
        this.loading = true;
        this.commonService.deleteMarketType(mkt.id).subscribe((res: any) => {
          if (res && res.status === this.commonUtilityService.SUCCESS) {
            this.commonUtilityService.showSuccessMessage(res.data.message);
            this.loading = false;
            this.getMarketType();
            this.searchValue = ''
            this.selectedStatus = this.statuses[0].name
          } else {
            this.commonUtilityService.singleErrorMsg(res.error);
            this.loading = false;
          }
        }, (err: any) => {
          this.loading = false;
          this.commonUtilityService.showErrorMessage(err);
        })
      },
      reject: (type: any) => {
        this.loading = false;
      }
    });

  }

}
