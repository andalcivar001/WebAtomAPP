import { Component } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { SharedModule } from '../../module/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  email?: string;

  constructor(
    private _loalStorageService: LocalStorageService,
    private _router: Router
  ) {}
  ngOnInit(): void {
    this.email = this._loalStorageService.getItem('email');
  }

  cerrarSesion() {
    this._loalStorageService.removeItem('email');
    this._loalStorageService.removeItem('token');
    this.email = undefined;
    this._router.navigate(['']);
  }
}
