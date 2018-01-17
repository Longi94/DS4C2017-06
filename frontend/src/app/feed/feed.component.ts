import { Component, OnInit } from '@angular/core';
import { FeedService } from "../feed.service";
import { FeedItem } from "./fedd-item";
import moment = require("moment");

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  constructor(private feedService: FeedService) {
  }

  ngOnInit() {
    this.getFeed();
  }

  getFeed(): void {
    this.feedService.getFeed()
      .subscribe(items => this.feedItems = items);
  }

  feedItems: FeedItem[];

  formatDate = function (date) {
    return moment(date).format('MM/DD/YYYY');
  };

}
