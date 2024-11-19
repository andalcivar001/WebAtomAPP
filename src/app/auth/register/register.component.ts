import { Component } from '@angular/core';
import { AlertService } from '../../shared/services/alert.service';
import { SharedModule } from '../../shared/module/shared.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  email?: string;
  emailConfirmacion?: string;
  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(
    private _alertService: AlertService,
    public dialogRef: MatDialogRef<RegisterComponent>
  ) {}
  onCreate() {
    if (!this.email || this.email.trim() === '') {
      this._alertService.warning('Ingrese email');
      return;
    }
    if (!this.emailConfirmacion || this.emailConfirmacion.trim() === '') {
      this._alertService.warning('Ingrese email de confirmación');
      return;
    }
    if (this.email !== this.emailConfirmacion) {
      this._alertService.warning('Email no son iguales');
      return;
    }

    const emailValido = this.emailPattern.test(this.email);
    if (!emailValido) {
      this._alertService.warning(
        'Email ingresado no es valido, favor verifique'
      );
      return;
    }
    this.dialogRef.close(this.email);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
