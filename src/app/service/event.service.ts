import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Event } from '../model/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  eventsUrl: string = "https://nettuts.hu/jms/feladat/events";

  constructor(
    private http: HttpClient) {
  }

  getAll(): Observable<Event[]> {
    return this.http.get<Event[]>(this.eventsUrl);
  }

  get(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.eventsUrl}/${id}`);
  }

  update(event: Event): Observable<Event> {
    console.log('update working...');
    return this.http.patch<Event>(
      `${this.eventsUrl}/${event.id}`, event)
  }


  //* 3. Create metódus az EventService-ben.
  //* Hozd létre a create metódust, amely hozzáadja a kapott eseményt a list tömbhöz,
  //* majd a list$-on keresztül értesíti a feliratkozókat, hogy módosultak az adatok (az update metódushoz hasonlóan).

  create(event: Event): Observable<Event> {
    console.log('create working...');
    //const url = `${this.eventsUrl}/${event.id}`;
    const url = `${this.eventsUrl}`;  // érdekes módon, csak akkor működik, ha nincs megadva id-azonosító a címben
    console.log(event);
    console.log(url);
    return this.http.post<Event>(url, event).pipe(
      catchError(this.handleError<any>('create', []))
    )
  }


  //* 4. Remove metódus az EventService-ben.
  //* Hozd létre a remove metódust, amely eltávolít egy elemet a kapott id alapján a list tömbből,
  //* majd a list$-on keresztül értesíti a feliratkozókat, hogy módosultak az adatok (az update metódushoz hasonlóan).

  remove(id: number): Observable<Event> {
    console.log('remove working... | id: ', id);
    const url = `${this.eventsUrl}/${id}`;
    return this.http.delete<Event>(url).pipe(
      catchError(this.handleError<any>('create', []))
    )
  }


  private handleError<T>(operation: string = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }

}
