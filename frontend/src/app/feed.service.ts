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

  private feedUrl = environment.apiBaseUrl + '/feed';

  getFeed(): Observable<FeedItem[]> {
    return this.httpClient.get<FeedItem[]>(this.feedUrl)
      .pipe(
        catchError(HttpUtils.handleError('getFeed', []))
      );
  }
}
