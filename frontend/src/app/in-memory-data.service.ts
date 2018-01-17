import { InMemoryDbService } from 'angular-in-memory-web-api';
import { FEED_ITEMS } from "./feed/mock-feed-items";

export class InMemoryDataService implements InMemoryDbService {

  constructor() {
  }

  createDb() {
    return {feed: FEED_ITEMS}
  }

}
