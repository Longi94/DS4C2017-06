import { Component, OnInit } from '@angular/core';
import { UserService } from "../user.service";
import { User } from "../model/user";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
  }

  model = {
    username: "",
    password: "",
    confirmPassword: ""
  };

  alert: string = "";

  register() {
    if (this.model.username.length == 0) {
      this.alert = "Missing username!";
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
      id: 0,
      username: this.model.username,
      password: this.model.password
    };

    this.userService.create(user).subscribe(() => this.router.navigate(['/login']))
  }

}
