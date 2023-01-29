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

  getAllRequests(){
    return this.http.get(apiUrl + 'getAllRequests');
  }

  assignRequest(userId: number, requestId: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId).append("requestId", requestId);
    return this.http.post(apiUrl + 'assignRequest',null, {params:queryParams});
  }
  
  approveRequest(userId: number, requestId: number, approve: boolean){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId).append("requestId", requestId).append("approve", approve);
    return this.http.post(apiUrl + 'approveRequest',null, {params:queryParams});
  }

  retrieveNotifications(userId: number){
		let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId);
    return this.http.get(apiUrl + 'retrieveNotifications',{params:queryParams});
	}

  readNotification(notificationId: number){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("notificationId",notificationId);
    return this.http.put(apiUrl + 'readNotification',null, {params:queryParams});
  }

  constructor(private http: HttpClient) { }
}
