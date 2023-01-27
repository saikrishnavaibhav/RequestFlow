import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { HomeComponent } from './home/home.component';
import { ApproverComponent } from './approver/approver.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { ViewrequestComponent } from './viewrequest/viewrequest.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { DragDirective } from './drag.directive';
import {MatDialogModule} from '@angular/material/dialog';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';
import { SubmitDialogComponent } from './submit-dialog/submit-dialog.component';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    NewRequestComponent,
    HomeComponent,
    ApproverComponent,
    ViewrequestComponent,
    DragDirective,
    LogoutDialogComponent,
    SubmitDialogComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule
  ],
  entryComponents:[LogoutDialogComponent],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
