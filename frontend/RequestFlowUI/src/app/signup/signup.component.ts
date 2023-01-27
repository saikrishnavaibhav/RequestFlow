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

  constructor(public userService:UserService,private router: Router){}

  signup(){
    console.log(this.signupRequest);
    this.userService.signUpUser(this.signupRequest).subscribe(
      data=> {
        console.log("success");
        this.router.navigateByUrl("/login");
      },
      error=> {
        console.error("invalid request");
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
