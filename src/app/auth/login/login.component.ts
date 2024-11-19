import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/services/alert.service';
import { SharedModule } from '../../shared/module/shared.module';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { AuthService } from '../../core/services/auth.service';
import { Login } from '../../core/models/User';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  email?: string;
  localStorageKey: string = 'token';
  localStorageEmail: string = 'email';
  hide = true;
  isLoading: boolean = false;
  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(
    private _router: Router,
    private _localStorageService: LocalStorageService,
    private _authService: AuthService,
    public dialog: MatDialog,
    private _alertService: AlertService
  ) {}

  ngOnInit() {}

  async onClickIngresar() {
    if (!this.email || this.email.trim() === '') {
      this._alertService.warning('Ingrese un correo electrónico');
      return;
    }
    const emailValido = this.emailPattern.test(this.email);
    if (!emailValido) {
      this._alertService.warning(
        'Email ingresado no es valido, favor verifique'
      );
      return;
    }

    this.isLoading = true;

    await new Promise(async (resolve) => {
      this._authService.getUserByEmail(this.email!).subscribe({
        next: (res: Login) => {
          if (res !== null) {
            this._localStorageService.removeItem(this.localStorageKey);
            this._localStorageService.removeItem(this.localStorageEmail);
            this._localStorageService.setItem(this.localStorageKey, res.token);
            this._localStorageService.setItem(
              this.localStorageEmail,
              res.user.email
            );
            this._router.navigateByUrl('/tasks');
          }
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

  openDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(async (result: string) => {
      if (!result) return;
      this.isLoading = true;
      await new Promise(async (resolve) => {
        this._authService.createUser(result).subscribe({
          next: (res) => {
            this.email = result;
            this.onClickIngresar();
            resolve(true);
          },
          error: (error) => {
            resolve(false);

            this._alertService.error(error.error.message);
          },
        });
      });
      this.isLoading = false;
    });
  }
}
