import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { enviroments } from "src/environments/environments";
import { User } from "../interfaces/user.interface";
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService{

  private baseUrl = enviroments.baseUrl;
  private user?: User; //Esta opcional porque en un punto del tiempo no va a existir. Cuando la aplicación se carga por primera vez no va a existir.

  constructor(private http: HttpClient) { }

  //Hacemos un getter para que se pueda acceder al usuario desde fuera del servicio
  get currentUser():User | undefined{
    if (!this.user) return undefined;
    return structuredClone(this.user);
  }

  login(email: string, password: string):Observable<User>{
    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap(user => {
        this.user = user;
        localStorage.setItem('token', 'sdfgaADasdfaASDFAdDsasdFADafa')
      })
    )
  }

  checkAuthentication(): Observable<boolean>{

    if (!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap( user => this.user = user ),
        map( user => !!user ), //doble negación, si !user es false, entonces !!user es true. Se asegura de devolver un booleano
        catchError( err => of(false) )
      )
  }

  logOut(){
    this.user = undefined;
    localStorage.clear();
    //Podríamos usar el removeItem, pero eso solo removería el item.
    //Con el clear borramos cualquier cosa que sea que se haya grabado en el localstorage
  }

}
