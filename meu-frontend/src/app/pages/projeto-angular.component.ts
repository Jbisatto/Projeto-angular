import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';  // Importando RouterModule
import { sharedImports } from '../../shared/shared';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-projeto-angular',
  standalone: true,  // Indica que é um componente standalone
  imports: [...sharedImports, RouterModule],  // Importando RouterModule para usar router-outlet
  templateUrl: './projeto-angular.component.html',
  styleUrl : './projeto-angular.component.scss'
})
export class ProjetoAngularComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redireciona para a página de login
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}