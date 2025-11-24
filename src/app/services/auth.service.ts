// import { Injectable } from '@angular/core';
// import { createClient, SupabaseClient } from '@supabase/supabase-js';
// import { environment } from '../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private supabase: SupabaseClient;

//   constructor() {
//     this.supabase = createClient(
//       environment.supabaseUrl,
//       environment.supabaseKey
//     );
//   }

//   login(email: string, password: string) {
//     return this.supabase.auth.signInWithPassword({ email, password });
//   }

//   logout() {
//     return this.supabase.auth.signOut();
//   }

//   getUser() {
//     return this.supabase.auth.getUser();
//   }
// }

// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // Iniciar sesión
  login(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  // Cerrar sesión
  logout() {
    return this.supabase.auth.signOut();
  }

  // Obtener usuario actual
  async getUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }
}