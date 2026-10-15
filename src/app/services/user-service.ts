import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  private url = 'https://localhost:7223/api/Users';

  getUsers() {
  return this.http.get(this.url);
}



deleteUser(id: number) {
  return this.http.delete(
    `${this.url}/${id}`,
    { responseType: 'text' }
  );
}


updateUser(id: number, role: string) {
  return this.http.put(`${this.url}/${id}/role`, null, {
    params: { role }
  });
}


  

}
