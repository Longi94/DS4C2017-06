import { Injectable } from '@angular/core';
import { environment } from "../environments/environment";
import { Observable } from "rxjs/Observable";
import { Song } from "./model/song";
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { HttpUtils } from "./util/http-utils";
import { AuthService } from "./auth.service";
import { FeedItem } from "./model/fedd-item";
import { Subject } from "rxjs/Subject";
import { of } from "rxjs/observable/of";
import { Result } from "./model/result";

@Injectable()
export class MusicService {

  constructor(private httpClient: HttpClient) {
  }

  private musicUrl = environment.apiBaseUrl + '/Songs/recommend';

  private feedSource = new Subject<FeedItem>();

  feed$ = this.feedSource.asObservable();

  getRecommendedSong(text: string): Observable<Result> {
    return this.httpClient.post<Result>(this.musicUrl, {text: text}).pipe(
      tap(result => {
        let user = AuthService.getAuthenticatedUser();
        let item: FeedItem = {
          id: result.feedBody.id,
          client: user,
          song: result.songs[0],
          date: Date.now()
        };

        this.feedSource.next(item);
      })
    );
  }

}
