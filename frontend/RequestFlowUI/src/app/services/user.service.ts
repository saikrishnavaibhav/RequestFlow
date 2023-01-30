import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const apiUrl= "https://unzlccfxxa.execute-api.us-east-1.amazonaws.com/uat/";
//http://localhost:8080/api/";

// const headers= new HttpHeaders({ 'Content-Type': 'application/json',
// 'Access-Control-Allow-Origin':"*" });

const headers= new HttpHeaders({ 'Access-Control-Allow-Origin':"*" });

@Injectable({
  providedIn: 'root'
})
export class UserService {
  login(loginRequest: any) {
    return this.http.post(apiUrl + 'sign-in', loginRequest,{headers});
  }
  
  signUpUser(signupRequest: any) {
    return this.http.post(apiUrl + 'signup', signupRequest,{headers});
  }

  submitFileForApproval(file: any, userId: number) :Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId);
    const formData = new FormData(); 
    formData.append("file", file, file.name);
    return this.http.post( apiUrl + 'submitfileforapproval', formData, {headers:headers, params:queryParams});
    
  }

  getRequests(userId: number) :Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId);
    return this.http.get(apiUrl + 'getrequests', {headers, params:queryParams});
  }

  getAllRequests() :Observable<any> {
    return this.http.get(apiUrl + 'getallrequests',{headers});
  }

  assignRequest(userId: number, requestId: number) :Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId).append("requestId", requestId);
    return this.http.post(apiUrl + 'assignrequest',null, {headers, params:queryParams});
  }
  
  approveRequest(userId: number, requestId: number, approve: boolean) :Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId).append("requestId", requestId).append("approve", approve);
    return this.http.post(apiUrl + 'approverequest',null, {headers, params:queryParams});
  }

  retrieveNotifications(userId: number) :Observable<any> {
		let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId);
    return this.http.get(apiUrl + 'retrievenotifications',{headers, params:queryParams});
	}

  readNotification(notificationId: number) :Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("notificationId",notificationId);
    return this.http.put(apiUrl + 'readnotification',null, {headers, params:queryParams});
  }

  constructor(private http: HttpClient) { }
}
