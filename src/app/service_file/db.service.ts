import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  public apiUrl = "http://localhost:3000"
  constructor(private http: HttpClient) { }
  
  getQuickNotes() {
    return this.http.get(`${this.apiUrl}/quickNotes`)
  }

  addQuickNotes(data: any) {
    return this.http.post(`${this.apiUrl}/quickNotes`, data)
  }

  editQuickNotes(data: any) {
    return this.http.put(`${this.apiUrl}/quickNotes/${data.id}`, data);
  }

  deleteQuickNotes(data: any) {
    return this.http.delete(`${this.apiUrl}/quickNotes/${data.id}`);
  }

}
