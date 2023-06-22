import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";

import { Hero } from "../interfaces/hero.interface";
import { enviroments } from "../../../environments/environments";

@Injectable({providedIn: 'root'})
export class HeroesService{

  private baseUrl: string = enviroments.baseUrl;

  constructor(private http: HttpClient) { }

  getHeroes():Observable<Hero[]>{
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`)
  }

  getHeroById(id:string):Observable<Hero|undefined>{
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
    .pipe(
      catchError(error => of(undefined)) //of crea un observable de lo que le mandemos
    )
  }

  getSuggestions(query: string): Observable<Hero[]>{
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`)
  }

  //** CRUD
  //Create
  addHero(hero:Hero): Observable<Hero>{
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero);
  }

  //Update - usa patch porque solo quiere actualizar parcialmente el objeto, si quisiera actualizar todo el registro usar put
  updateHero(hero:Hero): Observable<Hero>{
    if (!hero.id) throw Error('Hero id is required');

    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
  }

  //Delete
  deleteHeroById(id:string): Observable<boolean>{
    return this.http.delete(`${this.baseUrl}/heroes/${id}`)
    .pipe(
      catchError(err => of(false)),
      map(resp => true)
    )
  }




}
