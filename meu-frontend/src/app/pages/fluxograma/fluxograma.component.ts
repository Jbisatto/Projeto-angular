import { Component } from '@angular/core';
import { sharedImports } from '../../../shared/shared';
import { BpmnEditorComponent } from '../../flowchart/flowchart.component';

@Component({
  selector: 'app-fluxograma',
  standalone: true,
  imports: [...sharedImports, BpmnEditorComponent],
  templateUrl: './fluxograma.component.html',
  styleUrl : './fluxograma.component.scss'
})
export class FluxogramaComponent {

  modoInfo: boolean = false;
}