import {Component} from '@angular/core';
import {WidgetComponent} from "../widget/widget.component";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    WidgetComponent,
    NgOptimizedImage
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

}
