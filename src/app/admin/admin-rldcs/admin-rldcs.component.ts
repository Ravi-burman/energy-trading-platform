import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonService } from '../services/common.service';
import { CommonUtilityService } from 'src/app/services/common-utility.service';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-admin-rldcs',
  templateUrl: './admin-rldcs.component.html',
  styleUrls: ['./admin-rldcs.component.scss']
})
export class AdminRldcsComponent {
  @ViewChild('rldcsdt') rldcsdt: Table;
  @ViewChild('paginator') paginator: Paginator;
  rldcs: any = [];
  loading: boolean = true;
  searchValue: any = '';
  rldcObj: any = {};
  addRldcSection: boolean = false;
  listViewSection: boolean = true;
  submitted: boolean = false;
  statuses: any = [{ name: 'All', value: '' }, { name: 'Active', value: 'Active' }, { name: 'Inactive', value: 'Inactive' }];
  options: any = [{ name: 'RLDC Name', value: 'name' }, { name: 'Country', value: 'country_name' }];
  selectedStatus: any;
  filteredRldcs: any = [];
  selectedOption: any;
  getRldcLoading: boolean = false;
  currentPageIndex = 0;
  paginatorOptions: any = {};
  currentListPage: any;
  defaultSortField = 'name';
  defaultSortOrder = 1;
  retainedSortOrder: number;
  retainedSortField: string;
  hasRldc = false;
  countriesList: any = [];

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
    this.getRldc();
    this.getCountry();
    this.loading = false;
  }


  ngAfterViewInit() {
    if (this.rldcsdt) { }
  }

  onPageChange(event: any) {
    this.currentPageIndex = event.page;
    this.currentPageIndex = event.first;
    this.currentListPage = event.rows;
  }

  getRldc() {
    this.getRldcLoading = true;
    this.commonService.getRldc({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.rldcs = res.data.rldc_list;
        this.filteredRldcs = this.rldcs;
        this.hasRldc = this.rldcs && this.rldcs.length > 0;
        this.getRldcLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.data.message);
        this.getRldcLoading = false;
      }
    }, (err: any) => {
      this.getRldcLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
  }

  changeDropdown() {
    this.searchValue = '';
    this.filteredRldcs = this.rldcs;
    this.selectedStatus = this.statuses[0].name
  }


  add_or_edit_rldc(rldc?) {
    if (rldc === undefined) {
      this.rldcObj = {};
      this.rldcObj.is_active = true;
    }
    else if (rldc.id) {
      this.rldcObj = rldc;
      const seletedRole = this.countriesList.filter((b: any) => {
        if (b.id === rldc.country_id) {
          return b;
        }
      })
      this.rldcObj.selectedCountry = seletedRole[0]
      this.rldcObj.is_active = rldc.is_active;
    }

    this.addRldcSection = true;
    this.listViewSection = false;
  }

  cancelForm() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Cancel?',
      header: 'Confirmation',
      accept: () => {
        this.addRldcSection = false;
        this.listViewSection = true;
        this.getRldc()
      },
      reject: (type: any) => {
      }
    });
  }

  create_or_update_rldc(form: NgForm, type, rldc) {
    if (form.invalid) {
      return;
    }
    this.submitted = true;
    this.loading = true;
    let data = form.value;
    data.country_id = form.value.selectedCountry.id;
    if (type === 'add') {
      delete data.country;
      this.commonService.createRldc(
        {
          data,
          headers: {}
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.loading = false;
          this.getRldc();
          this.selectedStatus = '';
          this.listViewSection = true;
          this.addRldcSection = false;
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
      data.id = rldc.id;
      this.loading = true;
      this.commonService.updateRldc(
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
          this.addRldcSection = false;
          this.getRldc()

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

  resetForm(roleForm: NgForm) {
    this.rldcObj = {};
    this.rldcObj.is_active = true;
    this.getRldc();

  }

  activeStatusChange(status) {

  }
  getCountry() {
    this.getRldcLoading = true;
    this.commonService.getCountry({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.countriesList = res.data.country_list.filter((country) => { return country.is_active === true });
        this.getRldcLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getRldcLoading = false;
      }
    }, (err: any) => {
      this.getRldcLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
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
    this.defaultSortOrder = 1;
    this.getRldc();
    this.selectedOption = this.options[0].name

  }

  // Update your existing changeStatus method to call the new method
  changeStatus(selectedStatus: string) {
    if (selectedStatus === '') {
      this.filteredRldcs = this.rldcs;
    } else if (selectedStatus === 'Active') {
      this.filteredRldcs = this.rldcs.filter((rldc) => rldc.is_active === true);
    } else if (selectedStatus === 'Inactive') {
      this.filteredRldcs = this.rldcs.filter((rldc) => rldc.is_active === false);
    }
  }
  // this function is used to filter search based on status
  filterUsers() {
    // if (this.selectedOption.value==='name'){
    //   if (this.selectedStatus.value === '') {
    //     this.filteredRldcs = this.rldcs.filter((rldc)=>
    //     rldc.name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Active') {
    //     this.filteredRldcs = this.rldcs.filter((rldc) =>
    //     rldc.is_active === true && rldc.name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredRldcs = this.rldcs.filter((rldc) =>
    //     rldc.is_active === false && rldc.name.toLowerCase().includes(this.searchValue));
    //   }
    // }
    // else if(this.selectedOption.value==='country_name'){
    //   if (this.selectedStatus.value === '') {
    //     this.filteredRldcs = this.rldcs.filter((rldc)=>
    //     rldc.country_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Active') {
    //     this.filteredRldcs = this.rldcs.filter((rldc) =>
    //     rldc.is_active === true && rldc.country_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredRldcs = this.rldcs.filter((rldc) =>
    //     rldc.is_active === false && rldc.country_name.toLowerCase().includes(this.searchValue));
    //   }
    // }
    if (this.selectedOption.value === 'name') {
      this.filteredRldcs = this.rldcs.filter((rldc) =>
        rldc.name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }
    else if (this.selectedOption.value === 'country_name') {
      this.filteredRldcs = this.rldcs.filter((rldc) =>
        rldc.country_name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }

  }

  search(event: any) {
    this.searchValue = event;
    this.filterUsers();
  }

  // this method is used to delete the existing rldc
  deleteRldc(rldc) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete <b>${rldc?.name.toUpperCase()}</b>?`,
      header: 'Confirmation',
      accept: () => {
        this.loading = true;
        this.commonService.deleteRldc(rldc.id).subscribe((res: any) => {
          if (res && res.status === this.commonUtilityService.SUCCESS) {
            this.commonUtilityService.showSuccessMessage(res.data.message);
            this.loading = false;
            this.getRldc();
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