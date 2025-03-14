import {Component} from '@angular/core';
import {WidgetComponent} from "../widget/widget.component";
import {DatePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    WidgetComponent,
    DatePipe,
    NgForOf
  ],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss', '../widget/widget.component.scss']
})
export class AppointmentsComponent {

  dummyAppointments = [
    {title: 'Zulassungsstelle WOB-VW-42', date: '2025-04-01T10:00:00'},
    {title: 'Personalausweis erneuern', date: '2025-10-16T14:00:00'}
  ];

  addToCalendar(appointment: any) {
    // Logic to add the appointment to the user's calendar
    console.log('Added to calendar:', appointment);
    alert(`Added "${appointment.title}" to your calendar.`);
  }
}
