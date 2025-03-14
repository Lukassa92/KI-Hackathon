import {Component} from '@angular/core';
import {NgForOf} from "@angular/common";
import {WidgetComponent} from "../widget/widget.component";

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    NgForOf,
    WidgetComponent
  ],
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss', '../widget/widget.component.scss']
})
export class FilesComponent {

  files = [
    {name: 'Important Form', type: "PDF", size: 2.5},
    {name: 'Simple Instruction', type: "zip", size: 150.3},
    {name: 'Fill Me Out', type: "PDF", size: 0.8}
  ];

}
