import {Component} from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss'
})
export class WidgetComponent {

  files = [
    {name: 'Project_Report.pdf', size: 2.5},
    {name: 'Design_Prototype.zip', size: 15.3},
    {name: 'Meeting_Notes.docx', size: 0.8}
  ];

}
