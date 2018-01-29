import { Song } from "./song";
import { User } from "./user";
import { FeedBody } from "./feed-body";

export class FeedItem {
  id: string;
  client: User;
  song: Song;
  date: number;
}
