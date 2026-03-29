import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouterGuardService } from './services/router-guard.service';


import { HomeComponent } from './admin/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminRolesComponent } from './admin/admin-roles/admin-roles.component';
import { UserProfileComponent } from './admin/user-profile/user-profile.component';
import { AdminMarketProviderComponent } from './admin/admin-market-provider/admin-market-provider.component';
import { AdminCountriesComponent } from './admin/admin-countries/admin-countries.component';
import { AdminRldcsComponent } from './admin/admin-rldcs/admin-rldcs.component';
import { AdminMarketAreasComponent } from './admin/admin-market-areas/admin-market-areas.component';
import { AdminStatesComponent} from './admin/admin-states/admin-states.component';
import { AdminIndividualEntitiesComponent } from './admin/admin-individual-entities/admin-individual-entities.component';
import { AdminMarketTypeComponent } from './admin/admin-market-type/admin-market-type.component';
import { AdminMarketHierarchyComponent } from './admin/admin-market-hierarchy/admin-market-hierarchy.component';
import { AdminStatusComponent } from './admin/admin-status/admin-status.component';
import { AdminModelWiseForecastComponent } from './admin/admin-model-wise-forecast/admin-model-wise-forecast.component';
import { AdminForecastVsActualComponent } from './admin/admin-forecast-vs-actual/admin-forecast-vs-actual.component';
import { AdminIndiaTendsComponent } from './admin/admin-india-trends/admin-india-tends.component';
import { AdminIgxGasdataComponent } from './admin/admin-igx-gasdata/admin-igx-gasdata.component';
import { AdminIexProfilepictureComponent } from './admin/admin-iex-profilepicture/admin-iex-profilepicture.component';
import { GeneratorGroupingComponent } from './admin/generator-grouping/generator-grouping.component';
import { AdminGeneratorOutagesComponent } from './admin/admin-generator-outages/admin-generator-outages.component';
import { NppIndiaMapComponent } from './admin/npp-india-map/npp-india-map.component';
import { AdminRtm192Component } from './admin/admin-rtm192/admin-rtm192.component';






const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  
  // { path: 'gpms', loadChildren: () => import('./projects/gpms/gpms.module').then(m => m.GpmsModule) },
  // { path: 'gama', loadChildren: () => import('./projects/gama/gama.module').then(m => m.GamaModule) },
  // { path: '**', redirectTo: '/auth/login' },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  
 
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'status',
    component: AdminStatusComponent,
  },
  {
    path: 'admin-users',
    component: AdminUsersComponent,
  },
  {
    path: 'admin-roles',
    component: AdminRolesComponent,
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
  },
  {
    path: 'admin-market-providers',
    component: AdminMarketProviderComponent
  },
  {
    path: 'admin-countries',
    component: AdminCountriesComponent
  },
  {
    path: 'admin-rldcs',
    component: AdminRldcsComponent
  },
  {
    path: 'admin-market-areas',
    component: AdminMarketAreasComponent
  },
  {
    path: 'admin-states',
    component: AdminStatesComponent
  },
  {
    path: 'admin-individual-entities',
    component: AdminIndividualEntitiesComponent
  },
  {
    path: 'admin-market-type',
    component: AdminMarketTypeComponent
  },
  {
    path: 'admin-market-hierarchies',
    component: AdminMarketHierarchyComponent
  },
  {
    path: 'admin-model-wise-forecast',
    component: AdminModelWiseForecastComponent
  },
  {
    path: 'admin-forecast_actual',
    component: AdminForecastVsActualComponent
  },
  {
    path: 'admin-india-trends',
    component: AdminIndiaTendsComponent
  },
  {
    path: 'admin-igx_gasdata',
    component: AdminIgxGasdataComponent
  },
  {
  path:'admin-iex-profile',
  component: AdminIexProfilepictureComponent
  },
  {
  path:'admin-generators-groups',
  component:GeneratorGroupingComponent
  },
  {
    path:'admin-generator-outages',
    component:AdminGeneratorOutagesComponent
  },
  {
    path:'admin-npp-maps',
    component:NppIndiaMapComponent
  },
  {
    path:'admin-rtm192',
    component:AdminRtm192Component
  },

  {
    path: 'admin',
    canActivate: [RouterGuardService],
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
    // Add a child route for the dashboard
    // children: [
    //   { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    //   { path: 'dashboard', component: GreensignsDashboardComponent }, // Replace 'AdminDashboardComponent' with the actual component for the admin dashboard
    // ],
  },
  // {
  //   path: 'about',
  //   component: AboutComponent,
  // },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
