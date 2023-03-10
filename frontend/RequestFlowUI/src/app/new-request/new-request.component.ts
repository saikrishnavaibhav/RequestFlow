import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';
import { SubmitDialogComponent } from '../submit-dialog/submit-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements AfterViewInit{

  file:any;
  fileType:any;
  fileName:string="";
  isSubmitSuccess = false;
  isSubmitFailure = false;
  showProgress = false;
  showTable = false;
  records:CSVRecord[]=[];
  recordsDataSource = new MatTableDataSource<CSVRecord>([]);
  headers:string[]=['ID','First Name', 'Last Name', 'Age', 'Salary'];
  @ViewChild('paginator') paginator:any = MatPaginator;
  @ViewChild('csvReader') csvReader: any;

  constructor(public userService: UserService, public tokenService: TokenStorageService, 
    private router: Router, private matDialog: MatDialog, private matSnackBar: MatSnackBar, private location: Location){}
  ngAfterViewInit(): void {
    
  }

  fileChanged(e:any) {
      this.file = e.target.files[0];
      console.log(this.file);
      this.fileName = this.file.name;
      this.verifyCSV(); 
  }

  verifyCSV() {
    if(this.file.name.endsWith(".csv")){
      this.fileType = "CSV";
    } else {  
      alert("Please import valid .csv file.");  
      this.fileReset();  
    }
  }

  browseFiles(){
    let fileReader = new FileReader();
    
    if(this.fileType==="CSV"){
      fileReader.readAsText(this.file);
      fileReader.onload = (e) => {

      let csvData = fileReader.result;  
      let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
      this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
      this.recordsDataSource = new MatTableDataSource<CSVRecord>(this.records);   
      this.recordsDataSource.paginator = this.paginator;
      this.showTable = true;
    };
      
    fileReader.onerror = function () {  
      console.log('error is occured while reading file!');  
    };  

    } 
  }  
  
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any) {  
    let csvArr:CSVRecord[] = [];  
    for (let i = 1; i < csvRecordsArray.length; i++) {  
      if(csvRecordsArray[i] !== ''){
        let currentRecord:string[] = (<string>csvRecordsArray[i]).split(',');
        if(!currentRecord.includes('')){
        let csvRecord:CSVRecord = {
          id:Number.parseInt(currentRecord[0]),
          firstName:currentRecord[1],
          lastName:currentRecord[2],
          age:Number.parseInt(currentRecord[3]),
          salary:Number.parseInt(currentRecord[4])
        }
        csvArr.push(csvRecord);
        } else {
          this.matSnackBar.open("Error: Invalid fields in the selected file", "Dismiss",{duration:5000});
          return [];
        }
      }
    }  
    return csvArr;  
  }  
  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  } 

  fileReset() {  
    this.csvReader.nativeElement.value = "";  
    this.records = [];  
  }  

  submit(){

    let submitDialog = this.matDialog.open(SubmitDialogComponent, {data: ["Proceed with submitting request?","Submit"]});
    
    submitDialog.afterClosed().subscribe(
      result=> {
        if(result === 'true'){
          this.showProgress = true;
          this.userService.submitFileForApproval(this.file, this.tokenService.getUser().id).subscribe(
            data => {
              this.recordsDataSource = new MatTableDataSource<CSVRecord>([]);
              this.showProgress = false;
              this.fileReset();
              this.isSubmitSuccess = true;
              this.matSnackBar.open("Request created successfully", "Dismiss",{duration:4000});
              setTimeout(() => {
                this.isSubmitSuccess = false;
                this.router.navigateByUrl("/home");
              }, 4000);
            },
            error => {
              this.showProgress = false;
              console.error(error);
              this.isSubmitFailure = true;
              this.matSnackBar.open("Failed to create request", "Dismiss",{duration:3000});
              setTimeout(() => {
                this.isSubmitFailure = false;
              }, 3000);
            }
          );
        }
      }
    );
    
  }

  fileDropped(file:any){
    this.file = file;
    console.log(this.file);
    this.fileName = this.file.name;
    this.verifyCSV(); 
  }

  back(){
    this.location.back();
  }
}

export interface CSVRecord{
  id:number,
  firstName:string,
  lastName:string,
  age:number,
  salary:number
}