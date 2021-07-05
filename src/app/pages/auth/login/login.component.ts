import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm = this.fb.group({
    username:["", [Validators.required]],
    password: ["", [Validators.required]]
  });


  //Generamos un objeto de tipo Subscription que nos ayadará con la perfomance de la aplicacion
  private subscription: Subscription = new Subscription;

  hide = true;
  //Creamos una varibale que nos servira para mostrar un mensaje por pantlla en caso de que no haya usuario registrado
  statusLogin = true;

  constructor(private authSvc: AuthService, private fb:FormBuilder, private router: Router ) { }


  ngOnInit(): void {  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLogin():void{
    //Solo enviamos el formulario si es valido
    if(this.loginForm.invalid){
      return;
    }
    //Llamamos al modulo de autenticacion a la funcion del estatus y cogemos la respuesta
    this.authSvc.statusLogin.subscribe( (res) => (this.statusLogin = res));

    const formValue = this.loginForm.value;

    //console.log("En en login pasamos:", formValue.password);
    //No es necesario pasarlo a JSON para que las keys tengan ""
    //var form = JSON.stringify(formValue);
    this.subscription.add(
      this.authSvc.login(formValue).subscribe( (res) => {
        //console.log(res)
        if (res){
          //console.log(res)
          this.router.navigate([""]);
        }
        else{
          console.log(res)
        }
      })
    )
  }

}
