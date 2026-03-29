import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { CommonUtilityService } from './common-utility.service';
import { GlobalService } from './global.service';

@Injectable()
export class RouterGuardService implements CanActivate{

  
    constructor(public auth: CommonUtilityService,public global: GlobalService, public router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      
      if (!this.global.hasLoginSession()) {
        this.router.navigate(['login']);
        return false;
      }
      return true;
    }
}
