import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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

  showProgress = false;
  userRequestsDataSource = new MatTableDataSource<Request>([]);
  userRequests:Request[]=[];
  logs: string[] = []; 
  logDataSource = new MatTableDataSource<string>([]);
  user:any=null;
  displayedColumns: string[] = ['Id', 'File name', 'Status', 'Date', 'View Request'];
  logColumns = ['Log']
  @ViewChild('paginator') paginator:any = MatPaginator;
  @ViewChild('logPaginator') logPaginator:any = MatPaginator;
  
  constructor(public userService: UserService, private tokenService: TokenStorageService, private requestService: RequestService, private router: Router){}

  ngOnInit(): void {
    this.showProgress = true;
    this.user = this.tokenService.getUser();

    this.userService.getRequests(this.tokenService.getUser().id)
    .subscribe(
      data => {
        let requests:any = data;
        for(let req of requests){
          let request:Request={
            id:req.id,
            date:req.date,
            userId:req.userId,
            file:req.file,
            fileName:req.fileName,
            status:req.status,
            approvals:req.approvals
          }
          this.userRequests.push(request);
          //this.filterRequests();
        }
        this.userRequestsDataSource = new MatTableDataSource<Request>(this.userRequests);
        this.userRequestsDataSource.paginator = this.paginator;
        console.log(this.userRequests);
      }, error => {
        if(error instanceof HttpErrorResponse){
          if(error.status === 0){
            
          }
        }
        console.error("getRequests Error:");
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
  filterRequests() {
    this.userRequests = this.userRequests.filter(ur => ur.fileName !== null && ur.userId !== null);
  }

  openRequest(request: any) {
    console.log(request);
    this.requestService.setRequest(request);
  }

}

export interface Request{
  id:number;
  date:string;
  userId:number;
  file:any;
  fileName:string;
  status:string;
  approvals:any;
}