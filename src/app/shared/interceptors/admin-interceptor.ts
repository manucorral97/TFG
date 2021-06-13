//Añadiremos el token y el rol a las peticiones como parte del body

import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "@app/pages/auth/auth.service";
import { Observable } from "rxjs";


@Injectable()
export class Interceptor implements HttpInterceptor{

    constructor(private authSvc:AuthService){}

    //La req es la URL
    intercept(req:HttpRequest<any>, next: HttpHandler):Observable<any>{
    //Solo queremos que se ejecute cuando haga la peticion a agm
    if (req.url.includes('agm')){
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