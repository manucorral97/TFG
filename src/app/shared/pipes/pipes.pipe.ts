
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import * as DOMPurify  from "dompurify";

@Pipe({
  name: 'SafePipe'
})
export class SafePipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer, ) {}
 
 public transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
	const sanitizedContent = DOMPurify.sanitize(value);
	//console.log(value);
	console.log("Nos vamos a la pipe")
    switch (type) {
			case 'html': return this.sanitizer.bypassSecurityTrustHtml(sanitizedContent);
			case 'style': return this.sanitizer.bypassSecurityTrustStyle(sanitizedContent);
			case 'script': return this.sanitizer.bypassSecurityTrustScript(sanitizedContent);
			case 'url': return this.sanitizer.bypassSecurityTrustUrl(sanitizedContent);
			case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(sanitizedContent);
			default: throw new Error(`Invalid safe type specified: ${type}`);
		}
  }
}
