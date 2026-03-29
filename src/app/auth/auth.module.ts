import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../auth/login/login.component';
import { RoutingModule } from './routing/routing.module';
import { PrimengModule } from '../primeng-module/primeng.module';
import { AuthServices } from './auth.service';
import { GlobalService } from '../services/global.service';
import { HttpService } from '../services/http.service';
import { CommonUtilityService } from '../services/common-utility.service';
import { ToastModule } from 'primeng/toast';





@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    RoutingModule,
    PrimengModule,
    ToastModule
    ],
  exports: [],
  providers:[AuthServices]
})

export class AuthModule { }
