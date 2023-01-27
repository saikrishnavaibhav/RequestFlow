import { Injectable } from '@angular/core';
import { Request } from '../home/home.component';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  request:any;
  constructor() { }

  setRequest(request: Request){
    this.request = request;
  }

  getRequest(){
    return this.request;
  }
}

