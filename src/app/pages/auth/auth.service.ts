import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment }from '@env/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UserResponse, User, Roles } from '@app/shared/models/user.interface';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';
import { Md5 } from 'ts-md5/dist/md5';


const helper = new JwtHelperService;

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{
  private loggedIn = new BehaviorSubject<boolean>(false);
  //Creamos una varibale donde almacenar el rol del usuario, por defecto sera nulo
  private rol = new BehaviorSubject<string>("");

  private statLogin = new BehaviorSubject<boolean>(true);
  //Queremos obtener el token del usuario para el interceptor
  private token = new BehaviorSubject<string>("");

  timer:any;
  
  constructor(private http:HttpClient, private router: Router) { 
    this.checkToken();
    /* const timeout = 1*60;
    setTimeout(() => this.refreshToken(), timeout); */
  }
  ngOnInit(): void {
    
  }

  get isLogged():Observable<boolean>{
    return this.loggedIn.asObservable();
  }

  get userRol():Observable < string >{
    //console.log("ELEEEEE", this.rol.asObservable());
    return this.rol.asObservable();
  }

  //Necesario para pasarlo en el header de las peticiones
  get rol_():string{
    return this.rol.getValue();
  }

  get statusLogin():Observable <boolean>{
    return this.statLogin.asObservable();
  }

  get userToken(): string{
    return this.token.getValue();
  }

  /* Recibimos un authUser de tipo User (lo hemos creado nosotros en user.interface y se pueden añadir mas registros) */
  login(authData:any): Observable < any > {
    //ACTIVAR PARA PERMITIR EL LOGIN DE LOS NUEVOS USUARIOS
    authData.password = Md5.hashStr(authData.password);
    
    //console.log("Logamos con esta password ->", authData.password)
    /* A la general del servidor habra que acceder al regustro de login */
    return this.http.post<UserResponse | any >(`${environment.API_URL}/login`, authData).pipe(
      map( (user: any) => {
        if (user != "Usuario o contraseña incorrecto"){
          /* Guardamos el token. En la respuesta tiene que venir un campo llamado token */
          this.saveToken(user.token);
          this.saveRol(user.rol);
          //Guardamos que esta logado y el tipo de usuario que es
          this.rol.next(user.rol);
          this.loggedIn.next(true);
          this.token.next(user.token);
          //Comenzamos con refreshtoken
          const timeout = 1*60;
          setTimeout(() => this.refreshToken(), timeout);
          return user;
        } else {
          console.log("MALLLLLL");
        }
        
      }),
      catchError((err) => this.handlerError(err))
    );
  }
  logout():void{
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    //Al deslogarse, cambiamos el rol de nuevo a nulo
    this.loggedIn.next(false);
    this.rol.next("");
    this.token.next("");
    //Le decimos que cuando nos desloguemos nos lleve a login de nuevo
    this.router.navigate(['/login']);

    clearTimeout(this.timer);
    console.log("Cancelamos refresh");
  }

  private checkToken():void{
    const userToken = localStorage.getItem('token');
    var userRol = localStorage.getItem('rol');
    //Si tenemos un token comprobamos si ha expirado
    if (userToken && userRol){
      const isExpired = helper.isTokenExpired(userToken);
      //console.log('isExpired ->', isExpired)
      if (isExpired){
        this.logout()
      } else {
        this.loggedIn.next(true);
        this.rol.next(userRol);
        this.token.next(userToken);
      }
    }
  }
  
  private saveToken(token:string):void{
    //Guardamos en local en la variable token el valor del token recibido. Nos valdra para movernos por los apartados correspondinetes de la aplicacion
    localStorage.setItem('token', token);
  }
  private saveRol(rol:any):void{
    //Guardamos en local en la variable token el valor del token recibido. Nos valdra para movernos por los apartados correspondinetes de la aplicacion
    localStorage.setItem('rol', rol);
  }

  //Aqui enviamos la peticion de registro al server
  register(authData:any): Observable < any > {
    //authData.password = bcrypt.hashSync(authData.password, this.salt);
    authData.password = Md5.hashStr(authData.password);

    console.log(authData.password);
    
    /* A la general del servidor habra que acceder al regustro de usuarios */
    return this.http.post(`${environment.API_URL}/register`, authData, {responseType: 'text'}).pipe(
      map( (res: any) => {
        //console.log("En auth.service obtenemos la respuesta de la BD ->", res)
        return res;
      }),
      catchError((err) => this.handlerError(err))
    );
  }

  //Cuando se introduzca un usuario o contraseña incorrecto se llamará a esta funcion
  private handlerError(err: any): Observable<string>{
    let errorMessage = "An error occured retrienving data"
    if (err){
      errorMessage=`Error: ${err.error.text}`;
      this.statLogin.next(false);
    }
    //Pasamos la variable a falsa, es decir, el usuario no existe y el servidor nso devuelve error
    this.statLogin.next(false);
    return throwError(errorMessage);
  }


  refreshToken():void {
    console.log("Entro");
    //Llamamos justo antes de que se caduque el token (30 min)
    const timeout = 1000*60*29;
    this.timer = setTimeout(() => this.refreshToken(), timeout);

    this.http.get<any>("http://13.80.8.137/api/1/refreshToken").subscribe((res) => {
      console.log("RefreshToken");
      localStorage.setItem('token', res.token)
      //Añadir la supuesta respuesta al localStorage
    },(err) =>{
      console.log(err.message);
    });

  }


}
