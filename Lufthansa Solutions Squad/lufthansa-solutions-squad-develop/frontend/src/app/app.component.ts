import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ChatComponent} from "./chatbot/components/chat/chat.component";
import {HeaderComponent} from "./header/header.component";
import {DashboardComponent} from "./dashboard/components/dashboard/dashboard.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ChatComponent, HeaderComponent, DashboardComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'hackathon';
}
