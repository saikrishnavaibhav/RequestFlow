import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupRequest = new SignupRequest();

  constructor(public userService:UserService){}

  signup(){
    console.log(this.signupRequest);
    this.userService.signUpUser(this.signupRequest).subscribe(
      data=> {
        console.log("success");
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
