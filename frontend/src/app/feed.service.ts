import { Injectable } from '@angular/core';
import { FeedItem } from "./feed/fedd-item";
import { FEED_ITEMS } from "./feed/mock-feed-items";
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class FeedService {

  constructor() {
  }

  getFeed(): Observable<FeedItem[]> {
    return of(FEED_ITEMS);
  }

}
