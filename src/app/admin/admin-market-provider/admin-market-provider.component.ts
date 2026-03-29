import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonService } from '../services/common.service';
import { CommonUtilityService } from 'src/app/services/common-utility.service';
import { Paginator } from 'primeng/paginator';



@Component({
  selector: 'app-admin-market-provider',
  templateUrl: './admin-market-provider.component.html',
  styleUrls: ['./admin-market-provider.component.scss']
})
export class AdminMarketProviderComponent {
  @ViewChild('mktProviderdt') mktProviderdt: Table;
  @ViewChild('paginator') paginator: Paginator;
  markets: any = [];
  loading: boolean = true;
  searchValue: any = '';
  mktObj: any = {};
  addMktProviderSection: boolean = false;
  listViewSection: boolean = true;
  submitted: boolean = false;
  statuses: any = [{ name: 'All', value: '' }, { name: 'Active', value: 'Active' }, { name: 'Inactive', value: 'Inactive' }];
  options: any = [{ name: 'Provider Name', value: 'name' }, { name: 'Country', value: 'country_name' }];
  selectedStatus: any;
  filteredMktProvider: any = [];
  selectedOption: any;
  getMktProvidersLoading: boolean = false;
  currentPageIndex = 0;
  paginatorOptions: any = {};
  currentListPage: any;
  defaultSortField = 'name';
  defaultSortOrder = 1;
  retainedSortOrder: number;
  retainedSortField: string;
  hasMktProviders = false;
  activeCountries: string[] = [];
  countryNames: any;
  countriesList: any = [];


  constructor(private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private messageService: MessageService,
    private commonUtilityService: CommonUtilityService,

  ) {

    this.paginatorOptions = {
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      rows: 10,
      first: 0
    };

  }

  ngOnInit() {
    this.getMarketProvider();
    this.getCountry();
    this.loading = false;
  }

  ngAfterViewInit() {
    if (this.mktProviderdt) {
    }
  }

  onPageChange(event: any) {
    this.currentPageIndex = event.page;
    this.currentPageIndex = event.first;
    this.currentListPage = event.rows;
  }

  // This method is used to get the market provider
  getMarketProvider() {
    this.getMktProvidersLoading = true;
    this.commonService.getMarketProvider({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.markets = res.data.mkt_provider_list;
        this.filteredMktProvider = this.markets;
        this.hasMktProviders = this.markets && this.markets.length > 0;
        this.getMktProvidersLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getMktProvidersLoading = false;
      }
    }, (err: any) => {
      this.getMktProvidersLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
  }


  changeDropdown() {
    this.searchValue = '';
    this.filteredMktProvider = this.markets;
    this.searchValue = ''
    this.selectedStatus = this.statuses[0].name
  }


  add_or_edit_MarketProvider(mktProvider?) {
    if (mktProvider === undefined) {
      this.mktObj = {};
      this.mktObj.is_active = true;
    }
    else if (mktProvider.id) {
      // this.mktObj = mktProvider;
      this.mktObj = { ...mktProvider };
      const seletedRole = this.countriesList.filter((b: any) => {
        if (b.id === mktProvider.country_id) {
          return b;
        }
      })
      this.mktObj.selectedCountry = seletedRole[0];
      this.mktObj.is_active = mktProvider.is_active;

    }
    this.addMktProviderSection = true;
    this.listViewSection = false;

  }

  cancelForm() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Cancel?',
      header: 'Confirmation',
      accept: () => {
        this.addMktProviderSection = false;
        this.listViewSection = true;
        this.getMarketProvider()
      },
      reject: (type: any) => {
      }
    });
  }


  // this method is used to create a new mkt provider or update an existing mkt provider
  create_or_update_MarketProvider(form: NgForm, type, mktProvider) {
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
    let mktObjToUpdate = { ...this.mktObj };
    if (type === 'add') {
      delete data.country;
      this.commonService.createMarketProvider(
        {
          data,
          headers: {
          }
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.loading = false;
          this.getMarketProvider();
          this.selectedStatus = '';
          this.listViewSection = true;
          this.addMktProviderSection = false;

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
      data.id = mktProvider.id;
      mktObjToUpdate.is_active = this.mktObj.is_active;
      this.loading = true;
      this.commonService.updateMarketProvider(
        {
          data,
          headers: {
          }
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.loading = false;
          this.getMarketProvider();
          this.selectedStatus = '';
          this.listViewSection = true;
          this.addMktProviderSection = false;


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
  // this method is used to is used to reset the form
  resetForm(mktProviderform: NgForm) {
    this.mktObj = {};
    this.mktObj.is_active = true;
    this.getMarketProvider();
  }

  activeStatusChange(is_active) { }
  // this method is used to is used to clear the data
  clear(table: Table) {
    this.searchValue = '';
    this.selectedStatus = '';
    const retainedSortOrder = table.sortOrder;
    const retainedSortField = 'name';
    table.clear();
    table.sortOrder = retainedSortOrder;
    table.sortField = retainedSortField;
    this.defaultSortField = 'name';
    this.getMarketProvider();
    this.selectedOption = this.options[0].name


  }

  // changeStatus(selectedStatus: string) {
  //   if (selectedStatus === '') {
  //     this.filteredMktProvider = this.markets;
  //   } else if (selectedStatus === 'Active') {
  //     this.filteredMktProvider = this.markets.filter((markets) => markets.is_active === true);
  //   } else if (selectedStatus === 'Inactive') {
  //     this.filteredMktProvider = this.markets.filter((markets) => markets.is_active === false);
  //   }
  // }

  search(event: any) {
    this.searchValue = event;
    this.filterUsers();
  }

  filterUsers() {
    // if (this.selectedOption.value==='name'){
    //   if (this.selectedStatus.value === '') {
    //     this.filteredMktProvider = this.markets.filter((mktProvider)=>
    //     mktProvider.name.toLowerCase().includes(this.searchValue));
    //   }else if (this.selectedStatus.value === 'Active') {
    //     this.filteredMktProvider = this.markets.filter((mktProvider) => 
    //     mktProvider.is_active===true && mktProvider.name.toLowerCase().includes(this.searchValue));
    //   }else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredMktProvider = this.markets.filter((mktProvider) =>
    //     mktProvider.is_active === false && mktProvider.name.toLowerCase().includes(this.searchValue));
    //   }
    // }else if(this.selectedOption.value==='country_name'){
    //   if (this.selectedStatus.value === '') {
    //     this.filteredMktProvider = this.markets.filter((mktProvider)=>
    //     mktProvider.country_name.toLowerCase().includes(this.searchValue));
    //   }else if (this.selectedStatus.value === 'Active') {
    //     this.filteredMktProvider = this.markets.filter((mktProvider) => 
    //     mktProvider.is_active===true && mktProvider.country_name.toLowerCase().includes(this.searchValue));
    //   }else if (this.selectedStatus.value === 'Inactive') {
    //   this.filteredMktProvider = this.markets.filter((mktProvider) => 
    //   mktProvider.is_active === false && mktProvider.country_name.toLowerCase().includes(this.searchValue))
    //   }
    // }
    if (this.selectedOption.value === 'name') {
      this.filteredMktProvider = this.markets.filter((mktProvider) =>
        mktProvider.name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }
    else if (this.selectedOption.value === 'country_name') {
      this.filteredMktProvider = this.markets.filter((mktProvider) =>
        mktProvider.country_name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }
  }


  // this method is used to get country details
  getCountry() {
    this.getMktProvidersLoading = true;
    this.commonService.getCountry({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.countriesList = res.data.country_list.filter((country) => { return country.is_active === true })
          .map((country) => ({ ...country, name: country.name.toUpperCase() }));
        this.getMktProvidersLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getMktProvidersLoading = false;
      }
    }, (err: any) => {
      this.getMktProvidersLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
  }

  // this method is used to delete the existing mkt provider
  deleteMarketProvider(mktProvider) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete <b>${mktProvider?.name.toUpperCase()}</b>?`,
      header: 'Confirmation',
      accept: () => {
        this.loading = true;
        this.commonService.deleteMarketProvider(mktProvider.id).subscribe((res: any) => {
          if (res && res.status === this.commonUtilityService.SUCCESS) {
            this.commonUtilityService.showSuccessMessage(res.data.message);
            this.loading = false;
            this.getMarketProvider();
            this.searchValue = '';
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




