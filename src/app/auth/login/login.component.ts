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
  // Test credentials for development
  private readonly TEST_CREDENTIALS = {
    email: 'admin@energysync.com',
    password: 'admin123'
  };

 
  constructor(private route: Router,
    private messageService: MessageService, 
    private commonService: CommonService,
    private commonUtilityService: CommonUtilityService,
    private authService: AuthServices,){
    // Auto-fill test credentials for development
    this.data.email_address = this.TEST_CREDENTIALS.email;
    this.data.password = this.TEST_CREDENTIALS.password;
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
    
    // Check if using test credentials for development
    const isTestCredentials = data.email_address === this.TEST_CREDENTIALS.email && 
                            data.password === this.TEST_CREDENTIALS.password;
    
    const loginObservable = isTestCredentials 
      ? this.authService.mockLogin()
      : this.authService.login({data});
    
    loginObservable.subscribe((res) => {
        if (res && (res.status === 'Success' || res.status === this.commonUtilityService.SUCCESS)) {
          this.commonUtilityService.showSuccessMessage(res.data.message || 'Login successful');
          // Store login user info
          this.authService.setLocalItem('loginUser', res.data, true);
          // Store auth token
          this.authService.setLocalItem('gtmsauth', res, true);
          this.authService.init();
          this.route.navigate(['/home']);
          this.loading = false;
         
        } else {
          this.commonUtilityService.singleErrorMsg(res?.data?.message || 'Login failed');
          this.loading = false;
        }
      }, (err: any) => {
        this.commonUtilityService.showErrorMessage(err?.error?.message || 'Login error');
        this.loading = false;
        
      });
      
      
  }

  // onToastClose(){
  //   this.route.navigate(['/home']);
  // }
}
  
