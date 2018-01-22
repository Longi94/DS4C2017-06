import { Song } from "./song";
import { Client } from "./client";

export class FeedItem {
  id: string;
  client: Client;
  song: Song;
  date: string;
}
