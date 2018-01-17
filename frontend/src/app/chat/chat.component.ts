import { Component, OnInit } from '@angular/core';
import { ChatService } from "../chat.service";
import { ChatMessage } from "./chat-message";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
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
