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

  userRequests:Request[]=[];
  user:any=null;
  displayedColumns: string[] = ['Id', 'File name', 'Status', 'Date', 'View Request'];
  
  constructor(public userService: UserService, private tokenService: TokenStorageService, private requestService: RequestService, private router: Router){}

  ngOnInit(): void {

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
          this.filterRequests();
        }
        console.log(this.userRequests);
      }, error => {
        console.error(error);
      }
    );
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