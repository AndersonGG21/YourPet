import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  constructor(private httpClient : HttpClient) { }

  getRandImage(gender : string) : Observable<any> {    
    return this.httpClient.get<any>(`https://randomuser.me/api/?inc=picture&gender=${gender}`);
  }
}
