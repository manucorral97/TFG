import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

  getAll():Observable<any>{
    return this.http.get<any>(`environment.API_URL`)
    .pipe(catchError(this.handlerError));
  }

  delete(username:string):Observable<{}>{
    return this.http.delete<any>(`environment.API_URL`)
    .pipe(catchError(this.handlerError));
  }
  update(username:string):Observable<any>{
    return this.http.patch<any>(`environment.API_URL`, username)
    .pipe(catchError(this.handlerError));
  }

  handlerError(error: { message: any; }):Observable<never>{
    let errorMessage = "Error desconocido";
    if (error){
      errorMessage=`Error: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
  
}
