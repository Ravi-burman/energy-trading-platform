import { Component, HostListener, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';

import { CommonUtilityService } from 'src/app/services/common-utility.service';
import { CommonService } from '../../services/common.service';
import { MenuItem } from 'primeng/api';
import { AuthServices } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: any = {};
  roles: boolean;
  users: boolean;
  settingsModel: any;
  workSpaces: any;
  visible: boolean;
  hideme = {};
  data: any = {};
  hasAppAdminRoleFlag: boolean = false;
  hasReveiwerRoleFlag: boolean = false;
  items: MenuItem[];
  list: any = [];
  list2: any = [];
  list3: any = [];
  list4: any = [];

  getUserByIdLoading: boolean;
  getUserById$Subscription: any;
  loginUser: any;

  constructor(
    private global: GlobalService,
    private router: Router, private authService: AuthServices,
    private commonServices: CommonService,
    private commonUtilityService: CommonUtilityService,
  ) {
    const userRoles = this.global.getLocalItem('roles', true);
    this.hasAppAdminRoleFlag = this.hasAdminRole(userRoles, ['APP_ADMIN', 'ETD_ADMIN']);
    this.loginUser = this.authService.getLocalItem('loginUser', true);
    this.getUserById(this.loginUser.id)
    this.getUserById$Subscription = this.commonServices.getUserById$.subscribe((res) => {
      this.getUserById(this.loginUser.id);
    });

    this.list = [
      // { li: "System Status", class: "pi pi-compass", route: '/status' },
      { li: "Roles", class: "pi pi-id-card", route: '/admin-roles' },
      { li: "Users", class: "pi pi-users", route: '/admin-users' },
      { li: "Market Providers", class: "pi pi-briefcase", route: '/admin-market-providers' },
      { li: "Markets", class: "pi pi-th-large", route: '/admin-market-type' },
      { li: "Countries", class: "pi pi-globe", route: '/admin-countries' },
      { li: "RLDCs", class: "pi pi-map-marker", route: '/admin-rldcs' },
      { li: "Market Areas", class: "pi pi-chart-pie", route: '/admin-market-areas' },
      { li: "States", class: "pi pi-flag", route: '/admin-states' },
      { li: "Individual Entities", class: "pi pi-box", route: '/admin-individual-entities' },
      { li: "Generators Grouping", class: "pi pi-globe", route: '/admin-generators-groups' },
    ];

    this.list2 = [

      { li: "Maps", class: "pi pi-chart-line", route: '/admin-india-trends' },
      // { li: "Forecast Model Wise", class: "pi pi-chart-pie", route: '/admin-model-wise-forecast' },
      { li: "Forecast vs Actual", class: "pi pi-check-circle", route: '/admin-forecast_actual' },
      { li: "System Status", class: "pi pi-desktop", route: '/status' },
      // <li><a routerLink="/status" routerLinkActive="active">STATUS</a></li>

    ];

    this.list3 = [

      // { li: "Market Providers", class: "pi pi-briefcase", route: '/admin-market-providers' },
      // { li: "Countries", class: "pi pi-globe", route: '/admin-countries' },
      // { li: "RLDCs", class: "pi pi-map-marker", route: '/admin-rldcs' },
      // { li: "Market Areas", class: "pi pi-chart-pie", route: '/admin-market-areas' },
      // { li: "States", class: "pi pi-flag", route: '/admin-states' },
      // { li: "Individual Entities", class: "pi pi-box", route: '/admin-individual-entities' },
      // { li: "Markets", class: "pi pi-th-large", route: '/admin-market-type' },
      { li: "Market Hierarchies", class: "pi pi-sitemap", route: '/admin-market-hierarchies' },
      { li: "Maps", class: "pi pi-chart-line", route: '/admin-india-trends' },
      { li: "NPP India Map", class: "pi pi-desktop", route: '/admin-npp-maps' },
      { li: "System Status", class: "pi pi-desktop", route: '/status' },


    ];

    this.list4 = [
      // { li: 'Forecast Metrics', class: 'pi pi-globe' },
      // { li: "Approve", class: "pi pi-check", route: '/admin-approve' },
      // { li: "Scale", class: "pi pi-compass", route: '/admin-scale' },
      // { li: "ML Models", class: "pi pi-table", route: '/admin-ml-models' }
      { li: "Forecast Model Wise", class: "pi pi-sun",  route: '/admin-model-wise-forecast' },
      { li: "Forecast vs Actual", class: "pi pi-check-circle", route: '/admin-forecast_actual' },
      { li: "RTM Comparision", class: "pi pi-check-circle", route: '/admin-rtm192' },
      { li: "IGX Gas Data", class: "pi pi-sitemap", route: '/admin-igx_gasdata' },
      { li: "IEX Profile Picture", class: "pi pi-sitemap", route: '/admin-iex-profile' },
      { li: "Genrators Outages Data", class: "pi pi-chart-line", route: '/admin-generator-outages' },


    ];
  }


  getUserById(id) {
    this.getUserByIdLoading = true;
    this.commonServices.getUserById(id).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.user = res.data.user;
        this.getUserByIdLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getUserByIdLoading = false;
      }
    }, (err: any) => {
      this.getUserByIdLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
  }
  ngOnInit(): void {

    this.data = this.user;
    this.visible = false;
    this.settingsModel = false;
    this.items = [
      {
        label: 'Sub Menu 1',
        icon: 'pi pi-user-plus',
        command: () => {
          this.gotoAdmin();
        }
      },
      {
        label: 'Sub Menu2',
        icon: 'pi pi-cog',
        command: () => {
          this.gotoEtdAdmin();
        }
      },
    ];

  }

  hasAdminRole(arr, list) {
    if (arr != null && arr.length > 0 && list != null && list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        if (arr.indexOf(list[i]) > -1) {
          return true;
        }
      }
    }
    return false;
  }
  openSettingsModal() {
    this.visible = true;
    this.settingsModel = true;
  }

  toggleNav() {
    var sidenav = document.getElementById('sidenav');
    sidenav.classList.toggle('active');
  
    if (sidenav.classList.contains('active')) {
      document.body.addEventListener('click', this.closeNavOnOutsideClick);
    } else {
      document.body.removeEventListener('click', this.closeNavOnOutsideClick);
    }
  }
  
  closeNavOnOutsideClick(event: Event) {
    var sidenav = document.getElementById('sidenav');
    var menuConfigBtn = document.querySelector('.menuConfigBtn');
  
    if (sidenav && menuConfigBtn && !sidenav.contains(event.target as Node) && !menuConfigBtn.contains(event.target as Node)) {
      sidenav.classList.remove('active');
    }
  }
  ngOnDestroy() {
    document.body.removeEventListener('click', this.closeNavOnOutsideClick);
  }

  @HostListener('window:unload', ['$event'])
  public unloadHandler($event) {
  }

  logout() {
    this.global.removeLocalItem('etdauth');
    this.global.removeLocalItem('roles');
    this.router.navigate(['/login']);
  }

  gotoEtdAdmin() {
    this.router.navigate(['/admin/etd-admin']);
  }

  gotoDownload() {
    this.router.navigate(['/admin/etd-download']);
  }
  gotoUpload() {
    this.router.navigate(['/admin/etd-upload']);
  }

  gotoUsers() {
    this.router.navigate(['/admin-users']);
  }

  gotoRoles() {
    this.router.navigate(['/admin-roles']);
  }

  gotoAdmin() {
    this.router.navigate(['/admin/manage']);
  }
  gotoHome() {
    this.router.navigate(['/home']);
  }
  gotoUserMgmt() {
    this.router.navigate(['/admin/user-management']);
  }
  gotoEmailNotifications() {
    this.router.navigate(['/admin/email-notifications']);
  }
  gotoReports() {
    this.router.navigate(['/admin/reports']);
  }
  gotoManual() {
    this.router.navigate(['/admin/manual']);
  }

  settingsModelClose(ev) {
    this.visible = false;
    this.settingsModel = false;
  }

}
