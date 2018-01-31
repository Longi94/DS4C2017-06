import { Injectable } from '@angular/core';
import { FeedItem } from "./model/fedd-item";
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { catchError } from "rxjs/operators";
import { HttpUtils } from "./util/http-utils";

@Injectable()
export class FeedService {

  constructor(private httpClient: HttpClient) {
  }

  private feedsUrl = environment.apiBaseUrl + '/Feeds';

  getFeed(): Observable<FeedItem[]> {
    return this.httpClient.get<FeedItem[]>(this.feedsUrl + '/getFeeds')
      .pipe(
        catchError(HttpUtils.handleError('getFeed', []))
      );
  }

  deleteFeed(feedId): Observable<any> {
    return this.httpClient.delete(this.feedsUrl + '/deleteFeed/' + feedId)
      .pipe(
        catchError(HttpUtils.handleError('deleteFeed', []))
      );
  }
}
