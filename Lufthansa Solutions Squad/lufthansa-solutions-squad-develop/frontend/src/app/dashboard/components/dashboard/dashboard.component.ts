import {Component} from '@angular/core';
import {FilesComponent} from "../files/files.component";
import {WidgetComponent} from "../widget/widget.component";
import {AppointmentsComponent} from "../appointments/appointments.component";
import {ChatComponent} from "../../../chatbot/components/chat/chat.component";
import {UserComponent} from "../user/user.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FilesComponent,
    WidgetComponent,
    AppointmentsComponent,
    ChatComponent,
    UserComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
