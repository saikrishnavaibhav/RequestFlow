import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ApproverComponent } from './approver/approver.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { SignupComponent } from './signup/signup.component';
import {ViewrequestComponent} from './viewrequest/viewrequest.component'

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent },
  { path: 'newRequest', component: NewRequestComponent },
  { path: 'viewRequest/:Id', component: ViewrequestComponent },
  { path: 'approver', component: ApproverComponent },
  { path: 'admin', component: AdminComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
