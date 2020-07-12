import { Component, OnInit, Inject, HostListener } from '@angular/core';

import { Character } from '@shared/components/interfaces/character.interface';
import { CharacterService } from '@shared/services/character.service';
import { take, filter } from 'rxjs/operators'
import { ActivatedRoute, ParamMap, Router, NavigationEnd } from '@angular/router';

import { DOCUMENT } from '@angular/common';

type RequestInfo = {
  next: string;
};

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];
  private pageNum = 1;
  info: RequestInfo = {
    next: null
  };
  private query: string;
  private hideScroll = 200;
  private showScroll = 500;
  showGoUpButton = false;
  
  constructor(
    @Inject(DOCUMENT) private document: Document, 
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.onChangeUrl();
  }

  ngOnInit(): void {
    //this.getDataFromService();
    this.getCharactersFormSearch();
  }

  @HostListener('window:scroll',[])
  onWindowsScroll():void{
    const yOffSet = window.pageYOffset;
    if((yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop) > this.showScroll){
      this.showGoUpButton = true;
    }else if((this.showGoUpButton && (yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop)) < this.hideScroll ){
      this.showGoUpButton = false;
    }
  }

  onScrollDown(): void {
    if(this.info.next){
      this.pageNum++;
      this.getDataFromService();
    }
  }

  onScrollTop():void {
    this.document.body.scrollTop = 0; //Safari
    this.document.documentElement.scrollTop = 0; //Otros navegadores
  }

  private onChangeUrl(): void{
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd))
      .subscribe(
        () => {
          this.characters = [];
          this.pageNum = 1;
          this.getCharactersFormSearch();
        }
      )
  }

  private getCharactersFormSearch(): void{
    this.route.queryParams
      .pipe(take(1))
      .subscribe((params: ParamMap) => {
        this.query = params['q'];
        console.log("Parametro: ", params);
        this.getDataFromService();
      })
  }

  private getDataFromService(): void{
    this.characterService.searchCharacter(this.query, this.pageNum)
      .pipe(take(1))
      .subscribe((respuesta: any) => {
        if(respuesta?.results?.length){
          const { info, results } = respuesta;
          this.characters = [... this.characters, ... results];
          this.info = info;
        } else {
          this.characters = [];
        }
      })
  }
}
