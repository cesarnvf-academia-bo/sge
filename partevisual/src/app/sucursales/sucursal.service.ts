import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sucursal } from './sucursal';

@Injectable({
  providedIn: 'root',
})
export class SucursalService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/v1/sucursal';

  getSucursales(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(this.baseUrl);
  }

  getSucursal(id: number): Observable<Sucursal> {
    return this.http.get<Sucursal>(`${this.baseUrl}/${id}`);
  }

  createSucursal(sucursal: Partial<Sucursal>): Observable<Sucursal> {
    return this.http.post<Sucursal>(this.baseUrl, sucursal);
  }

  updateSucursal(id: number, sucursal: Partial<Sucursal>): Observable<Sucursal> {
    return this.http.put<Sucursal>(`${this.baseUrl}/${id}`, sucursal);
  }

  deleteSucursal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}