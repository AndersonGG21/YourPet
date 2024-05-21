import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pet } from '@models/pet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private PETS_API = "https://veterinariapdyp.azurewebsites.net/api/Mascota";
  constructor(private httpClient : HttpClient) { }

  getPets() : Observable<Pet[]> { 
    return this.httpClient.get<Pet[]>(this.PETS_API);
  }

  getRandImage(raza: string) : Observable<any> {
    raza = raza.toLowerCase();
    return this.httpClient.get<any>(`https://dog.ceo/api/breed/${raza}/images/random`);
  }

  deletePet(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.PETS_API}/${id}`);
  }

  savePet(pet: Pet): Observable<Pet> {
    return this.httpClient.post<Pet>(this.PETS_API, pet);
  }

  updatePet(id: number, pet: Pet): Observable<Pet> {    
    return this.httpClient.put<Pet>(`${this.PETS_API}/${id}`, pet);
  }
}
