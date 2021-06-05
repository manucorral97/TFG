import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RunScriptsDirective } from './directive.directive'; // <---

@NgModule({
  declarations: [RunScriptsDirective], // <---
  imports: [CommonModule],
  exports: [RunScriptsDirective], // <---
})
export class Directive {}
