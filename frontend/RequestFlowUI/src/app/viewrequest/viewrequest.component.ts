import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { CSVRecord } from '../new-request/new-request.component';
import { RequestService } from '../services/request.service';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SubmitDialogComponent } from '../submit-dialog/submit-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-viewrequest',
  templateUrl: './viewrequest.component.html',
  styleUrls: ['./viewrequest.component.css']
})
export class ViewrequestComponent implements OnInit, AfterViewInit {
  isApprover = false;
  approved = false;
  showSuccess = false;
  showFailed = false;
  rejected = false;
  showApprove = true;
  showReject = true;
  showProgress = false;
  successMessage = "";
  failureMessage = "";
  remark = "";
  request: any;
  dataSource:any;
  records:CSVRecord[]=[];
  header:any[]=[];
  role:any[]=[];
  headers:string[]=['ID','First Name', 'Last Name', 'Age', 'Salary'];
  @ViewChild(MatPaginator) paginator:any = MatPaginator;

  constructor(private requestService: RequestService, private tokenService: TokenStorageService,
      private userService: UserService, private location: Location, private matDialog: MatDialog){}
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  
  ngOnInit(): void {
    this.showProgress = true;
    this.request = this.requestService.getRequest();
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
    this.dataSource = new MatTableDataSource<CSVRecord>(this.records);
    
    
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
    this.showProgress= false;
  }

  toUpper = function(header : any){ 
    return header.toUpperCase();
  };

  approve(approve:boolean){
    let data = [];
    if(approve){
      data.push("Sure to approve request?");
      data.push("Approve");
    } else{
      data.push("Sure to reject request?");
      data.push("Reject");
    }
    let submitDialog = this.matDialog.open(SubmitDialogComponent,{data: data});
    submitDialog.afterClosed().subscribe(
      result=> {
        if(result === 'true'){
          this.showProgress = true;
          this.userService.approveRequest(this.tokenService.getUser().id, this.request.id,approve, this.remark).subscribe(
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
          this.showProgress = false;
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
