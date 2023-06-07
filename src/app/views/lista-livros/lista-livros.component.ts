import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, Subscription, catchError, debounceTime, filter, map, switchMap, throwError } from 'rxjs';
import { Item, Livro } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/services/livro.service';

const pausa = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  
  campoBusca = new FormControl();
  mensagemErro = '';

  /*
  listaLivros: Livro[];
  subscription: Subscription;
  livro: Livro;
  */
  

  constructor(
    private service: LivroService
  ) { }

  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(pausa),
      filter((valorDigitado) => valorDigitado.length >= 3),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      /*
      A ideia desse operador é trocar os valores e passar ao servidor só o último valor, cancelando todas as requisições anteriores.
      */
      map(items => this.livrosResultadoParaLivros(items)),
      catchError(error => {
        this.mensagemErro = 'Ops. Ocorreu um erro. Recarregue a aplicação'
        return EMPTY
        /*
        cria um Observable simples que não emite nenhum item para o Observer 
        e que emite imediatamente uma notificação de "Complete" para encerrar o seu ciclo de vida.
        */
        /* 
        return throwError(() => {
          new Error(this.mensagemErro = 'Ops.. deu um erro. Recarregue a aplicação')
        })
        */
      })
      /*
        O catchError() não emite valores, somente captura o erro e inscreve em outro Observable — um que possua alguma mensagem de erro, por exemplo. 
        O throwError(), por sua vez, retorna um novo Observable que emite imediatamente o erro e encerra o seu ciclo de vida.
      */
    )
  /*
  É uma convenção da comunidade usar o "$" (símbolo de dólar) ao final de uma variável que representa um Observable.
  */

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[]{
    return items.map(item => {
      return new LivroVolumeInfo(item)
    });
  }

  /*
    buscarLivros(){
      this.subscription = this.service.buscar(this.campoBusca).subscribe({
        next: (items) => {
          this.listaLivros = this.livrosResultadoParaLivros(items)
        },
        error: erro => console.error
      })
    }

    ngOnDestroy(){
      this.subscription.unsubscribe()
    }
  */

}



