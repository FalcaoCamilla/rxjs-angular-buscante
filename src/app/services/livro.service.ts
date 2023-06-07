import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Item, LivrosResultado } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LivroService {

  private readonly API = 'https://www.googleapis.com/books/v1/volumes';

  constructor(
    private http: HttpClient
  ) { }

  buscar(valor: string): Observable<Item[]>{
    const params = new HttpParams().append('q', valor)
    return this.http.get<LivrosResultado>(this.API, {params}).pipe(
      tap((retornoAPI) => {console.log(retornoAPI)}),
      map(resultado => resultado.items),
      tap(resultado => console.log(`Fluxo após o map`))
    )
    /*
    Pipe- Função que serve para agrupar múltiplos operadores. Não modifica o observable anterior.
    Tap - Operador de serviços públicos. Usado para debugging. Não modifica o observable.
    Map - Operador de transformação. Transforma o observable de acordo com a função passada. Retorna um observable modificado.
    */
  }
}
