import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Medicine } from '@models/medicine';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

  readonly MEDICINE_API = "https://localhost:44310/api/Medicamento";
  constructor(private httpClient : HttpClient) { }

  getMedicines() : Observable<any[]>{
    return this.httpClient.get<any[]>(this.MEDICINE_API);
  }

  deleteMedicine(id: number) : Observable<any> {
    return this.httpClient.delete<any>(`${this.MEDICINE_API}/${id}`);
  }

  saveMedicine(medicine : Medicine) : Observable<any> {
    return this.httpClient.post<Medicine>(this.MEDICINE_API, medicine);
  }

  updateMedicine(id: number,medicine : Medicine) : Observable<any> {
    return this.httpClient.put<any>(`${this.MEDICINE_API}/${id}`, medicine);
  }


}
