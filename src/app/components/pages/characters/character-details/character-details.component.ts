import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from '@app/shared/components/interfaces/character.interface';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from '@app/shared/services/character.service';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss']
})
export class CharacterDetailsComponent implements OnInit {
  character$: Observable<Character>;

  constructor(
    private route: ActivatedRoute,
    private characterService: CharacterService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe((params) => {
      const id = params['id'];
      this.character$ = this.characterService.getDetails(id);
    })
  }

  regresar(): void {
    this.location.back();
  }

}
