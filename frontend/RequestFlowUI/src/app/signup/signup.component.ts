import { Component } from '@angular/core';
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

  constructor(public userService:UserService,private router: Router){}

  signup(){
    console.log(this.signupRequest);
    this.userService.signUpUser(this.signupRequest).subscribe(
      data=> {
        this.isSignupSuccess = true;
        setTimeout(() => {
          this.isSignupSuccess = false;
          this.router.navigateByUrl("/login");
        }, 2000);
        console.log("signup success");
      },
      error=> {
        console.error("invalid request");
        this.isSignupFailed = true;
        setTimeout(() => {
          this.isSignupFailed = false;
        }, 2000);
      }
    );
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
