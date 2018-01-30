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
    musicService.feed$.subscribe(() => this.getFeed());
  }

  ngOnInit() {
    this.getFeed();
  }

  getFeed(): void {
    this.feedService.getFeed().subscribe(items => this.feedItems = items);
  }

  formatDate = function (date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
  };

  feedItems: FeedItem[];

}
