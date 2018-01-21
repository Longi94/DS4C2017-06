import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { catchError } from "rxjs/operators";
import { HttpUtils } from "./util/http-utils";
import { ChatResponse } from "./model/chat-response";

@Injectable()
export class ChatService {

  constructor(private httpClient: HttpClient) {
  }

  private chatUrl = environment.apiBaseUrl + '/Chatbots/chat';

  sendMessage(text: string): Observable<ChatResponse> {
    const response: ChatResponse = {response: "what???"};
    return this.httpClient.post<ChatResponse>(this.chatUrl, {userInput: text}).pipe(
      catchError(HttpUtils.handleError("sendMessage", response))
    );
  }

}
