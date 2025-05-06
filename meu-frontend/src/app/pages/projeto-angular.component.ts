import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // Importando RouterModule

@Component({
  selector: 'app-projeto-angular',
  standalone: true,  // Indica que é um componente standalone
  imports: [RouterModule],  // Importando RouterModule para usar router-outlet
  templateUrl: './projeto-angular.component.html',
  styleUrl : './projeto-angular.component.scss'
})
export class ProjetoAngularComponent {

}