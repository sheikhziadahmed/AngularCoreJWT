import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule }   from '../shared/modules/shared.module';
 
import { UserService }  from '../shared/services/user.service';

import { EmailValidator } from '../directives/email.validator.directive';

import { routing }  from './account.routing';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { FacebookLoginComponent } from './facebook-login/facebook-login.component';
import { 
  MatStepperModule,MatNativeDateModule,MatDatepickerModule,MatButtonModule,MatSidenavModule,MatCardModule,MatToolbarModule,MatFormFieldModule,MatInputModule,MatIconModule, MatCheckboxModule, MatSelectModule,MatDividerModule,MatAutocompleteModule
} from '@angular/material';


@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,FormsModule,routing,SharedModule, 
    MatStepperModule,MatNativeDateModule,MatDatepickerModule,MatSidenavModule,MatAutocompleteModule,MatButtonModule, MatCardModule,MatToolbarModule, MatFormFieldModule, MatInputModule, MatIconModule, MatCheckboxModule, MatSelectModule, MatDividerModule
  ],
  declarations: [RegistrationFormComponent,EmailValidator, LoginFormComponent, FacebookLoginComponent],
  providers:    [ UserService ]
})
export class AccountModule { }
