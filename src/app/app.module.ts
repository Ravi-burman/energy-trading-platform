import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { PrimengModule } from './primeng-module/primeng.module';
import { RouterGuardService } from './services/router-guard.service';
import { CommonUtilityService } from './services/common-utility.service';
import { HttpService } from './services/http.service';
import { AppComponent } from './app.component';
import { GlobalService } from './services/global.service';
import { AutosizeModule } from 'ngx-autosize';
import { CommonService } from './admin/services/common.service';
import { ApiConfigService } from './admin/services/api-config.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedService } from './admin/services/shared.service';
import { HeaderService } from './admin/services/header.service';
import { ConfirmationService } from 'primeng/api';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AuthServices } from './auth/auth.service';
import { ToastModule } from 'primeng/toast';
import { PlotlyModule } from 'angular-plotly.js';
import { MaterialModule } from './material-module/material.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    PrimengModule,
    HttpClientModule,
    AutosizeModule,
    DragDropModule,
    MaterialModule,
    // NgxLoadingModule
    
    // QuillModule.forRoot(),
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
  NgxSliderModule,
  PlotlyModule,
  ToastModule

],
  providers: [
    ConfirmationService,
    GlobalService,
    RouterGuardService,
    CommonUtilityService,
    HttpService,
    CommonService,
    ApiConfigService,
     SharedService,
     HeaderService,
     AuthServices,
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
