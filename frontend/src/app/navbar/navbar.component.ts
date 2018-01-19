import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { User } from "../model/user";
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) {
    authService.login$.subscribe(user => {
      this.authenticatedUser = user;
      this.authenticated = true;
    });

    authService.logout$.subscribe(() => {
      this.authenticatedUser = null;
      this.authenticated = false;
    });
  }

  authenticated: boolean;
  authenticatedUser: User;

  ngOnInit() {
    this.authenticated = this.authService.authenticated();

    if (this.authenticated) {
      this.authenticatedUser = AuthService.getAuthenticatedUser();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
