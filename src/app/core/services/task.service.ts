import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task } from '../models/Task.model';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  token?: string;

  constructor(
    private _http: HttpClient,
    private _localStorageService: LocalStorageService
  ) {}

  // Método privado para obtener los encabezados
  private getHeaders(): HttpHeaders {
    const header = new HttpHeaders({
      Authorization: `Bearer ${this._localStorageService.getItem('token')}`, // Enviar el token en los encabezados
    });
    return header;
  }

  // Métodos de la API usando el método privado para los encabezados

  getTasks(): Observable<Task[]> {
    return this._http.get<Task[]>(`${environment.TasksUrls.getTaskApi}`, {
      headers: this.getHeaders(),
    });
  }

  getTaskById(id: string): Observable<Task> {
    return this._http.get<Task>(
      `${environment.TasksUrls.getTaskByIdApi}/${id}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  createTask(data: Task): Observable<Task> {
    return this._http.post<Task>(environment.TasksUrls.createTaskApi, data, {
      headers: this.getHeaders(),
    });
  }

  updateTask(id: string, data: Task): Observable<Task> {
    return this._http.put<Task>(
      `${environment.TasksUrls.updateTaskApi}/${id}`,
      data,
      {
        headers: this.getHeaders(),
      }
    );
  }

  deleteTask(id: string): Observable<boolean> {
    return this._http.delete<boolean>(
      `${environment.TasksUrls.deleteTaskApi}/${id}`,
      {
        headers: this.getHeaders(),
      }
    );
  }
}
