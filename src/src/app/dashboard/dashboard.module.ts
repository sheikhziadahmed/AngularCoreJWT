import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule }       from '../shared/modules/shared.module';

import { routing }  from './dashboard.routing';
import { RootComponent } from './root/root.component';
import { HomeComponent } from './home/home.component';
import { DashboardService } from './services/dashboard.service';

import { AuthGuard } from '../auth.guard';
import { SettingsComponent } from './settings/settings.component';
import { AdminComponent } from './admin/admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  MatButtonModule,MatSidenavModule,MatCardModule,MatToolbarModule,MatFormFieldModule,MatInputModule,MatIconModule, MatCheckboxModule, MatSelectModule,MatDividerModule,MatAutocompleteModule
} from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    SharedModule,
    ReactiveFormsModule,
    MatButtonModule,MatSidenavModule,MatCardModule,MatToolbarModule,MatFormFieldModule,MatInputModule,MatIconModule, MatCheckboxModule, MatSelectModule,MatDividerModule,MatAutocompleteModule
    
  ],
  declarations: [RootComponent,HomeComponent, SettingsComponent, AdminComponent],
  exports:      [ ],
  providers:    [AuthGuard,DashboardService]
})
export class DashboardModule { }
