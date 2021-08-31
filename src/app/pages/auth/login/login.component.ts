import { Component, EventEmitter, Injectable, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { SharedService } from '@app/shared/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class LoginComponent implements OnInit, OnDestroy {

  //Formulario de login
  loginForm = this.fb.group({
    username:["", [Validators.required]],
    password: ["", [Validators.required]]
  });

  public username:string = "X";




  //Generamos un objeto de tipo Subscription que nos ayadará con la perfomance de la aplicacion
  private subscription: Subscription = new Subscription;

  //Varibale para poder observar la contraseña
  hide = true;
  //Creamos una varibale que nos servira para mostrar un mensaje por pantlla en caso de que no haya usuario registrado
  statusLogin = true;

  @Output() private updateName = new EventEmitter<string>();
  @Output() propagar = new EventEmitter<string>();

  constructor(private authSvc: AuthService, private fb:FormBuilder, private router: Router, private header:HeaderComponent, private sharedSvc: SharedService) { }


  ngOnInit(): void {  }
  //Al cerrar el componente cancelamos la subscripcion para mejorar la performance de la aplicacion
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //Metodo que se lanza al pulsar en logarse
  onLogin():void{
    //Solo enviamos el formulario si es valido
    if(this.loginForm.invalid){
      return;
    }
    //Llamamos al modulo de autenticacion a la funcion del estatus y cogemos la respuesta
    this.subscription.add(
      this.authSvc.statusLogin.subscribe( (res) => {
        (this.statusLogin = res)
      })
    );

    const formValue = this.loginForm.value;

    this.subscription.add(
      this.authSvc.login(formValue).subscribe( (res) => {
        //Enviamos el username al header para mostrarlo en pantalla
        this.sharedSvc.setUserName(this.loginForm.value.username);
        this.router.navigate([""]);


      }, (err) =>{
        console.log("Usuario o contraseña incorrecto")
      })
    )
  }

}
