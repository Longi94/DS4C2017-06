import { Song } from "./song";
import { User } from "./user";

export class FeedItem {
  id: string;
  client: User;
  song: Song;
  date: string;
}
