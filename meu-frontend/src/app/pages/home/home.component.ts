import { Component } from '@angular/core';
import { sharedImports } from '../../../shared/shared';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [...sharedImports],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  constructor() {}

}