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
      name: "Sensor 1",
      icon: "sensors"
    },
    {
      name: "Sensor 2",
      icon: "sensors"
    }
  ];

  granja:number;

  //Posicion de reset de las cajas (y de inicio...)
  dragPositionReset = {x: 0, y: 0};
  //Posicion actual de las cajas
  dragPositionState = {x: 0, y: 0};
  //Posicion de inicio de las cajas
  dragPositionInit = {x: 0, y: 0};

  private urlGET: any = 'http://13.80.8.137/agm';
  url = 'https://www.elegantthemes.com/blog/wp-content/uploads/2014/01/import-export-wordpress-content.png';
  url2 = 'https://wellaggio.com/wp-content/uploads/2015/09/la-importancia-de-las-imagenes-en-el-diseño-web1.jpg';

  trustHTML: string | null;
  //ejemplo: any = "<h1>Hola</h1><script>console.log('Hello! I am an alert box!');</script>";
  elem: any;
  constructor(private http: HttpClient, private sanitizer: DomSanitizer, @Inject(DOCUMENT) private document: any) {
    this.trustHTML = '';
    this.granja = 0;
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

      this.elem = document.getElementById("container-center");

      this.dragPositionInit.x = this.dragPositionState.x;
      this.dragPositionInit.y = this.dragPositionState.y;
  }

  ngOnDestroy(){
    
  }

  
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

  returnHome(){
    this.dragPositionReset = {x: this.dragPositionReset.x, y: this.dragPositionReset.y};
  }

  savePosition($event: { source: { getFreeDragPosition: () => any; }; }){
    this.dragPositionState.x = $event.source.getFreeDragPosition().x
    this.dragPositionState.y = $event.source.getFreeDragPosition().y
    console.log("Posiciones a guardar: ",this.dragPositionState.x, this.dragPositionState.y)

    //Guardar en un drgposition
  }

  showInfo(component: any){
    alert(component);
  }

  selectGranja(number: number){
    this.granja=number;
  }

}
