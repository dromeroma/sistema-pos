// auth.guard.ts
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService, UserProfile } from "../services/auth.service";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  //   async canActivate(): Promise<boolean> {
  //     const user = await this.auth.getUser(); // revisar si hay usuario logueado

  //     if (!user) {
  //       this.router.navigate(['/signin']); // redirigir si NO está logueado
  //       return false;
  //     }

  //     return true; // permitir acceso si está logueado
  //   }
  async canActivate(): Promise<boolean> {
    const user = await new Promise<UserProfile | null>((resolve) => {
      const sub = this.auth.currentUser.subscribe((u) => {
        if (u !== null) {
          resolve(u);
          sub.unsubscribe();
        }
      });

      // Si no hay usuario después de un pequeño timeout → redirigir
      setTimeout(() => resolve(null), 2000);
    });

    if (!user) {
      this.router.navigate(["/signin"], { replaceUrl: true });
      return false;
    }

    return true;
  }
}