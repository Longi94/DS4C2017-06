import { Song } from "./song";

export class FeedItem {
  id: number;
  user: string;
  song: Song;
  timestamp: Date;
}
