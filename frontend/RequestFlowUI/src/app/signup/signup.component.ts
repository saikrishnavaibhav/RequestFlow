import { Location } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupRequest = new SignupRequest();
  isSignupFailed = false;
  isSignupSuccess = false;
  failedMessage = '';
  showProgress= false;
  roles: Roles[] = [
    {value: 'ROLE_REQUESTOR', viewValue: 'Requestor'},
    {value: 'ROLE_APPROVER', viewValue: 'Approver'},
    {value: 'ROLE_ADMIN', viewValue: 'Admin'}

  ];
  
  constructor(public userService:UserService,private router: Router, private matSnackBar: MatSnackBar, private location: Location){}

  signup(){
    console.log(this.signupRequest);
    this.showProgress = true;
    this.userService.signUpUser(this.signupRequest).subscribe(
      data=> {
        this.signupRequest = new SignupRequest();
        this.showProgress = false;
        this.isSignupSuccess = true;
        this.matSnackBar.open("User registered successfully", "Dismiss",{duration:2000});
        setTimeout(() => {
          this.isSignupSuccess = false;
          this.router.navigateByUrl("/login");
        }, 2000);
        console.log("signup success");
      },
      error=> {
        this.showProgress = false;
        this.matSnackBar.open("User registeration failed", "Dismiss",{duration:5000});
        console.error("invalid request");
        console.error(error);
        this.failedMessage = error.error.message;
        this.isSignupFailed = true;
        setTimeout(() => {
          this.isSignupFailed = false;
        }, 5000);
      }
    );
  }

  back(){
    this.location.back();
  }

}

export class SignupRequest{
  public firstName:any;
  public lastName:any;
  public userName:any;
  public emailId:any;
  public password:any;
  public role:any;
}

interface Roles {
  value: string;
  viewValue: string;
}
