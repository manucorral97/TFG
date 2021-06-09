import { HttpClient } from '@angular/common/http';
import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

//NO FUNCIONA EL BYPPAS NI LA DIRECTIVA NI NADA


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  private urlGET: any = 'http://13.80.8.137/agm';
  
  trustHTML: string | null;
  ejemplo: any = "<script>console.log('Hello! I am an alert box!');</script>";

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.trustHTML = '';
    this.urlGET = this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl(this.urlGET));
    this.ejemplo = this.sanitizer.bypassSecurityTrustScript(this.ejemplo);
    this.http
      .get(this.urlGET, { responseType: 'text' })
      .subscribe((data) =>
          (this.trustHTML = this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl(data)))
      );
    //console.log('HTML sanitizado => ', this.trustHTML);
  }
  

  ngOnInit(): void {
    
  }

  url =
    'https://www.elegantthemes.com/blog/wp-content/uploads/2014/01/import-export-wordpress-content.png';

  onSelectFile(e: any) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };
    }
  }
}
