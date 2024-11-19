import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { GridTareasComponent } from './tareas/grid-tareas/grid-tareas.component';
import { FormTareasComponent } from './tareas/form-tareas/form-tareas.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: GridTareasComponent,
  },
  {
    path: 'form',
    component: FormTareasComponent,
  },
];
