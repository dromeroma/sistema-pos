// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const user = await this.auth.getUser(); // revisar si hay usuario logueado

    if (!user) {
      this.router.navigate(['/signin']); // redirigir si NO está logueado
      return false;
    }

    return true; // permitir acceso si está logueado
  }
}