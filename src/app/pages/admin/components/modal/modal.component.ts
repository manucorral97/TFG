import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  userModify = this.fb.group({
    id:[""],
    name:[""],
    lastname: [""],
    username: [""],
    password: [""],
    rol: [""],
  });

  statusModify:boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private fb:FormBuilder, private http:HttpClient, public router: Router) { 
    this.statusModify = false;
  }

  ngOnInit(): void {
  }

  onSave(user: any):void{
    //Hacer peticion al back 
    user.password = Md5.hashStr(user.password);
    user.id = this.data.user.id;
   
    this.http.post<any>("http://13.80.8.137/api/1/editusers", user).subscribe((res) =>{
        this.router.navigate(["/admin/users"]);
        this.ngOnInit();
        console.log("BIEN");
        window.location.reload();
      },
      (err) => {
        console.log(err);
        //alert("Usuario eliminado satisfactoriamente");
        this.statusModify = false
        this.ngOnInit();
        }
      );

  }

}
