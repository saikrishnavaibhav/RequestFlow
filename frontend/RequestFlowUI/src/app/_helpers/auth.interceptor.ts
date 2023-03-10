import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenStorageService } from '../services/token-storage.service';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

const TOKEN_HEADER_KEY = 'Authorization'; 

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.token.getToken();
    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

    }
    return next.handle(authReq).pipe(tap(()=> {},
    
      (error:any) => {
        console.error(error);
        if(error instanceof ErrorResponse){
          console.error(error);
        } else if( error instanceof HttpErrorResponse){
         if(error.status === 401){ 
          console.error(error);
          if(!error.url?.includes("sign-in")){
            this.router.navigateByUrl('/login')
            this.token.signOut();
          }
        }
        
      }
    }
    ));
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];

export class ErrorResponse{
  message:any;
}
