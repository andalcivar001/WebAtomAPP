import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, Login } from '../models/User';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) {}

  getUserByEmail(email: string): Observable<Login> {
    return this._http.get<Login>(
      `${environment.usersUrls.getUserByEmailApi}/${email}`
    );
  }

  createUser(email: string): Observable<User> {
    return this._http.post<User>(environment.usersUrls.CreateUserApi, {
      email,
    });
  }
}
