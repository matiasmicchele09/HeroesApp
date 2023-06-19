import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PagesComponent } from './shared/pages/error404-pages/error404-pages.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule)
  },
  {
    path: 'heroes',
    loadChildren: () => import('./heroes/heroes.module').then( m => m.HeroesModule)
  },
  {
    path: '404',
    component: Error404PagesComponent
  },
  {
    path: '',
    redirectTo: 'heroes'   ,
    pathMatch: 'full' //Esto es para que tome exactamente el path vacio, es decir, el ''.
    //Que solo redirija cuando el path sea exactamente '', porque por ej, aunque no se note, entre en 'auth' entre el ' y la a
    //hay un string vacío. Entonces para evitar esa redirección con cualquier ruta es que se pone el pathMatch full
  },
  {
    path: '**', //Cualquier otro path que no sea cualquiera de los definidos arriba, incluido el vacío
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
