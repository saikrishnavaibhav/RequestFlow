import { Component, OnInit } from '@angular/core';
import { Request } from '../home/home.component';
import { CSVRecord } from '../new-request/new-request.component';
import { RequestService } from '../services/request.service';

@Component({
  selector: 'app-viewrequest',
  templateUrl: './viewrequest.component.html',
  styleUrls: ['./viewrequest.component.css']
})
export class ViewrequestComponent implements OnInit {
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

  constructor(private requestService: RequestService){}
  
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

  }

  toUpper = function(header : any){ 
    return header.toUpperCase();
  };

  submit(){

  }
}
