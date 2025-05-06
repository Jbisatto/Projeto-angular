import { Component, OnInit } from '@angular/core';
import { sharedImports } from '../../../../shared/shared';
import { PessoaService } from '../pessoa.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';

@Component({
  selector: 'app-pessoa-consulta',
  standalone: true,
  imports: [...sharedImports],
  templateUrl: './pessoa-consulta.component.html'
})
export class PessoaConsultaComponent implements OnInit {

  pessoas: any;

  constructor(
    private pessoaService: PessoaService,
    private notificacao: NotificacaoService
  ) {
  }
  ngOnInit(): void {
    this.carregarPessoas();
  }

  carregarPessoas(){
    this.pessoaService.listar().subscribe({
      next: res => {
        this.pessoas = res;
      },
      error: err => {
        console.error('Erro ao carregar os dados', err);
      }
    });
  }

  deletar(id: number) {
      this.pessoaService.deletar(id).subscribe({
        next: () => {
            this.notificacao.mostrar('Pessoa deletada!');
            this.carregarPessoas();
          },
          error: () => this.notificacao.mostrar('Erro ao deletar pessoa')
    });
}
  

  editar(pessoa: any){
    this.pessoaService.editar(pessoa).subscribe({
      next: () => this.notificacao.mostrar('Pessoa editada com sucesso!'),
      error: () => this.notificacao.mostrar('Erro ao editar pessoa')
    });
  }
}