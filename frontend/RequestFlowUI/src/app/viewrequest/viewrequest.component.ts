import { Component, OnInit } from '@angular/core';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { CSVRecord } from '../new-request/new-request.component';
import { RequestService } from '../services/request.service';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SubmitDialogComponent } from '../submit-dialog/submit-dialog.component';

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
  rejected = false;
  showApprove = true;
  showReject = true;
  successMessage = "";
  failureMessage = "";
  request: any;
  records:CSVRecord[]=[];
  header:any[]=[];
  role:any[]=[];
  headers:string[]=['ID','First Name', 'Last Name', 'Age', 'Salary'];

  constructor(private requestService: RequestService, private tokenService: TokenStorageService,
     private userService: UserService, private location: Location, private matDialog: MatDialog){}
  
  ngOnInit(): void {
    this.request = this.requestService.getRequest();

    console.log(this.request.file);
    let fileData:any[] = this.request.file;

    this.header = fileData[0].split(",");
    this.header = this.header.map(this.toUpper);

    for(let req of fileData.splice(1)){
      let currentRecord = req.split(",");
      let csvRecord:CSVRecord = {
        id:Number.parseInt(currentRecord[0]),
        firstName:currentRecord[1],
        lastName:currentRecord[2],
        age:Number.parseInt(currentRecord[3]),
        salary:Number.parseInt(currentRecord[4])
      }
      
      this.records.push(csvRecord);
    }
    this.isApprover = this.tokenService.getUser().roles[0] === "ROLE_APPROVER";
    
    if(this.request.status === "APPROVED"){
      this.approved = true;
      this.successMessage = "Request approved";
      this.showApproveRejectFalse();
    } else if(this.request.status === "REJECTED"){
      this.showFailed = true;
      this.failureMessage = "Request rejected";
      this.showApproveRejectFalse();
    }
  }

  toUpper = function(header : any){ 
    return header.toUpperCase();
  };

  approve(approve:boolean){
    let message = "";
    if(approve)
      message = "Sure to approve request?";
    else
      message = "Sure to reject request?";
    let submitDialog = this.matDialog.open(SubmitDialogComponent,{data: message});
    submitDialog.afterClosed().subscribe(
      result=> {
        if(result === 'true'){
          this.userService.approveRequest(this.tokenService.getUser().id, this.request.id,approve).subscribe(
            data=>{
              console.log(data);
              this.approved = true;
              this.showSuccess = true;
              if(approve){
                this.successMessage = "Request Approved";
                this.request.status = "APPROVED";
                this.request.approvals[0].status = "APPROVED";
              } else{
                this.successMessage = "Request Rejected";
                this.request.status = "REJECTED"
                this.request.approvals[0].status = "REJECTED";
              }
              this.showApproveRejectFalse();
              setTimeout(() => {
                this.showSuccess=false;
              }, 2000);
            },
            error=>{
            console.error(error);
              this.showReject = true;
            if(approve)
              this.failureMessage = "Request Approve failed";
            else
              this.failureMessage = "Request Reject failed";
              this.showApproveRejectTrue();
              setTimeout(() => {
                this.showFailed=false;
              }, 2000);
            }
          );
        }
      });
  }

  showApproveRejectFalse(){
    this.showApprove = false;
    this.showReject = false;
  }

  showApproveRejectTrue(){
    this.showFailed = true;
    this.showApprove = true;
  }

  back(){
    this.location.back();
  }

  downloadAsCsv(){
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      useBom: true,
      noDownload: false,
      headers: this.headers
    };
   
    new ngxCsv(this.records, 'Request_'+this.request.id, options);
  }
  
}
