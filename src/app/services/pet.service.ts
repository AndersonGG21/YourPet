import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pet } from '@models/pet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private PETS_API = "http://localhost:8080/";
  constructor(private httpClient : HttpClient) { }

  getPets() : Observable<Pet[]> {
    return this.httpClient.get<Pet[]>(this.PETS_API);
  }

  getRandImage(raza: string) : Observable<any> {
    raza = raza.toLowerCase();
    return this.httpClient.get<any>(`https://dog.ceo/api/breed/${raza}/images/random`);
  }
}
