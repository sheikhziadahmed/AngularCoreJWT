import { Subscription } from 'rxjs';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Credentials } from '../../shared/models/credentials.interface';
import { UserService } from '../../shared/services/user.service';
import { fadeInAnimation,slideInOutAnimation } from '../../shared/animations/index';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  animations: [fadeInAnimation],
 
  // attach the slide in/out animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' }
})

export class LoginFormComponent implements OnInit, OnDestroy {

  
  private authWindow: Window;
  failed: boolean;
  error: string;
  errorDescription: string;
  loginType:string;
  

  launchFbLogin() {
    this.loginType = "facebook";
    this.authWindow = window.open('https://www.facebook.com/v2.11/dialog/oauth?&response_type=token&display=popup&client_id=1528751870549294&display=popup&redirect_uri=http://localhost:5000/facebook-auth.html&scope=public_profile,email,user_location,user_birthday',null,'width=600,height=400');    
  }

  launchGoogleLogin() {
    this.loginType = "google";
    this.authWindow = window.open('https://accounts.google.com/o/oauth2/v2/auth?client_id=60077951100-41qale65poduq6uelg7n129uvie3mogd.apps.googleusercontent.com&redirect_uri=http://localhost:5000/google-auth.html&scope=openid%20profile%20email%20address&response_type=code&prompt=consent&include_granted_scopes=true',null,'width=600,height=400');    
  }

  private subscription: Subscription;

  brandNew: boolean;
  errors: string;
  isRequesting: boolean;
  submitted: boolean = false;
  credentials: Credentials = { email: '', password: '' };

  constructor(private userService: UserService, private router: Router,private activatedRoute: ActivatedRoute) {if (window.addEventListener) {
    window.addEventListener("message", this.handleMessage.bind(this), false);  
  } else { 
     (<any>window).attachEvent("onmessage", this.handleMessage.bind(this));
  }  }

    ngOnInit() {

    // subscribe to router event
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
         this.brandNew = param['brandNew'];   
         this.credentials.email = param['email'];         
      });      
  }

   ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }

  login({ value, valid }: { value: Credentials, valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors='';
    if (valid) {
      this.userService.login(value.email, value.password)
        .finally(() => this.isRequesting = false)
        .subscribe(
        result => {         
          if (result) {
             this.router.navigate(['/dashboard/home']);             
          }
        },
        error => this.errors = error);
    }
  }
  handleMessage(event: Event) {
    const message = event as MessageEvent;
    // Only trust messages from the below origin.
    // if (message.origin !== "http://localhost:5000"  && message.origin !== "http://localhost:4200") return;  

    this.authWindow.close();    
    const result = JSON.parse(message.data);
    
    if (!result.status)
    {
      this.failed = true;
      this.error = result.error;
      this.errorDescription = result.errorDescription;
    }
    else
    {
      this.failed = false;
      this.isRequesting = true;
      
      if(this.loginType == "facebook"){
        this.userService.facebookLogin(result.accessToken)
        .finally(() => this.isRequesting = false)
        .subscribe(
        result => {
          if (result) {
            this.router.navigate(['/dashboard/home']);
          }
        },
        error => {
          this.failed = true;
          this.error = error;
        }); 
      }
      else if(this.loginType == "google")
      {
        
        this.userService.googleLogin(result.code)
        .finally(() => this.isRequesting = false)
        .subscribe(
        result => {
          if (result) {
            this.router.navigate(['/dashboard/home']);
          }
        },
        error => {
          this.failed = true;
          this.error = error;
        });      
      }      
       
    }
  }
}
