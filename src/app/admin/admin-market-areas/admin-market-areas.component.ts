import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonService } from '../services/common.service';
import { CommonUtilityService } from 'src/app/services/common-utility.service';
import { Paginator } from 'primeng/paginator';


@Component({
  selector: 'app-admin-market-areas',
  templateUrl: './admin-market-areas.component.html',
  styleUrls: ['./admin-market-areas.component.scss']
})
export class AdminMarketAreasComponent {
  @ViewChild('mktAreasdt') mktAreasdt: Table;
  @ViewChild('paginator') paginator: Paginator;
  areas: any = [];
  loading: boolean = false;
  searchValue: any = '';
  mktObj: any = {};
  addMktAreaSection: boolean = false;
  listViewSection: boolean = true;
  submitted: boolean = false;
  statuses: any = [{ name: 'All', value: '' }, { name: 'Active', value: 'Active' }, { name: 'Inactive', value: 'Inactive' }];
  options: any = [{ name: 'Market Area Name', value: 'name' }, { name: 'RLDC', value: 'rldc_name' }, { name: 'Country', value: 'country_name' }];
  selectedStatus: any;
  filteredMktArea: any = [];
  selectedOption: any;
  getAreasLoading: boolean = false;
  currentPageIndex = 0;
  paginatorOptions: any = {};
  currentListPage: any;
  defaultSortField = 'name';
  defaultSortOrder = 1;
  retainedSortOrder: number;
  retainedSortField: string;
  hasMktAreas = false;
  countriesList: any = [];
  rldcsList: any = [];
  selectedRldcOption: any;

  activeRldcCountryName: string = '';
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
    this.getMarketArea();
    this.getCountry();
    this.loading = false;
  }


  ngAfterViewInit() {
    if (this.mktAreasdt) {
    }
  }

  onPageChange(event: any) {
    this.currentPageIndex = event.page;
    this.currentPageIndex = event.first;
    this.currentListPage = event.rows;
  }
  // this method is used to get the market area
  getMarketArea() {
    this.getAreasLoading = true;
    this.commonService.getMarketArea({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.areas = res.data.mkt_area_list;
        this.filteredMktArea = this.areas;
        this.getAreasLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getAreasLoading = false;
      }
    }, (err: any) => {
      this.getAreasLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    });
  }
  //this method is used to get the country data
  getCountry() {
    this.getAreasLoading = true;
    this.commonService.getCountry({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.countriesList = res.data.country_list.filter((country) => { return country.is_active === true });
        this.getAreasLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getAreasLoading = false;
      }
    }, (err: any) => {
      this.getAreasLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
  }
  //this method is used to get data on changing country
  onCountryChange(country) {
    if (country) {
      this.getRldc(country.id)
    }
  }

  //this method is used to get the rldc data
  getRldc(id) {
    this.getAreasLoading = true;
    this.commonService.getRldcForMarketAreas(id, {}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.rldcsList = res.data.rldc.filter((rldc) => { return rldc.is_active === true })
          .map((rldc) => ({ ...rldc, name: rldc.name.toUpperCase() }));


        this.getAreasLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getAreasLoading = false;
      }
    }, (err: any) => {
      this.getAreasLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
  }
  // this method is used to get data based on dropdown change
  changeDropdown() {
    this.searchValue = '';
    this.filteredMktArea = this.areas;
    this.selectedStatus = this.statuses[0].name
  }
  // this method is used to get data based on search
  search(event: any) {
    this.searchValue = event;
    this.filterUsers();
  }
  //this method is used to get data based on search
  filterUsers() {
    // if (this.selectedOption.value==='name'){
    //   if (this.selectedStatus.value === '') {
    //     this.filteredMktArea = this.areas.filter((mktArea)=>
    //     mktArea.name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Active') {
    //     this.filteredMktArea = this.areas.filter((mktArea) => 
    //     mktArea.is_active === true && mktArea.name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredMktArea = this.areas.filter((mktArea) => 
    //     mktArea.is_active === false && mktArea.name.toLowerCase().includes(this.searchValue));
    //   }
    // }
    // else if(this.selectedOption.value==='rldc_name'){

    //   if (this.selectedStatus.value === '') {
    //     this.filteredMktArea = this.areas.filter((mktArea)=>
    //     mktArea.rldc_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Active') {
    //     this.filteredMktArea = this.areas.filter((mktArea) => 
    //     mktArea.is_active === true && mktArea.rldc_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredMktArea = this.areas.filter((mktArea) => 
    //     mktArea.is_active === false && mktArea.rldc_name.toLowerCase().includes(this.searchValue));
    //   }
    // }
    // else if (this.selectedOption.value==='country_name'){

    //   if (this.selectedStatus.value === '') {
    //     this.filteredMktArea = this.areas.filter((mktArea)=>
    //     mktArea.country_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Active') {
    //     this.filteredMktArea = this.areas.filter((mktArea) => 
    //     mktArea.is_active === true && mktArea.country_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredMktArea = this.areas.filter((mktArea) => 
    //     mktArea.is_active === false && mktArea.country_name.toLowerCase().includes(this.searchValue));
    //   }
    // }
    if (this.selectedOption.value === 'name') {
      this.filteredMktArea = this.areas.filter((mktArea) =>
        mktArea.name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }
    else if (this.selectedOption.value === 'rldc_name') {
      this.filteredMktArea = this.areas.filter((mktArea) =>
        mktArea.rldc_name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }
    else if (this.selectedOption.value === 'country_name') {
      this.filteredMktArea = this.areas.filter((mktArea) =>
        mktArea.country_name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }
  }
  // this method is used to add a new mkt area or edit the existing mkt area
  add_or_edit_MarketArea(mktArea?) {
    if (mktArea === undefined) {
      this.mktObj = {};
      this.mktObj.is_active = true;
    }
    else if (mktArea.id) {
      this.getRldc(mktArea.country_id)
      this.loading = true;
      setTimeout(() => {
        this.mktObj = mktArea;
        const selectedmktArea = this.countriesList.filter((b: any) => b.id === mktArea.country_id);
        const seletedRldc = this.rldcsList.filter((b: any) => b.id === mktArea.rldc_id);
        this.mktObj.selectedCountry = selectedmktArea[0];
        if (this.mktObj.selectedCountry) {
          this.mktObj.selectedRldcOption = seletedRldc[0]
        }
        this.loading = false;
      }, 2000);

      this.mktObj.is_active = mktArea.is_active;
    }

    this.addMktAreaSection = true;
    this.listViewSection = false;

  }
  // this method is used to cancel the form
  cancelForm() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Cancel?',
      header: 'Confirmation',
      accept: () => {
        this.addMktAreaSection = false;
        this.listViewSection = true;
        this.getMarketArea()
      },
      reject: (type: any) => {
      }
    });
  }
  // this method is used to create a new mkt area or updates the existing mkt area
  create_or_update_MarketArea(form: NgForm, type, mktArea) {
    if (form.invalid) {
      return;
    }
    this.submitted = true;
    this.loading = true;
    let data = form.value;
    data.rldc_id = this.mktObj.selectedRldcOption.id
    if (data.country_id) {
      if (data.country_id.id) {
        data.country_id = form.value.country_id.id;
      } else if (data.country_id) {
        data.country_id = form.value.country_id
      }
    } if (type === 'add') {
      delete data.rldc;
      delete data.country
      this.commonService.createMarketArea(
        {
          data,
          headers: {
          }
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.loading = false;
          this.getMarketArea();
          this.selectedStatus = '';
          this.listViewSection = true;
          this.addMktAreaSection = false;

        } else {
          this.commonUtilityService.singleErrorMsg(res.data);
          this.loading = false;
        }
      }, (err: any) => {
        this.loading = false;
        this.commonUtilityService.showErrorMessage(err);
      })
    } if (type === 'update') {
      delete data.rldc;
      delete data.country;
      data.id = mktArea.id;
      this.loading = true;
      this.commonService.updateMarketArea(
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
          this.addMktAreaSection = false;
          this.getMarketArea()

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
  // this method is used to reset the form
  resetForm(mktArea: NgForm) {
    this.mktObj = {};
    this.mktObj.is_active = true;
    this.getMarketArea();

  }

  activeStatusChange(status) {

  }
  // this method is used to clear the data
  clear(table: Table) {
    this.searchValue = '';
    this.selectedStatus = '';
    const retainedSortOrder = table.sortOrder;
    const retainedSortField = 'name';
    table.clear();
    table.sortOrder = retainedSortOrder;
    table.sortField = retainedSortField;
    this.getMarketArea();
    this.selectedOption = this.options[0].name

  }

  // Update your existing changeStatus method to call the new method
  changeStatus(selectedStatus: string) {
    if (selectedStatus === '') {
      this.filteredMktArea = this.areas;
    } else if (selectedStatus === 'Active') {
      this.filteredMktArea = this.areas.filter((mktArea) => mktArea.is_active === true);
    } else if (selectedStatus === 'Inactive') {
      this.filteredMktArea = this.areas.filter((mktArea) => mktArea.is_active === false);
    }
  }

  // this method is used to to delete the existing mkt area
  deleteMarketArea(mktArea) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete <b>${mktArea?.name.toUpperCase()}</b>?`,
      header: 'Confirmation',
      accept: () => {
        this.loading = true;
        this.commonService.deleteMarketArea(mktArea.id).subscribe((res: any) => {
          if (res && res.status === this.commonUtilityService.SUCCESS) {
            this.commonUtilityService.showSuccessMessage(res.data.message);
            this.loading = false;
            this.getMarketArea();
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

