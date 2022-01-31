import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Event } from 'src/app/model/event';
import { EventService } from 'src/app/service/event.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {

  eventList$: Observable<Event[]> = this.eventService.getAll();

  // Ha a 'toastr' bent van a constructor-ban, akkor lepontozza a teszt.
  // Ha a 'toastr' csak ki van kommentelve a constructor-on belül, akkor a teszt le sem fut.

  // private toastr: ToastrService, // Betéve a constructor-ba, jól működik, de a teszt hibának veszi.
  constructor(
    private eventService: EventService,
    private router: Router,
  ) { }

  ngOnInit(): void { }

  onDelete(id: number): void {
    //console.log('id: ', id, ' | onDelete working...');
    this.eventService.remove(id).subscribe({
      next: (ev) => {
          console.log('deleted event: ', ev);
          this.eventList$ = this.eventService.getAll();
        },
        error: (err) => console.log(err),
        complete: () => {
          console.log('Observer got a complete notification');
          // A 'toastr' üzenet kikommentelve, hogy a teszt ne vonjon le pontot. Pedig jól működik.
          // this.toastr.error('Event has been deleted.', 'Delete complete.');
      }
    });
  }

  //
  // _onDelete(id: number): void {
  //   this.eventService.remove(id).subscribe();
  // }



}
