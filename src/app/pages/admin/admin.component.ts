import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, SecurityContext, ViewChild } from '@angular/core';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';




@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  template: `
        <div>
         Interval: {{observable$ | async}}
        </div>`
})
export class AdminComponent implements OnInit {
  components = [
    {
      name: "Humedad",
      icon: "water"
    },
    {
      name: "Temperatura",
      icon: "thermostat"
    }
  ];

  container=[];

  private urlGET: any = 'http://13.80.8.137/agm';
  
  trustHTML: string | null;
  //ejemplo: any = "<h1>Hola</h1><script>console.log('Hello! I am an alert box!');</script>";
  elem: any;
  constructor(private http: HttpClient, private sanitizer: DomSanitizer, @Inject(DOCUMENT) private document: any) {
    this.trustHTML = ''
  }

  ngOnInit(): void {
    /* this.trustHTML = ''; */
    this.urlGET = this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl(this.urlGET));
    //this.ejemplo = this.sanitizer.sanitize(SecurityContext.HTML,this.sanitizer.bypassSecurityTrustHtml(this.ejemplo));
    //console.log(this.ejemplo);
    this.http
      .get(this.urlGET, { responseType: 'text' }).pipe(first())
      .subscribe((data) =>
          (this.trustHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(data)))
      );

      this.elem = document.getElementById("img");
  }

  ngOnDestroy(){
    
  }

  url = 'https://www.elegantthemes.com/blog/wp-content/uploads/2014/01/import-export-wordpress-content.png';

  onSelectFile(e: any) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };
    }
  }
  

  openFullScreen() {

    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }
/* Close fullscreen */
  closeFullScreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }


  onDrop(event: CdkDragDrop<string[] | any>){
    if(event.previousContainer === event.container){
      moveItemInArray(event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    else{
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex, event.currentIndex);
    }

  }
}
