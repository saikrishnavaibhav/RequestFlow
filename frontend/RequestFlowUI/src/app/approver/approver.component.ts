import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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

  showProgress = false;
  requests:Request[]=[];
  intiatedRequests:Request[]=[];
  inprogressRequests:Request[]=[];
  approvedRequests:Request[]=[];
  rejectedRequests:Request[]=[];
  logs: string[] = []; 

  logDataSource = new MatTableDataSource<string>([]);
  intiatedRequestsDataSource = new MatTableDataSource<Request>([]);
  inprogressRequestsDataSource = new MatTableDataSource<Request>([]);
  approvedRequestsDataSource = new MatTableDataSource<Request>([]);
  rejectedRequestsDataSource = new MatTableDataSource<Request>([]);

  @ViewChild('logPaginator') logPaginator:any = MatPaginator;
  @ViewChild('intiatedRequestsPaginator') intiatedRequestsPaginator:any = MatPaginator;
  @ViewChild('inprogressRequestsPaginator') inprogressRequestsPaginator:any = MatPaginator;
  @ViewChild('approvedRequestsPaginator') approvedRequestsPaginator:any = MatPaginator;
  @ViewChild('rejectedRequestsPaginator') rejectedRequestsPaginator:any = MatPaginator;

  allRequests:Request[]=[];
  user:any=null;
  category:String="INITIATED";
  logColumns = ['Log']
  initiatedColumns: string[] = ['Id', 'File name', 'Status', 'Date', 'Assign'];
  inprogressColumns: string[] = ['Id', 'File name', 'Status', 'Date', 'View'];

  constructor(public userService: UserService, private tokenService: TokenStorageService, private requestService: RequestService, private router: Router){}

  ngOnInit(): void {

    this.user = this.tokenService.getUser();
    this.showProgress = true;
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
        this.intiatedRequestsDataSource = new MatTableDataSource<Request>(this.intiatedRequests);
        this.intiatedRequestsDataSource.paginator = this.intiatedRequestsPaginator;
        
        this.inprogressRequestsDataSource = new MatTableDataSource<Request>(this.inprogressRequests);
        this.inprogressRequestsDataSource.paginator = this.inprogressRequestsPaginator;
        
        this.approvedRequestsDataSource = new MatTableDataSource<Request>(this.approvedRequests);
        this.approvedRequestsDataSource.paginator = this.approvedRequestsPaginator;
    
        this.rejectedRequestsDataSource = new MatTableDataSource<Request>(this.rejectedRequests);
        this.rejectedRequestsDataSource.paginator = this.rejectedRequestsPaginator;
      }, error => {
        console.error(error);
      }
    );

  this.userService.retrieveLogs().subscribe(
      data=> {
        let logs = data;
        for(let log of logs){
          this.logs.push(log.log);
        }

        this.logDataSource = new MatTableDataSource<string>(this.logs.reverse());
        this.logDataSource.paginator = this.logPaginator;
      },
      error=> {
        console.error(error);
      }
    );
    this.showProgress = false;
  }

  openRequest(request: any) {
    this.requestService.setRequest(request);
  }

  assignRequest(request: Request){
    this.showProgress = true;
    this.userService.assignRequest(this.user.id,request.id).subscribe(
      data=> {
        console.log(data);
        request.status="INPROGRESS";
        request.approvals = [data];
        this.inprogressRequests.push(request);
        console.log(this.inprogressRequests);
        this.allRequests.map(req => {
          if(req.id === request.id){
            return request;
          }
          return req;
        });
        this.intiatedRequests =  this.intiatedRequests.filter(ir => ir.id !== request.id);
        this.intiatedRequestsDataSource = new MatTableDataSource<Request>(this.intiatedRequests);
        this.intiatedRequestsDataSource.paginator = this.intiatedRequestsPaginator;
        
        this.inprogressRequestsDataSource = new MatTableDataSource<Request>(this.inprogressRequests);
        this.inprogressRequestsDataSource.paginator = this.inprogressRequestsPaginator;
      },
      error=>{
      console.error(error);
      }
    );
    this.showProgress = false;

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
