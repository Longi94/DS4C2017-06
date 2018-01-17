import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FeedComponent } from './feed/feed.component';
import { FeedService } from "./feed.service";
import { ChatComponent } from './chat/chat.component';
import { ChatService } from './chat.service';
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, {dataEncapsulation: false}
    )
  ],
  providers: [
    FeedService,
    ChatService
  ],
  bootstrap: [
    ChatComponent,
    FeedComponent
  ]
})
export class AppModule {
}
