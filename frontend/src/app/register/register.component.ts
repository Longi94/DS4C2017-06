import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  model = {
    username: "",
    password: "",
    confirmPassword: ""
  };

  register() {
    console.log('asdf');
  }

}
