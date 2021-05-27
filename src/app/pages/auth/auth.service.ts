import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment }from '@env/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UserResponse, User } from '@app/shared/models/user.interface';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  
  constructor(private http:HttpClient) { 
    this.checkToken();
  }

  get isLogged():Observable<boolean>{
    return this.loggedIn.asObservable();
  }
  /* Recibimos un authUser de tipo User (lo hemos creado nosotros en user.interface y se pueden añadir mas registros) */
  login(authData:string): Observable < UserResponse | void > {
    /* A la general del servidor habra que acceder al regustro de login */
    return this.http.post<UserResponse>(`${environment.API_URL}/login`, authData).pipe(
      map( (res: UserResponse) => {
        console.log("En auth.service obtenemos la respuesta de la BD ->", res)
        /* Guardamos el token. En la respuesta tiene que venir un campo llamado token */
        this.saveToken(res.token);
        //Guardamos que esta logado
        this.loggedIn.next(true);
        return res;
      }),
      catchError((err) => this.handlerError(err))
    );
  }
  logout():void{
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  private checkToken():void{
    const userToken = localStorage.getItem('token');
    //Si tenemos un token comprobamos si ha expirado
    if (userToken){
      const isExpired = helper.isTokenExpired(userToken);
      console.log('isExpired ->', isExpired)
      if (isExpired){
        this.logout()
      } else {
        this.loggedIn.next(true);
      }
    }
    
      
    // set userLogged = isExpired
  }
  private saveToken(token:string):void{
    //Guardamos en local en la variable token el valor del token recibido. Nos valdra para movernos por los apartados correspondinetes de la aplicacion
    localStorage.setItem('token', token);
  }
  private handlerError(err: any): Observable<never>{
    let errorMessage = "An error occured retrienving data"
    if (err){
      errorMessage=`Error: code ${err.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }


}
