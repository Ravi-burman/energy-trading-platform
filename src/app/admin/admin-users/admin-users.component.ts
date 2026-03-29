import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonService } from '../services/common.service';
import { CommonUtilityService } from 'src/app/services/common-utility.service';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
  providers: [MessageService]
})
export class AdminUsersComponent {
  @ViewChild('userdt') userdt: Table;
  @ViewChild('paginator') paginator: Paginator;
  users: any = [];
  loading: boolean = true;
  searchValue: any;
  userObj: any = {};
  addUserSection: boolean = false;
  listViewSection: boolean = true;
  submitted: boolean = false;
  statuses: any = [{ name: 'All', value: '' }, { name: 'Active', value: 'Active' }, { name: 'Inactive', value: 'Inactive' }];
  options: any = [{ name: 'First Name', value: 'first_name' }, { name: 'Last Name', value: 'last_name' }, { name: 'Role Name', value: 'role_name' }];
  Roleoptions: any = [{ name: 'GSAdmin', value: '' }, { name: 'GSAdmin', value: '' }, { name: 'GSAdmin', value: '' }, { name: 'GSAdmin', value: '' }]
  selectedStatus: any;
  filteredUsers: any = [];
  selectedOption: any;
  selectedRoleOption: any;
  currentPageIndex = 0;
  paginatorOptions: any = {};
  currentListPage: any;
  getUsersLoading: boolean = false;
  getActiveRolesLoading: boolean;
  roles: any = [];
  defaultSortField = 'first_name';
  defaultSortOrder = 1;
  retainedSortOrder: number;
  retainedSortField: string;
  hasRoles = false;

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
    this.getUsers();
    this.getActiveRoles();
    this.loading = false;
  }

  ngAfterViewInit() {
    if (this.userdt) {
    }
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }

  onPageChange(event: any) {
    this.currentPageIndex = event.page;
    this.currentPageIndex = event.first;
    this.currentListPage = event.rows;
  }

  getUsers() {
    this.getUsersLoading = true;
    this.commonService.getUsers({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.users = res.data.users;
        this.filteredUsers = res.data.users;
        this.hasRoles = this.users && this.users.length > 0;
        this.getUsersLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getUsersLoading = false;
      }
    }, (err: any) => {
      this.getUsersLoading = false;
      // this.messageService.add({  severity: 'error', summary: 'Error', detail: err.message });
      this.commonUtilityService.showErrorMessage(err);
    })
  }

  changeDropdown() {
    this.searchValue = '';
    this.filteredUsers = this.users;
    this.selectedStatus = '';
  }

  addUser(user?) {
    if (user === undefined) {
      this.userObj = {};
      this.userObj.is_active = true;
    }
    else if (user.id) {
      this.userObj = user;
      const seletedRole = this.roles.filter((b: any) => {
        if (b.id === user.role_id) {
          return b;
        }
      })
      this.userObj.selectedRoleOption = seletedRole[0];
      this.userObj.status = user.is_active;
    }
    this.addUserSection = true;
    this.listViewSection = false;
  }

  cancelForm() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Cancel?',
      header: 'Confirmation',
      accept: () => {
        this.addUserSection = false;
        this.listViewSection = true;
        this.getUsers();
      },
      reject: (type: any) => {
      }
    });
  }

  createUser(form: NgForm, type, user) {
    if (form.invalid) {
      return;
    }
    this.submitted = true;
    this.loading = true;
    let data = form.value;
    data.role_id = this.userObj.selectedRoleOption.id
    if (type === 'add') {
      this.commonService.createUser(
        {
          data,
          headers: {
          }
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.listViewSection = true;
          this.addUserSection = false;
          this.loading = false;
          this.getUsers();
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
      data.id = user.id;
      this.loading = true;
      this.commonService.updateUser(
        {
          data,
          headers: {
          }
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.listViewSection = true;
          this.selectedStatus = '';
          this.addUserSection = false;
          this.loading = false;
          user = res.data;
          this.getUsers();
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
    this.userObj = {};
    this.userObj.is_active = true;
  }

  activeStatusChange(is_active) {

  }

  clear(table: Table) {
    this.searchValue = '';
    this.selectedStatus = '';
    this.selectedOption = { name: 'First Name', value: 'first_name' }
    this.filterUsers();
    const retainedSortOrder = table.sortOrder;
    const retainedSortField = 'first_name';
    // this.filteredRoles=this.roles;
    table.clear();
    table.sortOrder = retainedSortOrder;
    table.sortField = retainedSortField;
    // this.defaultSortField = 'role_name'; 
    // this.defaultSortOrder = 1;
    this.getUsers();

  }

  changeStatusfilter(selectedStatus: string) {
    this.filteredUsers = [];
    if (selectedStatus === '') {
      this.filteredUsers = this.users;
    } else if (selectedStatus === 'Active') {
      this.filteredUsers = this.users.filter((role) => role.is_active === true);
    } else if (selectedStatus === 'Inactive') {
      this.filteredUsers = this.users.filter((role) => role.is_active === false);
    }
  }

  // changeUserRole(selectedStatus: string) {
  //   this.filterUsers();
  // }

  search(event: any) {
    this.searchValue = event;
    this.filterUsers();
  }
  // filterUsers() {
  //   const searchTerm = this.searchValue ? this.searchValue.toLowerCase().trim() : '';
  //   const selectedFilter = this.selectedOption.value;

  //   this.filteredUsers = this.users.filter((user) => {
  //     if (selectedFilter === 'first_name') {
  //       return user.first_name.toLowerCase().includes(searchTerm);
  //     } else if (selectedFilter === 'last_name') {
  //       return user.last_name.toLowerCase().includes(searchTerm);
  //     } else if (selectedFilter === 'role_name') {
  //       return user.role_name.toLowerCase().includes(searchTerm);
  //     }
  //     return false;
  //   });

  //   // Apply status filter if selected
  //   if (this.selectedStatus === 'Active') {
  //     this.filteredUsers = this.filteredUsers.filter((user) => user.status === true);
  //   } else if (this.selectedStatus === 'Inactive') {
  //     this.filteredUsers = this.filteredUsers.filter((user) => user.status === false);
  //   }
  // }
  // ...

  // changeStatusfilter(selectedStatus: string) {
  //   this.selectedStatus = selectedStatus;
  //   this.filterUsers();
  // }

  changeUserRole(selectedRole: string) {
    // this.selectedRoleOption = selectedRole;
    this.filterUsers();
  }

  filterUsers() {
    // const searchTerm = this.searchValue ? this.searchValue.toLowerCase().trim() : '';
    // const selectedFilter = this.selectedOption.value;

    // this.filteredUsers = this.users.filter((user) => {
    //   if (selectedFilter === 'first_name') {
    //     return user.first_name.toLowerCase().includes(searchTerm);
    //   } else if (selectedFilter === 'last_name') {
    //     return user.last_name.toLowerCase().includes(searchTerm);
    //   } else if (selectedFilter === 'role_name') {
    //     return user.role_name.toLowerCase().includes(searchTerm);
    //   }
    //   return false;
    // });

    // // Apply status filter if selected
    // if (this.selectedStatus === 'Active') {
    //   this.filteredUsers = this.filteredUsers.filter((user) => user.is_active === true);
    // } else if (this.selectedStatus === 'Inactive') {
    //   this.filteredUsers = this.filteredUsers.filter((user) => user.is_active === false);
    // }
    if (this.selectedOption.value === 'first_name') {
      if (this.selectedStatus.value === '') {
        this.filteredUsers = this.users.filter((user) =>
          user.first_name.toLowerCase().includes(this.searchValue.toLowerCase()))
      }
      else if (this.selectedStatus.value === 'Active') {
        this.filteredUsers = this.users.filter((user) =>
          user.is_active === true && user.first_name.toLowerCase().includes(this.searchValue.toLowerCase()))
      }
      else if (this.selectedStatus.value === 'Inactive') {
        this.filteredUsers = this.users.filter((user) =>
          user.is_active === false && user.first_name.toLowerCase().includes(this.searchValue.toLowerCase()))
      }
    }
    else if (this.selectedOption.value === 'last_name') {
      if (this.selectedStatus.value === '') {
        this.filteredUsers = this.users.filter((user) =>
          user.last_name.toLowerCase().includes(this.searchValue.toLowerCase()))
      }
      else if (this.selectedStatus.value === 'Active') {
        this.filteredUsers = this.users.filter((user) =>
          user.is_active === true && user.last_name.toLowerCase().includes(this.searchValue.toLowerCase()))
      }
      else if (this.selectedStatus.value === 'Inactive') {
        this.filteredUsers = this.users.filter((user) =>
          user.is_active === false && user.last_name.toLowerCase().includes(this.searchValue.toLowerCase()))
      }
    }
    else if (this.selectedOption.value === 'role_name') {
      if (this.selectedStatus.value === '') {
        this.filteredUsers = this.users.filter((user) =>
        user.role_name.toLowerCase().includes(this.searchValue.toLowerCase()));
      }
      else if (this.selectedStatus.value === 'Active') {
        this.filteredUsers = this.users.filter((user) =>
        user.is_active === true && user.role_name.toLowerCase().includes(this.searchValue.toLowerCase()));
      }
      else if (this.selectedStatus.value === 'Inactive') {
        this.filteredUsers = this.users.filter((user) =>
        user.is_active === false && user.role_name.toLowerCase().includes(this.searchValue.toLowerCase()));
      }
    }


  }

  containsSuperadmin() {
    if (this.users.first_name === 'Superadmin') {
      return true;
    }
  }


  // ...




  deleteUser(user) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete the User : <b>${user?.first_name.toUpperCase()}</b> ?`,
      header: 'Confirmation',
      accept: () => {
        this.loading = true;
        this.commonService.deleteUser(user.id).subscribe((res: any) => {
          if (res && res.status === this.commonUtilityService.SUCCESS) {
            this.commonUtilityService.showSuccessMessage(res.data.message);
            this.loading = false;
            this.getUsers();
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

  getActiveRoles() {
    this.getActiveRolesLoading = true;
    this.commonService.getActiveRoles({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.roles = res.data.roles;
        // this.filteredRoles=res.data;
        this.getActiveRolesLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getActiveRolesLoading = false;
      }
    }, (err: any) => {
      this.getActiveRolesLoading = false;
      this.commonUtilityService.showErrorMessage(err);
      // this.messageService.add({  severity: 'error', summary: 'Error', detail: err.message });
    })
  }


}
