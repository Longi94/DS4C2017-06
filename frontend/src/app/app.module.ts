import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { FeedComponent } from './feed/feed.component';
import { FeedService } from "./feed.service";


@NgModule({
  declarations: [
    AppComponent,
    FeedComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot()
  ],
  providers: [
    FeedService
  ],
  bootstrap: [
    AppComponent,
    FeedComponent
  ]
})
export class AppModule {
}
