import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { AdminUsersComponent } from '../admin-users/admin-users.component';
import { AdminRolesComponent } from '../admin-roles/admin-roles.component';

import { AdminModule } from '../admin.module';
import { AdminMarketProviderComponent } from '../admin-market-provider/admin-market-provider.component';
import { AdminCountriesComponent } from '../admin-countries/admin-countries.component';
import { AdminRldcsComponent } from '../admin-rldcs/admin-rldcs.component';
import { AdminMarketAreasComponent } from '../admin-market-areas/admin-market-areas.component';
import { AdminStatesComponent } from '../admin-states/admin-states.component';
import { AdminIndividualEntitiesComponent } from '../admin-individual-entities/admin-individual-entities.component';
import { AdminMarketTypeComponent } from '../admin-market-type/admin-market-type.component';
import { AdminModelWiseForecastComponent } from '../admin-model-wise-forecast/admin-model-wise-forecast.component';
import { AdminForecastVsActualComponent } from '../admin-forecast-vs-actual/admin-forecast-vs-actual.component';
import { AdminIndiaTendsComponent } from '../admin-india-trends/admin-india-tends.component';
import { AdminStatusComponent } from '../admin-status/admin-status.component';




const authRoutes: Routes = [
  // { path: '', redirectTo: 'workspace', pathMatch: 'full' },

  {
    path: '',
    component: HomeComponent,


    children: [

      { path: 'admin-users', component: AdminUsersComponent },
      { path: 'admin-roles', component: AdminRolesComponent },
      { path: 'home', component: HomeComponent },
      { path: 'status', component: AdminStatusComponent },
      { path: 'admin-market-provides', component: AdminMarketProviderComponent },
      { path: 'admin-countries', component: AdminCountriesComponent },
      { path: 'admin-rldcs', component: AdminRldcsComponent },
      { path: 'admin-market-areas', component: AdminMarketAreasComponent },
      { path: 'admin-states', component: AdminStatesComponent },
      { path: 'admin-individual-entities', component: AdminIndividualEntitiesComponent },
      { path: 'admin-market-type', component: AdminMarketTypeComponent },
      { path: 'admin-model-wise-forecast', component: AdminModelWiseForecastComponent },
      { path: 'admin-forecast_actual', component: AdminForecastVsActualComponent },
      { path: 'admin-india-tends', component: AdminIndiaTendsComponent },


    ],
  },

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class RoutingModule { }
