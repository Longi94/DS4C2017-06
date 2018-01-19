import { Component, OnInit } from '@angular/core';
import { ChatService } from "../chat.service";
import { ChatMessage } from "../model/chat-message";
import { animate, keyframes, state, style, transition, trigger } from "@angular/animations";

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
          style({opacity: 1, transform: 'translateX(15px)',  offset: 0.4}),
          style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
        ]))
      ])
    ]),
    trigger('flyInFromRight', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        animate(400, keyframes([
          style({opacity: 0, transform: 'translateX(100%)', offset: 0}),
          style({opacity: 1, transform: 'translateX(-15px)',  offset: 0.4}),
          style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
        ]))
      ])
    ])
  ]
})
export class ChatComponent implements OnInit {

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
  }

  messageInput: string = "";
  messages: ChatMessage[] = [];

  sendMessage() {
    if (this.messageInput === "") {
      return;
    }
    this.messages.push({text: this.messageInput, fromBot: false});
    this.messageInput = "";
    this.chatService.sendMessage(this.messageInput).subscribe(response => {
      this.messages.push(response);
    });
  }

}
