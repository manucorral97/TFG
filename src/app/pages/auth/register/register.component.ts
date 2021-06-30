import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, Validator, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
/* import  *  as crypto from 'crypto-js'; */
import * as bcrypt from 'bcryptjs';

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
    //Ejemplo de validaciones en formularios, pasamos longitud minima
    password:["", [Validators.required, Validators.minLength(5)]],
    rol: ["", Validators.required]
  });

  hide = true;
  errorRegister: boolean;

  constructor(private authSvc: AuthService, private fb:FormBuilder, private router: Router ) { 
    this.errorRegister=false;
  }
  ngOnInit(): void { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onRegister():void{
    //Solo seguimos si es un formulario valido
    if(this.registerForm.invalid){
      return;
    }
    //Recogemos el formulario del html
    const formValue = this.registerForm.value;
    //Hasheamos la password
    /* const salt = bcrypt.genSaltSync(10); */
    //formValue.password = bcrypt.hashSync(formValue.password);
    
    //Llamamos a funcion register del auth.service
    this.subscription.add(
      this.authSvc.register(formValue).subscribe((res) => {
        if (res){
          if(res == "El nombre de usuario no está disponible"){
            this.errorRegister=true
          }
          else{
            console.log(res)
            this.router.navigate(["/admin/users"]);
          }
          
        }},
        (err)=>{
          console.log(err);
        }
      )
    )
  }

  getErrorMessage(field:string):any{
    let message;
    if(this.registerForm.get(field)){
      message = 'Introduce un valor';
    } else if(this.registerForm.get(field)?.hasError('minLength')){
      const minLength = this.registerForm.get(field)?.errors?.minlength.requiredLength;
      message = `Este campo tiene que contener al menos ${minLength} caracteres`;
    }
    return message;
  }

  isValidField(field:string):any{
    return (
      (this.registerForm.get(field)?.touched || this.registerForm.get(field)?.dirty) && !this.registerForm.get(field)?.valid);
  }



}
