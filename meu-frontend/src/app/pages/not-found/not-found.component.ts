import { Component } from '@angular/core';
import { sharedImports } from '../../../shared/shared';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [...sharedImports],
  templateUrl: './not-found.component.html',
  styleUrl : './not-found.component.scss'
})
export class NotFoundComponent {

  constructor() {}

}