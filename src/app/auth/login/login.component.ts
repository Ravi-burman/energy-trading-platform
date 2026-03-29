import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/admin/services/common.service';
import { CommonUtilityService } from 'src/app/services/common-utility.service';
import { AuthServices } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[MessageService]
})
export class LoginComponent {
  loading: boolean;
  data:any={};
  showPassword: boolean = false;

 
  constructor(private route: Router,
    private messageService: MessageService, 
    private commonService: CommonService,
    private commonUtilityService: CommonUtilityService,
    private authService: AuthServices,){

  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  login(form:NgForm){
    if (form.invalid) {
      return;
    }
    this.loading = true;
    const data = form.value;
    const val = btoa(data.email_address + ':' + data.password);
    this.authService.login({data})
      .subscribe((res) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.route.navigate(['/home']);
          this.authService.login(res);
          this.loading = false;
         this.authService.setLocalItem('loginUser', res.data, true);
         
        } else {
          this.commonUtilityService.singleErrorMsg(res.data);
          this.loading = false;
        }
      }, (err: any) => {
        this.commonUtilityService.showErrorMessage(err);
        this.loading = false;
        
      });
      
      
  }

  // onToastClose(){
  //   this.route.navigate(['/home']);
  // }
}
  
