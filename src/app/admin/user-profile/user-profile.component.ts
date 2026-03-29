import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from '../services/common.service';
import { CommonUtilityService } from 'src/app/services/common-utility.service';
import { AuthServices } from 'src/app/auth/auth.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers:[MessageService]
})
export class UserProfileComponent {
  @ViewChild('fileDropRef') fileDropRef: ElementRef | any;
  @ViewChild('fileDropRef1') fileDropRef1: ElementRef | any;
  editView : boolean = false;
  profileView : boolean = true;
  submitted:boolean=false;
  user: any = {};
  userObj: any = {};
  loading: boolean;
  files: any[] = [];
  phoneNumber:string='';
  attachmentLoading: boolean;
  getUserByIdLoading: boolean;
  profilePicUrl: any;
  getCountryCodesLoading: boolean;
  countryCodes: any;
  getUserById$Subscription: any;

  constructor(private sharedDataService: SharedService, 
    private commonService: CommonService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
    private commonUtilityService: CommonUtilityService,
    private authService: AuthServices,){
      let loginDta= this.authService.getLocalItem('loginUser',true);
      this.getUserById$Subscription = this.commonService.getUserById$.subscribe((res) => {
        this.getUserById(loginDta.id);   
      });
    }

  ngOnInit(){
   let loginDta= this.authService.getLocalItem('loginUser',true);
    this.getUserById(loginDta.id);
    // this.getCountryCodes();
  }

  getUserById(id){
    this.getUserByIdLoading = true;
    this.commonService.getUserById(id).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.user = res.data.user;
        // this.user.first_name = res.data.user.first_name; 
        // this.user.last_name = res.data.user.last_name;
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

  countryChange(){
    this.userObj.mobile='';
  }
  
  submitProfile(form:NgForm,user){
    if (form.invalid) {
      return;
    }
    this.submitted = true;
    let data=form.value;
      data.id=user.id;
      data.profile_image=user.profile_image;
      // data.digital_signature=user.digital_signature;
      data.first_name=user.first_name;
      data.last_name=user.last_name;
      data.role_id = user.role_id;
      // data.country_code=form.value.country_code.country_code;
      this.loading = true;
      this.commonService.updateProfile(
        {
          data,
          headers: {
          }
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.profileView=true;
          this.editView=false;
        this.loading = false;
        this.commonService.getUserById$.emit(res.data.user.id);
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.loading = false;
      }
    }, (err: any) => {
      this.loading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
  }


  editProfile(user){
    this.userObj=user;
    this.profileView=false;
    this.editView=true;
    // const seletedCountry = this.countryCodes.filter((b: any) => {
    //   if (b.country_code === user.country_code) {
    //     return b;
    //   }
    // })
    // this.userObj.selectedCountryCode=seletedCountry[0];
  }

  cancel(userObj){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Cancel?',
      header: 'Confirmation',
      accept: () => {
        this.profileView=true;
        this.editView=false;
        this.getUserById(userObj.id)
          },
          reject: (type: any) => {
          }
    });  
   
  }


  // fileBrowseHandler(event,user) {
  //   if (event.target.files && event.target.files[0]) {
  //     const maxFileSizeMB = 2;
  //     console.log('event.target.files[0]',event.target.files[0])
  //   if (event.target.files[0].size > maxFileSizeMB * 1024 * 1024) {
  //     this.messageService.add({ severity: 'error', detail: ' The file size is exceeded the max limit of 2MB.' });
  //      this.fileDropRef.value = ''; 
  //     return;
  //   }
   
  //     const reader = new FileReader();
  //     reader.onload = (evnt: any) => {          
  //     };
  //     reader.readAsDataURL(event.target.files[0]);
  //     this.attachmentLoading = true;
  //     this.commonService.uploadProfilePic({ file: event.target.files[0] },{user_id: user.id}).subscribe(
  //       res => {
  //         if (res && res.status === this.commonUtilityService.SUCCESS) {
  //           this.userObj.profile_image=res.data.url;
  //           this.profilePicUrl=res.data.url;
  //           console.log('this.userObj',this.userObj);          
            
  //         } else {
  //           this.commonUtilityService.showErrorMessage(res);
  //         }
  //         this.attachmentLoading = false;
  //       },
  //       err => {
  //         this.attachmentLoading = false;
  //         this.commonUtilityService.showErrorMessage(err);
  //       }
  //     );
     
  //     // this.replaceFileInput();
  //   }
  
  // }

  // fileBrowseHandlerSign(event,user) {
  //   if (event.target.files && event.target.files[0]) {
  //     const maxFileSizeMB = 2;

  //   if (event.target.files[0].size > maxFileSizeMB * 1024 * 1024) {
  //     this.messageService.add({ severity: 'error', detail: 'The file size is exceeded the max limit of 2MB.' });
  //      this.fileDropRef.value = ''; 
  //     return;
  //   }
  //     const reader = new FileReader();
  //     reader.onload = (evnt: any) => {          
  //     };
  //     reader.readAsDataURL(event.target.files[0]);
  //     this.attachmentLoading = true;
  //     this.commonService.uploadSignature({ file: event.target.files[0] },{user_id: user.id}).subscribe(
  //       res => {
  //         if (res && res.status === this.commonUtilityService.SUCCESS) {
  //           console.log('----------',res)
  //           this.userObj.digital_signature=res.data.url;
  //         } else {
  //           this.commonUtilityService.showErrorMessage(res);
  //         }
  //         this.attachmentLoading = false;
  //       },
  //       err => {
  //         this.attachmentLoading = false;
  //         this.commonUtilityService.showErrorMessage(err);
  //       }
  //     );
  //   }
  //   this.fileDropRef1.nativeElement.value = '';
  // }

  onCountryChange(country: string) {
    
    this.sharedDataService.setCountryValue(country);
  }
}
