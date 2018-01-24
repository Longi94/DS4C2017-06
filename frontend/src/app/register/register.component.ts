import { Component, OnInit } from '@angular/core';
import { User } from "../model/user";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    if (AuthService.authenticated()) {
      this.router.navigate(['/']);
    }
  }

  model = {
    username: "",
    password: "",
    confirmPassword: "",
    email: ""
  };

  alert: string = "";

  register() {
    if (this.model.username.length == 0) {
      this.alert = "Missing username!";
      return;
    }

    if (this.model.email.length == 0) {
      this.alert = "Missing email!";
      return;
    }

    if (this.model.password.length == 0) {
      this.alert = "Missing password!";
      return;
    }

    if (this.model.confirmPassword.length == 0) {
      this.alert = "Missing password confirmation!";
      return;
    }

    if (this.model.password !== this.model.confirmPassword) {
      this.alert = "Passwords do not match!";
      return;
    }

    let user: User = {
      id: null,
      username: this.model.username,
      password: this.model.password,
      email: this.model.email
    };

    this.authService.register(user).subscribe(() => this.router.navigate(['/login']), error => {
      this.alert = error.error.message || error.error.error.message;
    });
  }

}
