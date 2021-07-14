import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment }from '@env/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UserResponse, User, Roles } from '@app/shared/models/user.interface';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

const helper = new JwtHelperService;

//Lo hacemos injectable para que sea visible en cualquier punto de la aplicación
@Injectable({ providedIn: 'root' })
export class AuthService implements OnInit{
  //loggedIn nos ayudará a saber si se ha logado con exito
  private loggedIn = new BehaviorSubject<boolean>(false);
  //Varibale para almacenar el rol del usario
  private rol = new BehaviorSubject<string>("");

  //Estado del login(login/logout)
  private statLogin = new BehaviorSubject<boolean>(true);
  //Varibale para almacenar el token del usario
  private token = new BehaviorSubject<string>("");
  //Varibale para almacenar el ID del usario (not implemented)
  public userID: any;

  //ChechToken
  timer:any;
  
  constructor(private http:HttpClient, private router: Router) { 
    //Lanzamos checkToken
    this.checkToken();
  }
  ngOnInit(): void { }

  //Funcion para saber si el usuario está logado
  get isLogged():Observable<boolean>{
    return this.loggedIn.asObservable();
  }
  //Funcion para obtener el rol del usuario
  get userRol():Observable < string >{
    return this.rol.asObservable();
  }
  //Funcion para obtener el estado del login
  get statusLogin():Observable <boolean>{
    return this.statLogin.asObservable();
  }

  //Necesario para pasarlo en el header de las peticiones
  get rol_():string{
    return this.rol.getValue();
  }
  //Funcion para obtener el token del usuario
  get userToken(): string{
    return this.token.getValue();
  }

  //Funcion de login
  login(authData:any): Observable < any > {
    //HASH contraseña
    authData.password = Md5.hashStr(authData.password);
  
    //Hacemos una peticion post 
    return this.http.post<UserResponse | any >(`${environment.API_URL}/login`, authData).pipe(
      map( (user: any) => {
        if (user != "Usuario o contraseña incorrecto"){
          /* Guardamos el token. En la respuesta tiene que venir un campo llamado token */
          this.saveUser(user);
          //Guardamos que esta logado y el tipo de usuario que es
          this.rol.next(user.rol);
          this.loggedIn.next(true);
          this.token.next(user.token);
          //Comenzamos con refreshtoken
          const timeout = 1*60;
          setTimeout(() => this.refreshToken(), timeout);
          return user;
        } else {
          console.log("MAL");
        }
      }),
      catchError((err) => this.handlerError(err))
    );
  }


  //Funcion de logout
  logout():void{
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    //Al deslogarse, cambiamos el rol de nuevo a nulo
    this.loggedIn.next(false);
    this.rol.next("");
    this.token.next("");
    //Le decimos que cuando nos desloguemos nos lleve a login de nuevo
    this.router.navigate(['/login']);
    //Desactivamos el refreshToken
    clearTimeout(this.timer);
    console.log("Cancelamos refresh");
  }

  //Comprobamos si el token ha expirado
  private checkToken():void{
    const userToken = localStorage.getItem('token');
    var userRol = localStorage.getItem('rol');
    //Si tenemos un token comprobamos si ha expirado
    if (userToken && userRol){
      const isExpired = helper.isTokenExpired(userToken);
      if (isExpired){
        this.logout()
      } else {
        this.loggedIn.next(true);
        this.rol.next(userRol);
        this.token.next(userToken);
      }
    }
  }
  
  //Guardamos el token y el rol del usuario en el localStorage
  private saveUser(user:any):void{
    //console.log(user);
    //Guardamos en local en la variable token el valor del token y el rol recibido. Nos valdra para movernos por los apartados correspondinetes de la aplicacion
    localStorage.setItem('token', user.token);
    localStorage.setItem('rol', user.rol);
    //this.userID = user.id;
  }

  //Aqui enviamos la peticion de registro al server
  register(authData:any): Observable < any > {
    authData.password = Md5.hashStr(authData.password);
    
    /* A la general del servidor habra que acceder al regustro de usuarios */
    return this.http.post(`${environment.API_URL}/register`, authData, {responseType: 'text'}).pipe(
      map( (res: any) => {
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

  //Funcion que actualiza el token antes de caducar
  refreshToken():void {
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
