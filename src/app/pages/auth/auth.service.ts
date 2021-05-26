import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment }from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { UserResponse, User } from '@app/shared/models/user.interface';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  /* Recibimos un authUser de tipo User (lo hemos creado nosotros en user.interface y se pueden añadir mas registros) */
  login(authData:User): Observable < UserResponse | void > {
    /* A la general del servidor habra que acceder al regustro de login */
    return this.http.post<UserResponse>(`${environment.API_URL}/auth/login`, authData).pipe(
      map( (res: UserResponse) => {
        console.log("RES ->", res)
        /* Guardamos el token */

      }),
      //catchError((err) => this.handlerError(error))
    );
  }
  logout():void{}
  private readToken():void{}
  private saveToken():void{}
  /* private handlerError(error): Observable<never>{
    let errorMessage = "An error occured retrienving data"
    if (error){
      errorMessage=`Error: code ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  } */


}
