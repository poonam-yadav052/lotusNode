import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateComponent } from './components/create/create.component';
import { UserDisplayComponent } from './components/usersDisplay/userDisplay.component';

import { DialogContentExampleDialog } from './popModels/comPopup.component';

import { AgencyManagement } from './components/AgencyManagement/agencyManagement.component';
import { EditComponent } from './components/edit/edit.component';

import { RouterModule, Routes } from '@angular/router';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { HttpClientModule } from '@angular/common/http';
import { AdunitService } from './adunit.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import {
  MatButtonModule, MatNativeDateModule, MatIconModule, MatSidenavModule, MatListModule, MatToolbarModule } from '@angular/material';
import { CustomMaterialModule } from "./core/material.module";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';


const appRoutes: Routes = [
  { path: '', component: UserDisplayComponent, data: { title: 'Users Component' } },
  { path: 'create', component: CreateComponent, data: { title: 'Create' } },
  { path: 'edit', component: EditComponent, data: { title: 'Edit Component' } },
  { path: 'usersDisplay', component: UserDisplayComponent, data: { title: 'Users Component' } }  
];


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    CreateComponent,
    UserDisplayComponent,
    AgencyManagement,
    EditComponent,
    DialogContentExampleDialog
    // Article,
    
    // ArticleService
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes,
      { useHash: true }),
    SlimLoadingBarModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule, 
    MatNativeDateModule, 
    MatIconModule, 
    MatSidenavModule, 
    MatListModule,
    CustomMaterialModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxSmartModalModule.forRoot()
  ],
  exports: [ 
    MatButtonModule, 
    MatToolbarModule, 
    MatNativeDateModule, 
    MatIconModule, 
    MatSidenavModule, 
    MatListModule,
    ],
  providers: [ AdunitService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
