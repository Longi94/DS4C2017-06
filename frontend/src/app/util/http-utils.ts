import { of } from "rxjs/observable/of";
import { Observable } from "rxjs/Observable";

export class HttpUtils {
  public static handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
