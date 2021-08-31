import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  //Generamos un objeto de tipo Subscription que nos ayadará con la perfomance de la aplicacion
  private subscription: Subscription = new Subscription();

  //Formulario de registro, nos ayudamos de Validators
  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    username: ['', [Validators.required]],
    //Ejemplo de validaciones en formularios, pasamos longitud minima
    password: ['', [Validators.required, Validators.minLength(5)]],
    rol: ['', Validators.required],
  });

  //Parametro para visualizar la contraseña
  hide = true;
  errorRegister: boolean;

  constructor(
    private authSvc: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.errorRegister = false;
  }
  ngOnInit(): void { }

  //Cancelamos las subscripciones al salir del componente para mejorar el rendimiento
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //Metodo que se lanza al pulsar en registar
  onRegister(): void {
    //Solo seguimos si es un formulario valido
    if (this.registerForm.invalid) {
      return;
    }
    //Recogemos el formulario del html
    const formValue = this.registerForm.value;


    //Llamamos a funcion register del auth.service
    this.subscription.add(
      
      this.authSvc.register(formValue).subscribe((res) => {
          if (res == 'El nombre de usuario no está disponible') {
              this.errorRegister = true;
            } else {
              console.log(res);
              this.router.navigate(['/admin/users']);
            }
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }

  getErrorMessage(field: string): any {
    let message;
    if (this.registerForm.get(field)) {
      message = 'Introduce un valor';
    } else if (this.registerForm.get(field)?.hasError('minLength')) {
      const minLength =
        this.registerForm.get(field)?.errors?.minlength.requiredLength;
      message = `Este campo tiene que contener al menos ${minLength} caracteres`;
    }
    return message;
  }

  isValidField(field: string): any {
    return (
      (this.registerForm.get(field)?.touched ||
        this.registerForm.get(field)?.dirty) &&
      !this.registerForm.get(field)?.valid
    );
  }
}
