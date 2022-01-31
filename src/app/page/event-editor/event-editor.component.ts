import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EventService } from 'src/app/service/event.service';
import { Event } from 'src/app/model/event';
import { FormGroup, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-editor',
  templateUrl: './event-editor.component.html',
  styleUrls: ['./event-editor.component.scss']
})
export class EventEditorComponent implements OnInit {

  // 1. Kiolvasni az id paramétert az URL-ből.
  // 2. Ezzel a paraméterrel meghívni az EventService.get metódust.
  event$: Observable<Event> = this.activatedRoute.params.pipe(
    switchMap(params => {
      //console.log('id: ', params);
      //console.log('newEvent: ', new Event());
      //console.log('newEvent$: ', this.newEvent$);
      //this.newEvent$.subscribe(data => console.log('in :', data));

      let eventFromList$: Observable<Event> = this.eventService.get(params['id']);


      // Ha új eseményt kell létrehozi, akkor kell egy observable, ami egy űres Event-et tartalmaz
      if (params['id'] === '0') {
        this.newEvent$.subscribe(ev => console.log('newEvent:', ev));
        return this.newEvent$;
      }

      eventFromList$.subscribe(event => {console.log('log3: ', event)})
      return eventFromList$
    })
  );

  // Új Eventet egy Observable hozza.
  newEvent$: Observable<Event> = new Observable(subscriber => {
    subscriber.next(new Event());
  });


  // Ha a 'toastr' bent van a constructor-ban, akkor lepontozza a teszt.
  // Ha a 'toastr' csak ki van kommentelve a constructor-on belül, akkor a teszt le sem fut.

  // private toastr: ToastrService, // Betéve a constructor-ba, jól működik, de a teszt hibának veszi.
  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private router: Router,
  ) { }

  ngOnInit(): void { }

  //* 5.2
  //* Az EditorComponent osztályában az onUpdate metódusban vizsgáld meg,
  //* hogy 0-e az id-je az eseménynek, és ha igen, akkor az EventService create
  //* metódusát hívd meg, átadva neki az esemény adatait.

  private isNewEvent: boolean = false;

  onUpdate(formForm: NgForm, event: Event): void {
    console.log(formForm.submitted);
    console.log(event);

    // if (event.id === 0) {
    //   this.eventService.create(event).subscribe()
    // }
    // this.eventService.update(event).subscribe();

    if (event.id === 0) {
      this.isNewEvent = true;
      this.eventService.create(event).subscribe({
        next: (event) => {
          console.log('create event: ', event);
          // A táblázat oldalára a visszaugrás kikommentelve, hogy lehessen látni a küldés gomb letiltását.
          // this.router.navigate(['/']);
        },
        error: (err: Error) => console.error('Observer got an error: ' + err),
        complete: () => {
          console.log('Observer got a complete notification');
          // this.toastr.success('New event has been added to the list.', 'Create complete.');
        },
      });
    }

    // A 'this.eventService.create(event).subscribe...'-al az új esetmény id-je már nem 0, ezért az 'update' is lefutna.
    // Ezért az 'isNewEvent' változó jelzi, hogy az event egy új event, ezét az 'update'-nek nem kell lefutnia.

    if (event.id !== 0 && !this.isNewEvent) {
      this.isNewEvent = false;
      this.eventService.update(event).subscribe({
        next: (event) => {
          console.log('update event: ', event);
          // A táblázat oldalára a visszaugrás kikommentelve, hogy lehessen látni a küldés gomb letiltását.
          // this.router.navigate(['/']);
        },
        error: (err: Error) => console.error('Observer got an error: ' + err),
        complete: () => {
          console.log('Observer got a complete notification');
          // this.toastr.info('Event has been updeted.', 'Update complete.');
        },
      });
    }

    //* Extra feladat
    //* 2. Ne lehessen többször a mentés gombra kattintani, a mentés megkezdésekor kerüljön a gomb letiltásra.
    // Működik, de kiváltottam a html-ben. A gombnál: [disabled]="eventForm.submitted"
    //const submitButton = document.querySelector("#submitButton")
    //submitButton?.setAttribute('disabled', 'true');
    //const submitButtonSpan = document.querySelector("#submitButton");
    //submitButtonSpan?.textContent='Updated';  // A gomba írás nem működik.

  }


}
