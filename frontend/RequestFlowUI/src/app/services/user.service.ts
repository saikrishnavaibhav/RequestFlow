import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//const apiUrl= "https://unzlccfxxa.execute-api.us-east-1.amazonaws.com/uat/";
const apiUrl= "http://localhost:8080/api/";

//const headers= new HttpHeaders({ 'Access-Control-Allow-Origin':"*" });
const headers= new HttpHeaders();

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
    //return this.http.post( 'http://3.86.7.14:8080/api/submitFileForApproval', formData, {headers:headers, params:queryParams});
    return this.http.post( apiUrl + 'submitFileForApproval', formData, {params:queryParams});
    
  }

  getRequests(userId: number) :Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId);
    //return this.http.get(apiUrl + 'getrequests', {headers, params:queryParams});
    return this.http.get(apiUrl + 'getRequests', {headers, params:queryParams});
  }

  getAllRequests() :Observable<any> {
    //return this.http.get(apiUrl + 'getallrequests',{headers});
    return this.http.get(apiUrl + 'getAllRequests',{headers});
  }

  assignRequest(userId: number, requestId: number) :Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId).append("requestId", requestId);
    //return this.http.post(apiUrl + 'assignrequest',null, {headers, params:queryParams});
    return this.http.post(apiUrl + 'assignRequest',null, {headers, params:queryParams});
  }
  
  approveRequest(userId: number, requestId: number, approve: boolean,remark: string) :Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId).append("requestId", requestId).append("approve", approve).append("remark", remark);
    //return this.http.post(apiUrl + 'approverequest',null, {headers, params:queryParams});
    return this.http.post(apiUrl + 'approveRequest',null, {headers, params:queryParams});
  }

  retrieveNotifications(userId: number) :Observable<any> {
		let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId);
    //return this.http.get(apiUrl + 'retrievenotifications',{headers, params:queryParams});
    return this.http.get(apiUrl + 'retrieveNotifications',{headers, params:queryParams});
	}

  readNotification(notificationId: number) :Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("notificationId",notificationId);
    //return this.http.put(apiUrl + 'readnotification',null, {headers, params:queryParams});
    return this.http.put(apiUrl + 'readNotification',null, {headers, params:queryParams});
  }

  retrieveUsers(userId: number) :Observable<any> {
		let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId);
    return this.http.get(apiUrl + 'retrieveUsers',{headers, params:queryParams});
  }

  retrieveLogs() :Observable<any> {
    return this.http.get(apiUrl + 'retrieveLogs',{headers});
  }

  deleteUser(userId:number) :Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId",userId);
    return this.http.delete(apiUrl + 'deleteUser',{params:queryParams});
  }

  constructor(private http: HttpClient) { }
}
