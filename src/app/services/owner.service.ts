import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Owner } from '@models/owner';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  readonly OWNERS_API = "http://localhost:44310/api/Cliente";

  constructor(private httpClient : HttpClient) { }

  getRandImage(gender : string) : Observable<any> {    
    return this.httpClient.get<any>(`https://randomuser.me/api/?inc=picture&gender=${gender}`);
  }

  getOwners() : Observable<Owner[]> {
    return this.httpClient.get<Owner[]>(this.OWNERS_API);
  }

  deleteOwner(id: number) : Observable<any> {
    return this.httpClient.delete<any>(`${this.OWNERS_API}/${id}`);
  }

  saveOwner(owner : Owner) : Observable<any> {
    return this.httpClient.post<Owner>(this.OWNERS_API, owner);
  }

  updateOwner(id: number, owner: Owner) : Observable<any> {
    return this.httpClient.put<Owner>(`${this.OWNERS_API}/${id}`, owner);
  }
}
