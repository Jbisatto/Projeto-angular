import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BpmnEditorComponent } from './flowchart/flowchart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  //imports: [BpmnEditorComponent],
  //template: `<app-bpmn-editor></app-bpmn-editor>`
  imports: [RouterModule], // adicione aqui o RouterModule
  templateUrl: './app.component.html',
})
export class AppComponent {}
