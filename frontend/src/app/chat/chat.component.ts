import { Component, OnInit } from '@angular/core';
import { ChatService } from "../chat.service";
import { ChatMessage } from "../model/chat-message";
import { animate, keyframes, state, style, transition, trigger } from "@angular/animations";
import { AuthService } from "../auth.service";
import { MusicService } from "../music.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Song } from "../model/song";

declare function createCharts(personalities: object[], tones: object[], songs: object[]): any;
declare function changeCharts(index: number): any;
declare function clearCharts();

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
    trigger('flyInFromLeft', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        animate(400, keyframes([
          style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
          style({opacity: 1, transform: 'translateX(15px)', offset: 0.4}),
          style({opacity: 1, transform: 'translateX(0)', offset: 1.0})
        ]))
      ])
    ]),
    trigger('flyInFromRight', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        animate(400, keyframes([
          style({opacity: 0, transform: 'translateX(100%)', offset: 0}),
          style({opacity: 1, transform: 'translateX(-15px)', offset: 0.4}),
          style({opacity: 1, transform: 'translateX(0)', offset: 1.0})
        ]))
      ])
    ])
  ]
})
export class ChatComponent implements OnInit {

  constructor(private chatService: ChatService,
              private authService: AuthService,
              private musicService: MusicService,
              private modalService: NgbModal) {
  }

  authenticated: boolean;
  loading = false;

  ngOnInit() {
    this.authenticated = AuthService.authenticated();
  }

  messageInput: string = "";
  messages: ChatMessage[] = [];
  wordCount: number = 0;
  resultSongs: Song[] = null;
  alert: string = "";
  showResult: boolean = false;

  sendMessage() {
    let message = this.messageInput.replace(/\s\s+/g, ' ');
    if (message === "" || message === " ") {
      return;
    }
    this.loading = true;
    this.messages.push({text: this.messageInput, fromBot: false});
    this.wordCount += message.split(' ').length;

    this.chatService.sendMessage(this.messageInput).subscribe(response => {
      this.messages.push({text: response.response, fromBot: true});
      this.loading = false;
    });
    this.messageInput = "";
  }

  retry() {
    this.showResult = false;
    this.loading = false;
    this.resultSongs = null;
    this.wordCount = 0;
    this.messages = [];
    this.messageInput = "";
    clearCharts();
  }

  getRecommendation(resultModal) {
    if (this.wordCount < 100) {
      return;
    }

    this.alert = "";
    this.loading = true;

    let fullText = this.messages
      .filter(message => !message.fromBot)
      .map(message => message.text)
      .join('. ');

    this.musicService.getRecommendedSong(fullText).subscribe(result => {
      this.resultSongs = result.songs;

      this.showResult = true;

      let persAxes = [];

      for (let key in result.personality) {
        persAxes.push({
          axis: key.replace("big5_", ""),
          value: result.personality[key] + 0.1
        });
      }

      let toneAxes = [];
      for (let key in result.tone) {
        toneAxes.push({
          axis: key,
          value: result.tone[key] + 0.1
        });
      }

      persAxes.sort((a, b) => {
        if (a.axis < b.axis)
          return -1;
        if (a.axis > b.axis)
          return 1;
        return 0;
      });

      toneAxes.sort((a, b) => {
        if (a.axis < b.axis)
          return -1;
        if (a.axis > b.axis)
          return 1;
        return 0;
      });

      createCharts(
        [{axes: persAxes, className: 'user-score'}],
        [{axes: toneAxes, className: 'user-score'}],
        this.resultSongs
      );
    }, error => {
      console.error(error);
      this.alert = "Uh oh!, Something went wrong!";
    });
  }

  changeChartsProxy(index: number) {
    changeCharts(index);
  }
}
