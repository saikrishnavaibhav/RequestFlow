import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent {

  file:any;
  fileType:any;
  records:CSVRecord[]=[];
  @ViewChild('csvReader') csvReader: any;
  fileChanged(e:any) {
      this.file = e.target.files[0];
      console.log(this.file);
      if(this.file.name.endsWith(".csv")){
        this.fileType = "CSV";
      } else {  
        alert("Please import valid .csv file.");  
        this.fileReset();  
      } 
      console.log(this.fileType);
  }

  browseFiles(){
    let fileReader = new FileReader();

    if(this.fileType==="CSV"){
      console.log("here");
      fileReader.readAsText(this.file);
      fileReader.onload = (e) => {

      let csvData = fileReader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
        console.log(csvRecordsArray);


        let headersRow = this.getHeaderArray(csvRecordsArray);  

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
      };
      
      
      
      fileReader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  

    } 
  }  
  
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
    let csvArr = [];  
  
    for (let i = 1; i < csvRecordsArray.length; i++) {  
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
      if (curruntRecord.length == headerLength) {  
        let csvRecord: CSVRecord = new CSVRecord();  
        csvRecord.id = curruntRecord[0].trim();  
        csvRecord.firstName = curruntRecord[1].trim();  
        csvRecord.lastName = curruntRecord[2].trim();  
        csvRecord.age = curruntRecord[3].trim(); 
        csvArr.push(csvRecord);  
      }  
    }  
    return csvArr;  
  }  
  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }  
  
  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(',');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  }  
  
  fileReset() {  
    this.csvReader.nativeElement.value = "";  
    this.records = [];  
  }  

  }


export class CSVRecord {  
  public id: any;  
  public firstName: any;  
  public lastName: any;  
  public age: any;   
}
