import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonService } from '../services/common.service';
import { CommonUtilityService } from 'src/app/services/common-utility.service';
import { Paginator } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-admin-countries',
  templateUrl: './admin-countries.component.html',
  styleUrls: ['./admin-countries.component.scss']
})
export class AdminCountriesComponent {
  @ViewChild('countrydt') countrydt: Table;
  @ViewChild('paginator') paginator: Paginator;
  @ViewChild('chips') chips: MultiSelectModule;
  loading: boolean = true;
  searchValue: any;
  countryObj: any = {};
  addCountrySection: boolean = false;
  listViewSection: boolean = true;
  submitted: boolean = false;
  statuses: any = [{ name: 'All', value: '' }, { name: 'Active', value: 'Active' }, { name: 'Inactive', value: 'Inactive' }];
  options: any = [{ name: 'Country Name', value: 'name' }];
  selectedStatus: any;
  filteredCountry: any = [];
  selectedOption: any;
  getCountryLoading: boolean = false;
  currentPageIndex = 0;
  paginatorOptions: any = {};
  currentListPage: any;
  defaultSortField = 'name';
  defaultSortOrder = 1;
  retainedSortOrder: number;
  retainedSortField: string;
  hasCountry = false;
  selectMarketProvider: any;
  country: any = [];
  arraylist: any = []

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
    this.selectedOption = '';
    this.selectedStatus = '';
    this.getCountry();
    this.loading = false;
  }



  ngAfterViewInit() {
    if (this.countrydt) { }
  }

  onPageChange(event: any) {
    this.currentPageIndex = event.page;
    this.currentPageIndex = event.first;
    this.currentListPage = event.rows;
  }
  // Getting the country data
  getCountry() {
    this.getCountryLoading = true;
    this.commonService.getCountry({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.country = res.data.country_list;
        this.arraylist = res.data.country_list;
        this.filteredCountry = res.data.country_list;
        this.getCountryLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getCountryLoading = false;
      }
    }, (err: any) => {
      this.getCountryLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
  }

  //Changing table status dropdown
  changeStatus(selectedStatus: string) {
    if (selectedStatus === '') {
      this.filteredCountry = this.country;
    } else if (selectedStatus === 'Active') {
      this.filteredCountry = this.country.filter((country) => country.is_active === true);
    } else if (selectedStatus === 'Inactive') {
      this.filteredCountry = this.country.filter((country) => country.is_active === false);
    }
  }
  //For Adding and Editing the Country Data
  addCountry(country?) {
    if (country === undefined) {
      this.countryObj = {};
      this.countryObj.is_active = true;
    }
    else if (country.name) {
      this.countryObj = country;
      this.countryObj.status = country.is_active;
    }
    this.addCountrySection = true;
    this.listViewSection = false;
  }

  cancelForm() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Cancel?',
      header: 'Confirmation',
      accept: () => {
        this.addCountrySection = false;
        this.listViewSection = true;
        this.getCountry();
        this.searchValue = ''
      },
      reject: (type: any) => {
      }
    });
  }

  // For Create and Update Country Datas
  createCountry(form: NgForm, type, country) {
    if (form.invalid) {
      return;
    }
    this.submitted = true;
    this.loading = true;
    let data = form.value;
    if (type === 'add') {
      this.commonService.createCountry(
        {
          data,
          headers: {}
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.loading = false;
          this.getCountry();
          this.selectedStatus = '';
          this.listViewSection = true;
          this.addCountrySection = false;

        } else {
          this.commonUtilityService.singleErrorMsg(res.error);
          this.loading = false;
        }
      }, (err: any) => {
        this.loading = false;
        this.commonUtilityService.showErrorMessage(err);
      })
    } if (type === 'update') {
      data.id = country.id;
      this.loading = true;
      this.commonService.updateCountry(
        {
          data,
          headers: {}
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.loading = false;
          this.getCountry();
          this.selectedStatus = '';
          this.searchValue = '';
          this.listViewSection = true;
          this.addCountrySection = false;
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

  resetForm(countryForm: NgForm) {
    this.countryObj = {};
    this.countryObj.is_active = true;
    this.getCountry();
  }

  activeStatusChange(is_active) { }

  clear(table: Table) {
    this.searchValue = '';
    this.selectedStatus = '';
    const retainedSortOrder = table.sortOrder;
    const retainedSortField = 'name';
    this.filteredCountry = this.country;
    table.clear();
    table.sortOrder = retainedSortOrder;
    table.sortField = retainedSortField;
    this.defaultSortField = 'name';
    this.defaultSortOrder = 1;
    this.getCountry();

  }

  // For Delete  the Country Data
  deleteCountry(country) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete <b>${country?.name.toUpperCase()}</b>?`,
      header: 'Confirmation',
      accept: () => {
        this.loading = true;
        this.commonService.deleteCountry(country.id).subscribe((res: any) => {
          if (res && res.status === this.commonUtilityService.SUCCESS) {
            this.commonUtilityService.showSuccessMessage(res.data.message);
            this.loading = false;
            this.getCountry();
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
