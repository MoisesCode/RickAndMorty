import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

import { Character } from '@shared/components/interfaces/character.interface';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(private http: HttpClient) { }

  searchCharacter(query= '', page: number) {
    const filter = `${environment.baseUrlApi}/?name=${query}&page=${page}`;
    return this.http.get<Character[]>(filter)
  }

  getDetails(id: number) {
    return this.http.get<Character>(`${environment.baseUrlApi}/${id}`)
  }
}
