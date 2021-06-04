import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private urlGET = 'http://13.80.8.137/agm'
  untrustHTML = ""
  trustHTML : SafeHtml;


  constructor(private http: HttpClient, private sanitizer:DomSanitizer) {
    this.http.get(this.urlGET, {responseType:'text'}).subscribe((data) => this.untrustHTML=data);
    this.trustHTML = this.sanitizer.bypassSecurityTrustHtml(this.untrustHTML);
   }


/* 
  getHTML():any{
    return this.http.get<any>(this.urlGET, {observe:'response'});
  } */
  //Hace bien la intercepcion y la peticion, pero error de token por que se espera un JSON
  ngOnInit(): void {
    //this.http.get(this.urlGET, {responseType:'text'}).subscribe((data) => this.getAGM=data);
  }


  
  url="https://www.elegantthemes.com/blog/wp-content/uploads/2014/01/import-export-wordpress-content.png";

  onSelectFile(e:any){
    if(e.target.files){
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.url=event.target.result;
      }
    }
  }
  

}
