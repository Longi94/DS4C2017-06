import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
  }

  model = {
    username: "",
    password: ""
  };

  alert: string = "";

  login() {
    if (this.model.username.length == 0) {
      this.alert = "Missing username!";
      return;
    }

    if (this.model.password.length == 0) {
      this.alert = "Missing password!";
      return;
    }

    this.authService.login(this.model.username, this.model.password).subscribe(user => {
      this.authService.announceLogin(user);
      this.router.navigate(['/']);
    })
  }

}
