import { Injectable } from '@angular/core';
import { Request } from '../home/home.component';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  request:Request = {
  id: null,
  date:null,
  userId:null,
  file:null,
  fileName:null,
  status:null,
  approvals:null
  }
  constructor() { }

  setRequest(request: Request){
    this.request = request;
  }

  getRequest(){
    return this.request;
  }
}

