import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/module/shared.module';
import { AlertService } from '../../../shared/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/models/Task.model';

@Component({
  selector: 'app-form-tareas',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './form-tareas.component.html',
  styleUrl: './form-tareas.component.scss',
})
export class FormTareasComponent implements OnInit {
  id?: string;
  titulo?: string;
  descripcion: string = '';
  estado: boolean = false;
  tituloForm?: string;
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FormTareasComponent>,
    private _alertService: AlertService,
    private _activatedRoute: ActivatedRoute,
    private _taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  async ngOnInit() {
    if (this.data && this.data.id) {
      this.id = this.data.id;
      this.isLoading = true;
      await new Promise(async (resolve) => {
        this._taskService.getTaskById(this.id!).subscribe({
          next: (res: Task) => {
            if (res !== null) {
              this.tituloForm = `Editando Tarea`;
              const task = { ...res };
              this.titulo = task.titulo;
              this.descripcion = task.descripcion;
              this.estado = task.estado === 'P' ? false : true;
            }
            resolve(true);
          },
          error: (error) => {
            this._alertService.error('Error al cargar datos de la tarea');
            resolve(false);
          },
        });
      });
      this.isLoading = false;
    } else {
      this.tituloForm = 'Creando Tarea';
      this.estado = false;
    }
  }

  onCreate() {
    if (!this.validarForm()) {
      return;
    }
    const task: Task = {
      id: this.id!,
      titulo: this.titulo!,
      descripcion: this.descripcion,
      estado: this.estado ? 'C' : 'P',
    };
    this.dialogRef.close(task);
  }

  validarForm(): boolean {
    if (!this.titulo || this.titulo.trim() === '') {
      this._alertService.warning('Ingrese titulo');
      return false;
    }

    if (!this.descripcion || this.descripcion.trim() === '') {
      this._alertService.warning('Ingrese descripción');
      return false;
    }

    return true;
  }
  onCancel(): void {
    this.dialogRef.close(); // Cierra el modal sin retornar nada
  }
}
