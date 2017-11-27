import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/operators/switchMap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {

  movies$: Observable<any[]>;
  private cacheMovies$: Observable<any[]>;
  private searchTerms$: Subject<string> = new Subject<string>();

  ngOnInit(): void {

    this.cacheMovies$ = Observable.of<any[]>([
      { name: 'Guardians of the Galaxy' },
      { name: 'Iron Man' },
      { name: 'Avengers' },
      { name: 'Justice League' },
      { name: 'Thor: Ragnarok' }
    ]);

    this.movies$ = this.searchTerms$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap<string, any[]>((term: string) => {          
          return (term)
            ? this.cacheMovies$
              .pipe(
                map((movies: any[], index: number) => {          
                  return movies.filter((movie: any) => movie.name.toLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
                })
              )
            : this.cacheMovies$;
        })
      ).catch(err => {
          console.log(err);
          return Observable.of<any[]>([]);
      });

  }

  ngAfterViewInit(): void {
    this.onSearch('');
  }

  onSearch(term: string): void {
    this.searchTerms$.next(term);
  }

}
