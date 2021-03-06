//Añadiremos el token y el rol a las peticiones como parte del body

import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "@app/pages/auth/auth.service";
import { Observable } from "rxjs";


@Injectable()
export class Interceptor implements HttpInterceptor{

    constructor(private authSvc:AuthService){}

    //Metodo que nos ayuda a interceptar las peticiones al servidor y añadir automaticamente el rol y el token del usaurio de manera automatica
    intercept(req:HttpRequest<any>, next: HttpHandler):Observable<any>{
    //Solo queremos que se ejecute cuando haga la peticion a agm o last
    //if (req.url.includes(('agm') || ('last') || ('showusers'))){
    if (req.url.includes('http')){
        //Cogemos el token y el rol de auth Service

        const authToken = this.authSvc.userToken;
        const authRol = this.authSvc.rol_;
        const authReq = req.clone({
            setHeaders:{
                rol: authRol,
                token: authToken
            },
        });
        return next.handle(authReq)
    }
    return next.handle(req);
    }
}