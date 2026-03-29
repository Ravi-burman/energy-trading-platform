import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private global: GlobalService,
              private router: Router,
              ){
    this.global.onInvalidApiToken.subscribe(data => {
      this.global.logout();
      this.router.navigate(['/login']);
    });
    this.global.onLogOut.subscribe(data => {
      this.router.navigate(['/login']);
    });
  }
  title = 'DGR';
  value2: any;

}
