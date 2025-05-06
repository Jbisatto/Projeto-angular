import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {

  constructor(private snackBar: MatSnackBar) {}

  mostrar(mensagem: string, acao: string = 'Fechar', duracao: number = 3000) {
    this.snackBar.open(mensagem, acao, {
      duration: duracao,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}