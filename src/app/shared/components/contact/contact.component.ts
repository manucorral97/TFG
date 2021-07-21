import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    data: ['', [Validators.required, Validators.maxLength(500)]],
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

  }

  onContact(){
    console.log(this.contactForm.value.name);
    console.log(this.contactForm.value.email);
    console.log(this.contactForm.value.data);
  }

}
