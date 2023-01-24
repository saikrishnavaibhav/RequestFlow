import { Component, OnInit } from '@angular/core';
import { Request } from '../home/home.component';
import { CSVRecord } from '../new-request/new-request.component';
import { RequestService } from '../services/request.service';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-viewrequest',
  templateUrl: './viewrequest.component.html',
  styleUrls: ['./viewrequest.component.css']
})
export class ViewrequestComponent implements OnInit {
  isApprover = false;
  approved = false;
  showSuccess = false;
  showFailed = false;
  notApproved = false;
  request: Request={
    id: null,
    date:null,
    userId:null,
    file:null,
    fileName:null,
    status:null,
    approvals:null,
  }

  records:any[]=[];
  header:any[]=[];
  role:any[]=[];

  constructor(private requestService: RequestService, private tokenService: TokenStorageService, private userService: UserService){}
  
  ngOnInit(): void {
    this.request = this.requestService.getRequest();

    console.log(this.request.file);
    let fileData:any[] = this.request.file;

    this.header = fileData[0].split(",");
    this.header = this.header.map(this.toUpper);

    for(let req of fileData.splice(1)){
      let data:any = req.split(",");
      console.log(data);
      
      this.records.push(data);
    }
    console.log(this.tokenService.getUser().roles[0]);
    this.isApprover = this.tokenService.getUser().roles[0] === "ROLE_APPROVER";
    this.approved = this.request.status === "APPROVED";
  }

  toUpper = function(header : any){ 
    return header.toUpperCase();
  };

  submit(){

  }

  approve(approve:boolean){
    this.userService.approveRequest(this.tokenService.getUser().id, this.request.id,approve).subscribe(
      data=>{
        console.log(data);
        this.approved = true;
        this.showSuccess = true;

        setTimeout(() => {
          this.showSuccess=false;
        }, 2000);
      },
      error=>{
      console.error(error);
      this.showFailed = true;

        setTimeout(() => {
          this.showFailed=false;
        }, 2000);
      }
    );
  }
}
