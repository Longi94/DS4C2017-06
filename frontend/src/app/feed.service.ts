import { Injectable } from '@angular/core';
import { FeedItem } from "./feed/fedd-item";
import { FEED_ITEMS } from "./feed/mock-feed-items";
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { catchError } from "rxjs/operators";

@Injectable()
export class FeedService {

  constructor(private httpClient: HttpClient) {
  }

  private feedUrl = environment.apiBaseUrl + '/feed';

  getFeed(): Observable<FeedItem[]> {
    return this.httpClient.get<FeedItem[]>(this.feedUrl)
      .pipe(
        catchError(this.handleError('getFeed', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
