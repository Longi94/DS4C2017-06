import { Component, OnInit } from '@angular/core';
import { FEED_ITEMS } from "./mock-feed-items";
import moment = require("moment");

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  feedItems = FEED_ITEMS;

  formatDate = function (date) {
    return moment(date).format('MM/DD/YYYY')
  };

  constructor() {
  }

  ngOnInit() {
  }

}
