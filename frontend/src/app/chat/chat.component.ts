import { Component, OnInit } from '@angular/core';
import { ChatService } from "../chat.service";
import { ChatMessage } from "../model/chat-message";
import { animate, keyframes, state, style, transition, trigger } from "@angular/animations";
import { AuthService } from "../auth.service";
import { MusicService } from "../music.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Song } from "../model/song";

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

  ngOnInit() {
    this.authenticated = this.authService.authenticated();
  }

  messageInput: string = "";
  messages: ChatMessage[] = [];
  wordCount: number = 0;
  resultSong: Song = null;

  sendMessage() {
    let message = this.messageInput.replace(/\s\s+/g, ' ');
    if (message === "" || message === " ") {
      return;
    }
    this.messages.push({text: this.messageInput, fromBot: false});
    this.wordCount += message.split(' ').length;

    this.chatService.sendMessage(this.messageInput).subscribe(response => {
      this.messages.push({text: response.response, fromBot: true});
    });
    this.messageInput = "";
  }

  getRecommendation(resultModal) {
    if (this.wordCount < 100) {
      return;
    }

    let fullText = this.messages
      .filter((message) => !message.fromBot)
      .map((message) => message.text)
      .join('. ');

    this.musicService.getRecommendedSong(fullText).subscribe(song => {
      this.resultSong = song;
      this.modalService.open(resultModal).result.then((result) => {
        this.resultSong = null;
        this.wordCount = 0;
        this.messages = [];
        this.messageInput = "";
      })
    });
  }
}
