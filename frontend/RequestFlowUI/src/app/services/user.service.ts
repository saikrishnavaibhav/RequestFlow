import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const apiUrl="http://localhost:8080/api/";

const headers= new HttpHeaders({ 'Content-Type': 'application/json',
'Access-Control-Allow-Origin':"*" });

@Injectable({
  providedIn: 'root'
})
export class UserService {
  login(loginRequest: any) {
    return this.http.post(apiUrl + 'sign-in', loginRequest);
  }
  
  signUpUser(signupRequest: any) {
    return this.http.post(apiUrl + 'signup', signupRequest);
  }

  submitFileForApproval(file: any, userId: number) :Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId);
    const formData = new FormData(); 
    formData.append("file", file, file.name);
    return this.http.post(apiUrl + 'submitFileForApproval', formData, {params:queryParams});
    
  }

  getRequests(userId: number){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId);
    return this.http.get(apiUrl + 'getRequests', {headers, params:queryParams});
  }


  constructor(private http: HttpClient) { }
}
