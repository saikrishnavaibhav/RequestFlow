import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const apiUrl="http://localhost:8080/api/";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  signUpUser(signupRequest: any) {
    return this.http.post(apiUrl + 'signup', signupRequest);
  }

  submitFileForApproval(file: any) :Observable<any> {
    const formData = new FormData(); 
    formData.append("file", file, file.name);
    return this.http.post(apiUrl + 'submitFileForApproval', formData);
    
  }



  constructor(private http: HttpClient) { }
}
