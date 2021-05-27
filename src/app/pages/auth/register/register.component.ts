import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm = this.fb.group({
    name:[""],
    lastname:[""],
    username:[""],
    password:[""],
    rol: []
  });

  constructor(private authSvc: AuthService, private fb:FormBuilder, private router: Router ) { }

  ngOnInit(): void {
  }

  onRegister():void{
    //Recogemos el formulario del html
    const formValue = this.registerForm.value;
    var form = JSON.stringify(formValue);
    //Llamaos a funcion register del auth.service
    this.authSvc.register(form).subscribe((res) => {
      if (res){
        console.log(res)
        this.router.navigate([""]);
      }
    })
  }

}
