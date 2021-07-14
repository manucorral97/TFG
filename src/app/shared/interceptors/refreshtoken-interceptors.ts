//NO IMPLEMENTADO ACTUALMENTE
import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpRequest, HttpClient} from "@angular/common/http";
import {HttpInterceptor} from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor
{

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        //console.log("Ha saltado el interceptor de refreshtoken!!!")
        //console.log("COMPRUEBA DE DONDE VIENE ESE MENSAJE!!!")
        let token = localStorage.getItem('token');
        let rol = localStorage.getItem('rol');

        if (token) {
            req = req.clone({
                setHeaders: {
                    'token': token
                }
            } );
        }

        //Tiene que haber una peticion a una URL que enviando el token y el rol te devuelva otra vez el token actualizado

        return next.handle(req).pipe(err => {
            //console.log(err);
            if (err == err) {
                if (1 == 1) {
                    //TODO: Token refreshing
                }else {
                    //Logout from account or do some other stuff
                }
            }
            return err;
        });
    }
}

//https://www.youtube.com/watch?v=F1GUjHPpCLA
//https://www.youtube.com/watch?v=UrfhqE7I-3o

//Extraido de : https://medium.com/@swapnil.s.pakolu/angular-interceptors-multiple-interceptors-and-6-code-examples-of-interceptors-59e745b684ec
// y de: https://medium.com/@monkov/angular-using-httpinterceptor-for-token-refreshing-3f04ea2ccb81
// y de: https://itnext.io/angular-tutorial-implement-refresh-token-with-httpinterceptor-bfa27b966f57
