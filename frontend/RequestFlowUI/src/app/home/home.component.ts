import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../services/request.service';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userRequests:Array<Request>=[];
  user:any=null;
  
  constructor(public userService: UserService, private tokenService: TokenStorageService, private requestService: RequestService, private router: Router){}

  ngOnInit(): void {

    this.user = this.tokenService.getUser();

    this.userService.getRequests(this.tokenService.getUser().id)
    .subscribe(
      data => {
        let requests:any = data;
        for(let req of requests){
          this.userRequests.push(req);
        }
        console.log(this.userRequests);
      }, error => {
        console.error(error);
      }
    )
  }

  openRequest(request: any) {
    console.log(request);
      this.requestService.setRequest(request);
  }

}

export class Request{
  id:any;
  date:any;
  userId:any;
  file:any;
  fileName:any;
  status:any;
  approvals:any;
}