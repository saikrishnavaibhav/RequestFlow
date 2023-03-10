import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit  {
  loginRequest: any = {
    userName: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  showProgress = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private userService: UserService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      if("ROLE_REQUESTOR" === this.roles[0]) {
        this.router.navigateByUrl('/home');
      } else if("ROLE_APPROVER" === this.roles[0]){
        this.router.navigateByUrl('/approver');   
      } else if("ROLE_ADMIN" === this.roles[0]){
        this.router.navigateByUrl('/admin');   
      }
    }
  }

  onSubmit(): void {
    this.showProgress = true;
    this.userService.login(this.loginRequest).subscribe(
      data => {
        this.showProgress = false;
        this.tokenStorage.saveToken(data);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.loadProfile();
      },
      error => {
        this.showProgress = false;
        this.isLoginFailed = true;
        if(error instanceof HttpErrorResponse){
          if(error.status === 401){
            this.errorMessage = "Invalid credentials";
          }
        }
      }
    );
  }

  loadProfile(): void {
    window.location.reload();
  }
}
