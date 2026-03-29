import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoutingModule } from './routing/routing.module';
import { GlobalService } from '../services/global.service';
import { PrimengModule } from '../primeng-module/primeng.module';
import { HeaderComponent } from './layout/header/header.component';
import { ApiConfigService } from './services/api-config.service';
import { CommonService } from './services/common.service';
import { MessageService } from 'primeng/api';
import { AutosizeModule } from 'ngx-autosize';
import { ClickOutsideDirective } from './directives/click-away.directive';
import { AllowNumberDirective } from './directives/numbers-only.directive';
import { SpecialCharacterDirective } from './directives/no-specials.directive';
import { TwoDigitDecimaNumberDirective } from './directives/digit-two-decimal.directive';
import { HomeComponent } from './home/home.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminRolesComponent } from './admin-roles/admin-roles.component';
import { ConfirmationService } from 'primeng/api';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChunkPipe } from './chunk.pipe';
import { AdminMarketProviderComponent } from './admin-market-provider/admin-market-provider.component';
import { AdminCountriesComponent } from './admin-countries/admin-countries.component';
import { AdminRldcsComponent } from './admin-rldcs/admin-rldcs.component';
import { AdminMarketAreasComponent } from './admin-market-areas/admin-market-areas.component';
import { AdminStatesComponent } from './admin-states/admin-states.component';
import { AdminIndividualEntitiesComponent } from './admin-individual-entities/admin-individual-entities.component';
import { AdminMarketTypeComponent } from './admin-market-type/admin-market-type.component';
import { AdminMarketHierarchyComponent } from './admin-market-hierarchy/admin-market-hierarchy.component';
import { ChartModule } from 'primeng/chart';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { AdminStatusComponent } from './admin-status/admin-status.component';
import { AdminModelWiseForecastComponent } from './admin-model-wise-forecast/admin-model-wise-forecast.component';
import { AdminForecastVsActualComponent } from './admin-forecast-vs-actual/admin-forecast-vs-actual.component';
import { AdminIndiaTendsComponent } from './admin-india-trends/admin-india-tends.component';
import { MaterialModule } from '../material-module/material.module';
import { AdminIgxGasdataComponent } from './admin-igx-gasdata/admin-igx-gasdata.component';
import { AdminIexProfilepictureComponent } from './admin-iex-profilepicture/admin-iex-profilepicture.component';
import { GeneratorGroupingComponent } from './generator-grouping/generator-grouping.component';
import { AdminGeneratorOutagesComponent } from './admin-generator-outages/admin-generator-outages.component';
import { NppIndiaMapComponent } from './npp-india-map/npp-india-map.component';
import { AdminRtm192Component } from './admin-rtm192/admin-rtm192.component';


@NgModule({
  declarations: [
    
    HeaderComponent,


    ClickOutsideDirective,
    AllowNumberDirective,
    SpecialCharacterDirective,
    TwoDigitDecimaNumberDirective,


    HomeComponent,
    AdminUsersComponent,

    AdminRolesComponent,

    UserProfileComponent,




    ChunkPipe,
    AdminMarketProviderComponent,
    AdminCountriesComponent,
    AdminRldcsComponent,
    AdminMarketAreasComponent,
    AdminStatesComponent,
    AdminIndividualEntitiesComponent,
    AdminMarketTypeComponent,
    AdminMarketHierarchyComponent,
    AdminStatusComponent,
    AdminModelWiseForecastComponent,
    AdminForecastVsActualComponent,
    AdminIndiaTendsComponent,
    AdminIgxGasdataComponent,
    AdminIexProfilepictureComponent,
    GeneratorGroupingComponent,
    AdminGeneratorOutagesComponent,
    NppIndiaMapComponent,
    AdminRtm192Component,

  ],
  imports: [
    CommonModule,
    RoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CanvasJSAngularChartsModule,
    ChartModule,
    PrimengModule,
    AutosizeModule,
    DragDropModule,
    NgxLoadingModule.forRoot({
      // animationType: ngxLoadingAnimationTypes.wanderingCubes,
      // animationType: ngxLoadingAnimationTypes.cubeGrid,
      // animationType: ngxLoadingAnimationTypes.threeBounce,
      // animationType: ngxLoadingAnimationTypes.chasingDots,
      // animationType: ngxLoadingAnimationTypes.doubleBounce,
      animationType: ngxLoadingAnimationTypes.circle,
      // animationType: ngxLoadingAnimationTypes.circleSwish,
      // animationType: ngxLoadingAnimationTypes.pulse,
      // animationType: ngxLoadingAnimationTypes.rectangleBounce,
      backdropBackgroundColour: "rgba(0,0,0,0.1)",
      backdropBorderRadius: "4px",
      primaryColour: "var(--gradient-color-one)",
      secondaryColour: "rgba(255,255,255,.5)",
      tertiaryColour: "white",
    }),
    NgxSliderModule
  ],
  providers: [ApiConfigService, CommonService, ConfirmationService, MessageService  ]
})
export class AdminModule { }
