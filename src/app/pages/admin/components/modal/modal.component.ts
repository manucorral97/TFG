import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {

  private subscriptionSave: Subscription = new Subscription;
  userModify = this.fb.group({
    id:[""],
    name:["", Validators.required],
    lastname: ["", Validators.required],
    username: ["", Validators.required],
    password: ["", [Validators.required, Validators.minLength(5)]],
    rol: ["", Validators.required],
  });

  statusModify:boolean;

  hide = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private fb:FormBuilder, private http:HttpClient, public router: Router) { 
    this.statusModify = false;
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subscriptionSave.unsubscribe();
  }

  //Guardamos los nuevos datos del usuario manteniendo el mismo ID
  onSave(user: any):void{
    //Hacer peticion al back 
    user.password = Md5.hashStr(user.password);
    user.id = this.data.user.id;

    //this.subscriptionSave.add(
      this.http.post<any>("http://13.80.8.137/api/1/editusers", user).subscribe((res) =>{
        window.location.reload();
      },
      (err) => {
        console.log(err);
        this.statusModify = false
        this.ngOnInit();
        }
      )
    //)
  }

}
