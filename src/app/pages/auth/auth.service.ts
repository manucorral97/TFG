import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment }from '@env/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UserResponse, User } from '@app/shared/models/user.interface';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const helper = new JwtHelperService;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  
  constructor(private http:HttpClient, private router: Router) { 
    this.checkToken();
  }

  get isLogged():Observable<boolean>{
    return this.loggedIn.asObservable();
  }
  /* Recibimos un authUser de tipo User (lo hemos creado nosotros en user.interface y se pueden añadir mas registros) */
  login(authData:string): Observable < UserResponse | void > {
    console.log("En auth.service enviamos la peticion a la BD ->", authData)
    /* A la general del servidor habra que acceder al regustro de login */
    return this.http.post<UserResponse>(`${environment.API_URL}/login`, authData).pipe(
      map( (res: UserResponse) => {
        console.log("En auth.service obtenemos la respuesta de la BD ->", res)
        /* Guardamos el token. En la respuesta tiene que venir un campo llamado token */
        this.saveToken(res.token);
        this.saveRol(res.rol);
        //Guardamos que esta logado
        this.loggedIn.next(true);
        return res;
      }),
      catchError((err) => this.handlerError(err))
    );
  }
  logout():void{
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.loggedIn.next(false);
    //Le decimos que cuando nos desloguemos nos lleve a login de nuevo
    this.router.navigate(['login']);
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
  private saveRol(rol:string):void{
    //Guardamos en local en la variable token el valor del token recibido. Nos valdra para movernos por los apartados correspondinetes de la aplicacion
    localStorage.setItem('rol', rol);
  }

  //Aqui enviamos la peticion de registro al server
  register(authData:any): Observable < any > {
    console.log("En authService ->", authData)
    /* A la general del servidor habra que acceder al regustro de usuarios */
    return this.http.post(`${environment.API_URL}/register`, authData, {responseType: 'text'}).pipe(
      map( (res: any) => {
        console.log("En auth.service obtenemos la respuesta de la BD ->", res)
        return res;
      }),
      catchError((err) => this.handlerError(err))
    );
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
