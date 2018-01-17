import { Injectable } from '@angular/core';
import { FeedItem } from "./feed/fedd-item";
import { FEED_ITEMS } from "./feed/mock-feed-items";

@Injectable()
export class FeedService {

  constructor() {
  }

  getFeed(): FeedItem[] {
    return FEED_ITEMS;
  }

}
