import { Component, OnInit } from '@angular/core';
import { FeedService } from "../feed.service";
import { FeedItem } from "../model/fedd-item";
import { MusicService } from "../music.service";
import moment = require("moment");

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})

export class FeedComponent implements OnInit {

  constructor(private feedService: FeedService,
              private musicService: MusicService) {
    musicService.feed$.subscribe(item => this.feedItems.unshift(item));
  }

  ngOnInit() {
    this.getFeed();
  }

  getFeed(): void {
    this.feedService.getFeed().subscribe(items => {
      this.feedItems = items;
      this.feedItems.sort((a, b) => b.date - a.date);
    });
  }

  formatDate = function (date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
  };

  deleteFeed(feedId) {
    this.feedService.deleteFeed(feedId).subscribe(res => {
      if(res.response.error != null) {
        alert(res.response.error.message);
      }

      this.getFeed();
    });
  }

  feedItems: FeedItem[];

}
