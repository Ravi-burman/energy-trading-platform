import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonService } from '../services/common.service';
import { CommonUtilityService } from 'src/app/services/common-utility.service';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-admin-states',
  templateUrl: './admin-states.component.html',
  styleUrls: ['./admin-states.component.scss']
})
export class AdminStatesComponent {
  @ViewChild('statedt') statedt: Table;
  @ViewChild('paginator') paginator: Paginator;
  states: any = [];
  loading: boolean = true;
  searchValue: any = '';
  stateObj: any = {};
  addStateSection: boolean = false;
  listViewSection: boolean = true;
  submitted: boolean = false;
  statuses: any = [{ name: 'All', value: '' }, { name: 'Active', value: 'Active' }, { name: 'Inactive', value: 'Inactive' }];
  options: any = [{ name: 'State Name', value: 'name' }, { name: 'Market Area', value: 'market_area_name' }, { name: 'Country', value: 'country_name' }];
  selectedStatus: any;
  filteredStates: any[] = [];
  selectedOption: any;
  getStatesLoading: boolean = false;
  currentPageIndex = 0;
  paginatorOptions: any = {};
  currentListPage: any;
  defaultSortField = 'name';
  defaultSortOrder = 1;
  retainedSortOrder: number;
  retainedSortField: string;
  hasStates = false;
  countriesList: any = [];
  mktAreas: any = [];
  selectedStateOption: any;


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
    this.getState();
    this.getCountry();
    this.loading = false;
  }


  ngAfterViewInit() {
    if (this.statedt) {
    }
  }

  onPageChange(event: any) {
    this.currentPageIndex = event.page;
    this.currentPageIndex = event.first;
    this.currentListPage = event.rows;
  }

  getState() {
    this.getStatesLoading = true;
    this.commonService.getState({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.states = res.data.states;
        this.filteredStates = this.states;
        this.hasStates = this.states && this.states.length > 0;
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

  getMarketArea(id) {
    this.getStatesLoading = true;
    this.commonService.getMarketAreaForState(id, {}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.mktAreas = res.data.market_area.filter((mktArea) => { return mktArea.is_active === true })
          .map((mktArea) => ({ ...mktArea, name: mktArea.name.toUpperCase() }));

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
      this.getMarketArea(country.id)
    }
  }
  // this method is used to add a new state or edit the existing one
  add_or_edit_state(state?) {
    if (state === undefined) {
      this.stateObj = {};
      this.stateObj.is_active = true;
    }
    else if (state.id) {
      this.getMarketArea(state.country_id)
      this.loading = true;
      setTimeout(() => {
        this.stateObj = state;
        const selectedstates = this.countriesList.filter((b: any) => b.id === state.country_id);
        const selectedMarketArea = this.mktAreas.filter((b: any) => b.id === state.market_area_id);
        this.stateObj.selectedCountry = selectedstates[0];
        if (this.stateObj.selectedCountry) {
          this.stateObj.selectedStateOption = selectedMarketArea[0]
        }
        this.loading = false;
      }, 2000);

      this.stateObj.is_active = state.is_active;
    }
    this.addStateSection = true;
    this.listViewSection = false;

  }

  changeDropdown() {
    this.searchValue = '';
    this.filteredStates = this.states;
    this.selectedStatus = this.statuses[0].name
  }

  cancelForm() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Cancel?',
      header: 'Confirmation',
      accept: () => {
        this.addStateSection = false;
        this.listViewSection = true;
        this.getState()
      },
      reject: (type: any) => {
      }
    });
  }


  // this method is used to create a new state or update the existing state
  create_or_update_state(form: NgForm, type, state) {
    if (form.invalid) {
      return;
    }
    this.submitted = true;
    this.loading = true;
    let data = form.value;
    data.country_id = form.value.selectedCountry.id;
    data.market_area_id = this.stateObj.selectedStateOption.id;
    if (type === 'add') {
      delete data.country;
      this.commonService.createState(
        {
          data,
          headers: {
          }
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.loading = false;
          this.getState();
          this.selectedStatus = '';
          this.listViewSection = true;
          this.addStateSection = false;
        } else {
          this.commonUtilityService.singleErrorMsg(res.error);
          this.loading = false;
        }
      }, (err: any) => {
        this.loading = false;
        this.commonUtilityService.showErrorMessage(err);
      })
    } if (type === 'update') {
      delete data.country;
      data.id = state.id;
      this.loading = true;
      this.commonService.updateState(
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
          this.addStateSection = false;
          this.getState()

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

  resetForm(statesForm: NgForm) {
    this.stateObj = {};
    this.stateObj.is_active = true;
    this.getState();

  }

  activeStatusChange(is_active) {

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
    this.getState();
    this.selectedOption = this.options[0].name
  }


  // Update your existing changeStatus method to call the new method
  changeStatus(selectedStatus: string) {
    if (selectedStatus === '') {
      this.filteredStates = this.states;
    } else if (selectedStatus === 'Active') {
      this.filteredStates = this.states.filter((states) => states.is_active === true);
    } else if (selectedStatus === 'Inactive') {
      this.filteredStates = this.states.filter((states) => states.is_active === false);
    }
  }


  search(event: any) {
    this.searchValue = event;
    this.filterUsers();
  }


  // this method is used to filter data based on status
  filterUsers() {
    // if(this.selectedOption.value==='name'){
    //   if (this.selectedStatus.value === '') {
    //     this.filteredStates = this.states.filter((states)=>
    //     states.name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Active') {
    //     this.filteredStates = this.states.filter((states) =>
    //      states.is_active === true && states.name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredStates = this.states.filter((states) => 
    //     states.is_active === false && states.name.toLowerCase().includes(this.searchValue));
    //   }
    // }
    // else if (this.selectedOption.value==='market_area_name'){
    //   if (this.selectedStatus.value === '') {
    //     this.filteredStates = this.states.filter((states)=>
    //     states.market_area_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Active') {
    //     this.filteredStates = this.states.filter((states) =>
    //      states.is_active === true && states.market_area_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredStates = this.states.filter((states) => 
    //     states.is_active === false && states.market_area_name.toLowerCase().includes(this.searchValue));
    //   }
    // }
    // else if (this.selectedOption.value==='country_name'){
    //   if (this.selectedStatus.value === '') {
    //     this.filteredStates = this.states.filter((states)=>
    //     states.country_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Active') {
    //     this.filteredStates = this.states.filter((states) =>
    //     states.is_active === true && states.country_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredStates = this.states.filter((states) => 
    //     states.is_active === false && states.country_name.toLowerCase().includes(this.searchValue));
    //   }
    // }
    if (this.selectedOption.value === 'name') {
      this.filteredStates = this.states.filter((states) =>
        states.name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }
    else if (this.selectedOption.value === 'market_area_name') {
      this.filteredStates = this.states.filter((states) =>
        states.market_area_name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }
    else if (this.selectedOption.value === 'country_name') {
      this.filteredStates = this.states.filter((states) =>
        states.country_name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }

  }
  // this method is used to delete the existing one
  deleteState(state) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete <b>${state?.name.toUpperCase()}</b>?`,
      header: 'Confirmation',
      accept: () => {
        this.loading = true;
        this.commonService.deleteState(state.id).subscribe((res: any) => {
          if (res && res.status === this.commonUtilityService.SUCCESS) {
            this.commonUtilityService.showSuccessMessage(res.data.message);
            this.loading = false;
            this.getState();
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

