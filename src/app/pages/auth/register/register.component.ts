import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  //Generamos un objeto de tipo Subscription que nos ayadará con la perfomance de la aplicacion
  private subscription: Subscription = new Subscription;
  registerForm = this.fb.group({
    name:[""],
    lastname:[""],
    username:[""],
    password:[""],
    rol: [""]
  });

  constructor(private authSvc: AuthService, private fb:FormBuilder, private router: Router ) { }
  ngOnInit(): void { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onRegister():void{
    //Recogemos el formulario del html
    const formValue = this.registerForm.value;
    //var form = JSON.stringify(formValue);
    console.log("Desde register.component enviamos este cuerpo -> ", formValue);
    //Llamaos a funcion register del auth.service
    this.subscription.add(
      this.authSvc.register(formValue).subscribe((res) => {
        if (res){
          console.log(res)
          this.router.navigate(["/login"]);
        }
      })
    )
  }
}
