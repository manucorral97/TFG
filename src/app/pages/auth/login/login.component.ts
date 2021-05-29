import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, Validator} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm = this.fb.group({
    username:[""],
    password: [""]
  });

  //Generamos un objeto de tipo Subscription que nos ayadará con la perfomance de la aplicacion
  private subscription: Subscription = new Subscription;

  hide = true;

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

    const formValue = this.loginForm.value;
    //No es necesario pasarlo a JSON para que las keys tengan ""
    //var form = JSON.stringify(formValue);
    this.subscription.add(
      this.authSvc.login(formValue).subscribe( (res) => {
        if (res){
          this.router.navigate([""]);
        }
      })
    )
  }

}
