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

@Injectable()
export class MusicService {

  constructor(private httpClient: HttpClient) {
  }

  private musicUrl = environment.apiBaseUrl + '/music';

  private feedSource = new Subject<FeedItem>();

  feed$ = this.feedSource.asObservable();

  getRecommendedSong(text: string): Observable<Song> {
    let dummySong: Song = new Song("dummyTitle", "dummyArtist");

    return /*this.httpClient.post<Song>(this.musicUrl, {text: text})*/of(dummySong).pipe(
      tap(song => {
        let user = AuthService.getAuthenticatedUser();
        let item: FeedItem = {
          id: 0,
          user: user.username,
          song: song,
          timestamp: new Date()
        };

        this.feedSource.next(item);
      }),
      catchError(HttpUtils.handleError("song", dummySong))
    );
  }

}
