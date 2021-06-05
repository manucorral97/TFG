import { HttpClient } from '@angular/common/http';
import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  private urlGET = 'http://13.80.8.137/agm';
  trustHTML: string | null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.trustHTML = '';
    this.http
      .get(this.urlGET, { responseType: 'text' })
      .subscribe(
        (data) =>
          (this.trustHTML = this.sanitizer.sanitize(
            SecurityContext.HTML,
            this.sanitizer.bypassSecurityTrustHtml(data)
          ))
      );
    console.log('HTML sanitizado => ', this.trustHTML);
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
