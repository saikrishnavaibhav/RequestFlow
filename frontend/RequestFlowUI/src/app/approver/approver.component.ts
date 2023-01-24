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
    this.requestService.setRequest(request);
  }

  assignRequest(request: Request){
    this.userService.assignRequest(this.user.id,request.id).subscribe(
      data=> {
        request.status="INPROGRESS"
        request.approvals = [{
          approverId : this.user.id
        }]
      },
      error=>{
      console.error(error);
      }
    );

  }

  checkAssignee(request: Request){
    let approvals:any[] = request.approvals;
    for(let approver of approvals){
      if(approver.approverId === this.user.id){
        return true;
      }
    }
    
    return false;
  }

}
