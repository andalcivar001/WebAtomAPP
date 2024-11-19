import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  success(title: string, text: string = '') {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
    });
  }

  warning(title: string, text: string = '') {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
    });
  }

  error(title: string, text: string = '') {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
    });
  }

  question(title: string, text: string = '') {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    });
  }
}
