import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { catchError } from "rxjs/operators";
import { HttpUtils } from "./util/http-utils";
import { ChatMessage } from "./model/chat-message";

@Injectable()
export class ChatService {

  constructor(private httpClient: HttpClient) {
  }

  private chatUrl = environment.apiBaseUrl + '/chat';

  sendMessage(text: string): Observable<ChatMessage> {
    const response: ChatMessage = {text: "what???", fromBot: true};
    return this.httpClient.post<ChatMessage>(this.chatUrl, {message: text}).pipe(
      catchError(HttpUtils.handleError("sendMessage", response))
    );
  }

}
