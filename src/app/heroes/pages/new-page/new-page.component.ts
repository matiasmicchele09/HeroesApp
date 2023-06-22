import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  //Formulario reactivo
  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl(''),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    {id: 'DC Comics', desc: 'DC-Comics'},
    {id: 'Marvel Comics', desc: 'Marvel-Comics'}
  ];

  constructor( private heroesService: HeroesService,
               private activatedRoute: ActivatedRoute,
               private router: Router,
               private snackbar: MatSnackBar,
               private dialog: MatDialog ){}



               get currentHero(): Hero {
                const hero = this.heroForm.value as Hero;
                return hero;
              }

  ngOnInit(): void {

    if (!this.router.url.includes('edit')) return;

    //Los params los desestructura y toma el id
    this.activatedRoute.params
    .pipe(
      switchMap(({id}) => this.heroesService.getHeroById(id)),
    ).subscribe( hero => {
        if (!hero) return this.router.navigateByUrl('/');

        this.heroForm.reset(hero);
        return;
        /* El reset funciona hace dos funciones uno regresa al formulario a su valor original y si ustedes le mandan
        un argumento como el que tienen acá, entonces automáticamente establece cada uno de los campos cuyos
        nombres coincidan con los de mi formulario, que casualmente todos los nombres están exactamente igual
        a como lo recibo yo del bucle. */
    })
  }

  onSubmit():void{
    console.log("aca");

    if (this.heroForm.invalid) return;

    //Si existe lo actualizo, sino lo creo
    if ( this.currentHero.id ){
      this.heroesService.updateHero(this.currentHero)
      .subscribe(hero => {
        this.showSnackbar(`¡${ hero.superhero } actualizado!`);
      });
      return;
    }

    this.heroesService.addHero(this.currentHero)
    .subscribe( hero => {
      this.showSnackbar(`¡${ hero.superhero } creado!`);
      this.router.navigate(['heroes/edit', hero.id])
    })

  }

  onDeleteHero() {
    if ( !this.currentHero.id ) throw Error('Hero id is required');

    const dialogRef = this.dialog.open( ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        filter( (result: boolean) => result ),
        switchMap( () => this.heroesService.deleteHeroById( this.currentHero.id )),
        filter( (wasDeleted: boolean) => wasDeleted ),
      )
      .subscribe(() => {
        this.router.navigate(['/heroes']);
      });

    // dialogRef.afterClosed().subscribe(result => {
    //   if ( !result ) return;

    //   this.heroesService.deleteHeroById( this.currentHero.id )
    //   .subscribe( wasDeleted => {
    //     if ( wasDeleted )
    //       this.router.navigate(['/heroes']);
    //   })
    // });

  }


  showSnackbar(message: string):void{
    this.snackbar.open(message, 'done', {
      duration: 2500,
    })
  }



}
