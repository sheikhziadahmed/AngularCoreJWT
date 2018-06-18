import { Component, OnInit,OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit,OnDestroy {

  status: boolean;
  UserName:string;
 subscription:Subscription;
 nameSubscription:Subscription;

  constructor(private userService:UserService) {     
   }

   logout() {
     this.userService.logout();       
  }

  ngOnInit() {
    this.subscription = this.userService.authNavStatus$.subscribe(status => this.status = status);
    this.nameSubscription = this.userService.userName$.subscribe(Name=>this.UserName = Name);
    console.log(this.subscription );
    console.log(this.nameSubscription );
  }

   ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
    this.nameSubscription.unsubscribe();
  }
}
