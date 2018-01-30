import { Song } from "./song";
import { FeedBody } from "./feed-body";

export class Result {
  songs: Song[];
  tone: object;
  personality: object;
  feedBody: FeedBody;
}
