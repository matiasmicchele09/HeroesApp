import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeroPageComponent } from './pages/hero-page/hero-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [ //Tambien podríamos usar el loadChildren que es el lazyLoad, pero este módulo ya se carga en lazyLoad, asi que
                //a menos que este sea un componente exagereadamente grande no tiene sentido
      { path: 'new-hero', component: NewPageComponent },
      { path: 'search',   component: SearchPageComponent },
      { path: 'edit/:id', component: NewPageComponent },
      { path: 'list',     component: ListPageComponent },
      { path: ':id',      component: HeroPageComponent }, /*Este es como un comodín, si nosotros lo pusieramos al inicio
       de esta lista de rutas entonces nunca bajaría buscando las demas, porque, por ej., el id seria 'new-hero',
       'search', etc. Entonces la ponemos al final para que se verifique que las demas rutas existen */
       { path: '**',      redirectTo: 'list' }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeroesRoutingModule { }
