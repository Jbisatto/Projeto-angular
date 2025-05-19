import { Routes } from '@angular/router';
import { ProjetoAngularComponent } from './pages/projeto-angular.component';
import { PessoaCadastroComponent } from './pages/pessoa/cadastro/pessoa-cadastro.component';
import { PessoaConsultaComponent } from './pages/pessoa/consulta/pessoa-consulta.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './app.guard';
import { LoginCadastroComponent } from './pages/login/cadastro/login-cadastro.component';
import { FluxogramaComponent } from './pages/fluxograma/fluxograma.component';

export const routes: Routes = [
  {
    path: '',
    component: ProjetoAngularComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'pessoa-cadastra', component: PessoaCadastroComponent },
      { path: 'fluxograma', component: FluxogramaComponent },
      { path: 'pessoa-consulta', component: PessoaConsultaComponent },
      { path: '', component: HomeComponent },
      { path: '404', component: NotFoundComponent }
    ]
  },
  { path: 'login-cadastro', component: LoginCadastroComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/404' }
];