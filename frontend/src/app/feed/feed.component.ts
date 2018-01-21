import { Component, OnInit } from '@angular/core';
import { FeedService } from "../feed.service";
import { FeedItem } from "../model/fedd-item";
import { MusicService } from "../music.service";

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
    this.feedService.getFeed()
      .subscribe(items => this.feedItems = items);
  }

  feedItems: FeedItem[];

}
