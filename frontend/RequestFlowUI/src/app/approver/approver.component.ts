import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Request } from '../home/home.component';
import { RequestService } from '../services/request.service';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-approver',
  templateUrl: './approver.component.html',
  styleUrls: ['./approver.component.css']
})
export class ApproverComponent implements OnInit {
  requests:Array<Request>=[];
  user:any=null;

  constructor(public userService: UserService, private tokenService: TokenStorageService, private requestService: RequestService, private router: Router){}

  ngOnInit(): void {

    this.user = this.tokenService.getUser();

    this.userService.getAllRequests()
    .subscribe(
      data => {
        let requests:any = data;
        for(let req of requests){
          this.requests.push(req);
        }
        console.log(this.requests);
      }, error => {
        console.error(error);
      }
    )
  }

  openRequest(request: any) {
    console.log(request);
      this.requestService.setRequest(request);
  }

  assignRequest(reqId: number){
    this.userService.assignRequest(this.tokenService.getUser().id,reqId).subscribe(
      data=> {
        console.log(data);
      },
      error=>{
      console.error(error);
      }
    );
  }

}
