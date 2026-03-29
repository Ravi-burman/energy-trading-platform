import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonService } from '../services/common.service';
import { CommonUtilityService } from 'src/app/services/common-utility.service';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.scss'],
  providers: [MessageService]
})
export class AdminRolesComponent {
  @ViewChild('rolesdt') rolesdt: Table;
  @ViewChild('paginator') paginator: Paginator;
  roles: any = [];
  loading: boolean = true;
  searchValue: any;
  roleObj: any = {};
  addRoleSection: boolean = false;
  listViewSection: boolean = true;
  submitted: boolean = false;
  statuses: any = [{ name: 'All', value: '' }, { name: 'Active', value: 'Active' }, { name: 'Inactive', value: 'Inactive' }];
  options: any = [{ name: 'Role Name', value: 'name' }];
  selectedStatus: any;
  filteredRoles: any[] = [];
  selectedOption: any;
  getRolesLoading: boolean = false;
  currentPageIndex = 0;
  paginatorOptions: any = {};
  currentListPage: any;
  defaultSortField = 'role_name';
  defaultSortOrder = 1;
  retainedSortOrder: number;
  retainedSortField: string;
  hasRoles = false;
  getActivePrivilegesLoading: boolean;
  privileges: any = [];
  selectedPrivilegesOption: any;


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
    this.getRoles();
    this.getActivePrivileges();
    this.loading = false;
  }

  ngAfterViewInit() {
    if (this.rolesdt) {
    }
  }

  onPageChange(event: any) {
    this.currentPageIndex = event.page;
    this.currentPageIndex = event.first;
    this.currentListPage = event.rows;
  }

  getRoles() {
    this.getRolesLoading = true;
    this.commonService.getRoles({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        // this.commonUtilityService.showSuccessMessage(res.data.message);
        this.roles = res.data.roles;
        this.filteredRoles = res.data.roles;
        this.hasRoles = this.roles && this.roles.length > 0;
        this.getRolesLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getRolesLoading = false;
      }
    }, (err: any) => {
      this.getRolesLoading = false;
      // this.messageService.add({  severity: 'error', summary: 'Error', detail: err.message });
      this.commonUtilityService.showErrorMessage(err);
    })
  }

  getActivePrivileges() {

    this.getActivePrivilegesLoading = true;
    this.commonService.getActivePrivileges({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.privileges = res.data.privileges;

        // this.filteredRoles=res.data;
        this.getActivePrivilegesLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getActivePrivilegesLoading = false;
      }
    }, (err: any) => {
      this.getActivePrivilegesLoading = false;
      this.commonUtilityService.showErrorMessage(err);
      // this.messageService.add({  severity: 'error', summary: 'Error', detail: err.message });
    })

  }


  addRole(role?: any) {
    if (role === undefined) {
      this.roleObj = {};
      this.roleObj.is_active = true;
    }
    else if (role.id) {
      this.roleObj = role;
      const selectedPrivileges = this.privileges.filter((b: any) => {
        if (b.id === role.privilege_id) {
          return b;
        }
      })

      this.roleObj.selectedPrivilegesOption = selectedPrivileges[0];
      this.roleObj.status = role.is_active;


    }

    this.addRoleSection = true;
    this.listViewSection = false;

  }

  cancelForm() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Cancel?',
      header: 'Confirmation',
      accept: () => {
        this.addRoleSection = false;
        this.listViewSection = true;
        this.getRoles();
      },
      reject: (type: any) => {
      }
    });



  }

  createRole(form: NgForm, type: any, role: any) {
    if (form.invalid) {
      return;
    }
    this.submitted = true;
    this.loading = true;
    let data = form.value;
    data.privilege_id = this.roleObj.selectedPrivilegesOption.id;
    // data.privilege_id = this.roleObj.privilege.id;
    if (type === 'add') {
      this.commonService.createRole(
        {
          data,
          headers: {
          }
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.loading = false;
          this.getRoles();
          this.selectedStatus = '';
          this.listViewSection = true;
          this.addRoleSection = false;


        } else {
          this.commonUtilityService.singleErrorMsg(res.error);
          this.loading = false;
        }
      }, (err: any) => {
        this.loading = false;
        // this.messageService.add({  severity: 'error', summary: 'Error', detail: err.message });
        this.commonUtilityService.showErrorMessage(err);
      })
    } if (type === 'update') {
      data.id = role.id;
      this.loading = true;
      this.commonService.updateRole(
        {
          data,
          headers: {
          }
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.loading = false;
          this.getRoles();
          this.selectedStatus = '';
          this.listViewSection = true;
          this.addRoleSection = false;



        } else {
          this.commonUtilityService.singleErrorMsg(res.error);
          this.loading = false;
        }
      }, (err: any) => {
        this.loading = false;
        // this.messageService.add({  severity: 'error', summary: 'Error', detail: err.message });
        this.commonUtilityService.showErrorMessage(err);
      })
    }


  }

  resetForm(roleForm: NgForm) {
    this.roleObj = {};
    this.roleObj.is_active = true;
    this.getRoles();

  }

  activeStatusChange(is_active) {

  }

  clear(table: Table) {
    this.searchValue = '';
    this.selectedStatus = '';
    const retainedSortOrder = table.sortOrder;
    const retainedSortField = 'role_name';
    // this.filteredRoles=this.roles;
    table.clear();
    table.sortOrder = retainedSortOrder;
    table.sortField = retainedSortField;
    // this.defaultSortField = 'role_name'; 
    // this.defaultSortOrder = 1;
    this.getRoles();

  }

  changeStatus(selectedStatus: string) {
    if (selectedStatus === '') {
      this.filteredRoles = this.roles;
    } else if (selectedStatus === 'Active') {
      this.filteredRoles = this.roles.filter((role) => role.is_active === true);
    } else if (selectedStatus === 'Inactive') {
      this.filteredRoles = this.roles.filter((role) => role.is_active === false);
    }
  }


  deleteRole(role) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete the Role : <b>${role?.name.toUpperCase()}</b> ?`,
      header: 'Confirmation',
      accept: () => {
        this.loading = true;
        this.commonService.deleteRole(role.id).subscribe((res: any) => {
          if (res && res.status === this.commonUtilityService.SUCCESS) {
            this.commonUtilityService.showSuccessMessage(res.data.message);
            this.loading = false;
            this.getRoles();
          } else {
            this.commonUtilityService.singleErrorMsg(res.error);
            this.loading = false;
          }
        }, (err: any) => {
          this.loading = false;
          // this.messageService.add({  severity: 'error', summary: 'Error', detail: err.message });
          this.commonUtilityService.showErrorMessage(err);
        })
      },
      reject: (type: any) => {
        this.loading = false;
      }
    });
  }
  search(event: any) {
    this.searchValue = event;
    this.filterUsers();
  }
  filterUsers() {
    if (this.selectedStatus.value===''){
        this.filteredRoles = this.roles.filter((role) =>
        role.name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }
    else if (this.selectedStatus.value==='Active'){
      this.filteredRoles = this.roles.filter((role) =>
      role.name.toLowerCase().includes(this.searchValue.toLowerCase()) && role.is_active===true)
    }
    else if (this.selectedStatus.value==='Inactive'){
      this.filteredRoles = this.roles.filter((role) =>
      role.name.toLowerCase().includes(this.searchValue.toLowerCase()) && role.is_active===false)
    }
   }
} 



