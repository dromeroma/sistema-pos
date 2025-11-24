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
import { Injectable } from "@angular/core";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class AuthService {
  private supabase: SupabaseClient;
  public currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.loadUser(); // cargar usuario si ya hay sesión
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (data.user) this.currentUser.next(data.user);
    return { data, error };
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.currentUser.next(null);
  }

  async getUser(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    this.currentUser.next(user);
    return user;
  }

  private async loadUser() {
    const user = await this.getUser();
    this.currentUser.next(user);
  }
}