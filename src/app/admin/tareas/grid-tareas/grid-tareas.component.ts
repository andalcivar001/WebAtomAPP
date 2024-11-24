import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SharedModule } from '../../../shared/module/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { Task } from '../../../core/models/Task.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TaskService } from '../../../core/services/task.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormTareasComponent } from '../form-tareas/form-tareas.component';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-grid-tareas',
  standalone: true,
  imports: [NavbarComponent, SharedModule],
  templateUrl: './grid-tareas.component.html',
  styleUrl: './grid-tareas.component.scss',
})
export class GridTareasComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  arrayTareas: Task[] = [];
  dataSource!: MatTableDataSource<Task>;
  isLoading: boolean = false;
  columnasAMostrar = [
    'id',
    'titulo',
    'descripcion',
    'fechaCreacion',
    'estado',
    'acciones',
  ];

  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _router: Router,
    public dialog: MatDialog,
    private _localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const token = this._localStorageService.getItem('token');
    if (!token) {
      this._alertService.error('Usuario no ha iniciado sesion');
      this._router.navigateByUrl('');
      return;
    }

    this.obtenerDatos();
  }
  // ngAfterViewInit() {
  //   // Asegúrate de asociar el paginator al DataSource
  //   this.dataSource.paginator = this.paginator;
  // }
  async obtenerDatos() {
    this.isLoading = true;
    await new Promise(async (resolve) => {
      this._taskService.getTasks().subscribe({
        next: (res) => {
          if (res === null) res = [];
          this.arrayTareas = [...res];
          this.dataSource = new MatTableDataSource(this.arrayTareas);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          resolve(true);
        },
        error: (error) => {
          this._alertService.error(error.error.message);
          resolve(false);
        },
      });
    });
    this.isLoading = false;
  }

  filtrarGrid(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onCrearTask() {
    const dialogRef = this.dialog.open(FormTareasComponent, {
      width: '500px',
      height: '500px',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;
      const task = result as Task;
      this.isLoading = true;
      await new Promise(async (resolve) => {
        this._taskService.createTask(task).subscribe({
          next: (res: Task) => {
            this._alertService.success('Creado con exito');
            this.arrayTareas.push(res);
            this.obtenerDatos();
            resolve(true);
          },
          error: (error) => {
            this._alertService.error(error.error.message);
            resolve(false);
          },
        });
      });
    });
    this.isLoading = false;
  }

  dateFormatter(value: Date): string {
    return formatDate(value, 'yyyy/MM/dd HH:mm:ss', 'en-US');
  }

  onEditarTask(id: string) {
    const dialogRef = this.dialog.open(FormTareasComponent, {
      width: '500px',
      height: '500px',
      data: { id },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;
      const task = result as Task;
      this.isLoading = true;
      await new Promise(async (resolve) => {
        this._taskService.updateTask(id, task).subscribe({
          next: (res: Task) => {
            this._alertService.success('Editado con exito');
            this.arrayTareas.push(res);
            this.obtenerDatos();
            resolve(true);
          },
          error: (error) => {
            resolve(false);
            this._alertService.error(error.error.message);
          },
        });
      });
    });
    this.isLoading = false;
  }

  onDeleteTask(id: string) {
    this._alertService
      .question('¿Estás seguro?', 'Esta acción es irreversible.')
      .then(async (result) => {
        if (result.isConfirmed) {
          this.isLoading = true;
          await new Promise(async (resolve) => {
            this._taskService.deleteTask(id).subscribe({
              next: (res) => {
                this.obtenerDatos();
                this._alertService.success('Eliminado con exito');
                resolve(true);
              },
              error: (error) => {
                this._alertService.error(error.error.message);
                resolve(false);
              },
            });
          });
        }
        this.isLoading = false;
      });
  }
}
