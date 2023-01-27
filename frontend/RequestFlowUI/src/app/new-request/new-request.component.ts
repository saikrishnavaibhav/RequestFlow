import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';
import { SubmitDialogComponent } from '../submit-dialog/submit-dialog.component';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent {

  file:any;
  fileType:any;
  fileName:string="";
  isSubmitSuccess = false;
  isSubmitFailure = false;
  records:CSVRecord[]=[];
  headers:string[]=['ID','First Name', 'Last Name', 'Age', 'Salary'];
  @ViewChild('csvReader') csvReader: any;

  constructor(public userService: UserService, public tokenService: TokenStorageService, private router: Router, private matDialog: MatDialog){}

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
      console.log(this.records);
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
      let currentRecord = (<string>csvRecordsArray[i]).split(','); 
      let csvRecord:CSVRecord = {
        id:Number.parseInt(currentRecord[0]),
        firstName:currentRecord[1],
        lastName:currentRecord[2],
        age:Number.parseInt(currentRecord[3]),
        salary:Number.parseInt(currentRecord[4])
      }
      csvArr.push(csvRecord);
      };
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

    let submitDialog = this.matDialog.open(SubmitDialogComponent);
    submitDialog.afterClosed().subscribe(
      result=> {
        if(result === 'true'){
          this.userService.submitFileForApproval(this.file, this.tokenService.getUser().id).subscribe(
            data => {
              this.fileReset();
              this.isSubmitSuccess = true;
              setTimeout(() => {
                this.isSubmitSuccess = false;
                this.router.navigateByUrl("/home");
              }, 2000);
            },
            error => {
              console.error(error);
              this.isSubmitFailure = true;
              setTimeout(() => {
                this.isSubmitFailure = false;
              }, 2000);
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
}

export interface CSVRecord{
  id:number,
  firstName:string,
  lastName:string,
  age:number,
  salary:number
}