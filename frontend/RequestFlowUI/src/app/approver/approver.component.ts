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
  requests:Request[]=[];
  intiatedRequests:Request[]=[];
  inprogressRequests:Request[]=[];
  approvedRequests:Request[]=[];
  rejectedRequests:Request[]=[];
  allRequests:Request[]=[];
  user:any=null;
  category:String="INITIATED";
  initiatedColumns: string[] = ['Id', 'File name', 'Status', 'Date', 'Assign'];
  inprogressColumns: string[] = ['Id', 'File name', 'Status', 'Date', 'View'];

  constructor(public userService: UserService, private tokenService: TokenStorageService, private requestService: RequestService, private router: Router){}

  ngOnInit(): void {

    this.user = this.tokenService.getUser();
    this.userService.getAllRequests()
    .subscribe(
      data => {
        let requests:any = data;
        for(let req of requests){
          this.allRequests.push(req);
          if(req.status === 'INITIATED')
            this.intiatedRequests.push(req);
          else if(req.status === 'INPROGRESS')
            this.inprogressRequests.push(req);
          else if(req.status === 'APPROVED')
            this.approvedRequests.push(req);
          else if(req.status === 'REJECTED')
            this.rejectedRequests.push(req);
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
          approverId : this.user.id,
          approver: this.user.firstName + ", " + this.user.lastName,
          status: "INPROGRESS"
          
        }]
       this.intiatedRequests =  this.intiatedRequests.filter(ir => ir.id !== request.id);
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

  changeCategory(category: String){
    this.category = category;
    this.requests = this.allRequests
    .filter( req => req.status === category) ;

  }

}
