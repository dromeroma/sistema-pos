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
import {
  createClient,
  SupabaseClient,
  User,
  AuthResponsePassword,
} from "@supabase/supabase-js";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment";

export interface UserProfile {
  id: string; // auth.users.id
  email: string;
  full_name: string;
  role: string;
  role_id: number;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private supabase: SupabaseClient;
  public currentUser = new BehaviorSubject<UserProfile | null>(null);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
    //this.loadUser(); // cargar usuario si ya hay sesión
    this.loadUserProfile();
  }

  // async login(email: string, password: string) {
  //   const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
  //   if (data.user) await this.loadUserProfile(data.user.id);
  //   return { data, error };
  // }
  async login(
    email: string,
    password: string
  ): Promise<{ user?: UserProfile; error?: string }> {
    const response: AuthResponsePassword =
      await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

    const { data, error } = response;

    if (error || !data.user) {
      return { error: "Credenciales incorrectas NO OK" };
    }

    const user: User = data.user;

    if (!user) {
      return { error: "Error al obtener usuario" };
    }

    // Trae el perfil desde la tabla profiles
    const { data: profile, error: profileError } = await this.supabase
      .from("profiles")
      .select("full_name, role, role_id")
      .eq("id", user?.id)
      .single();

    console.log("Profile data raw:", profile, "Error:", profileError);

    if (profileError || !profile) {
      return { error: "Error al cargar perfil" };
    }

    const userProfile: UserProfile = {
      id: user?.id,
      email: data.user?.email || data.session?.user?.email!,
      full_name: profile.full_name,
      role: profile.role,
      role_id: profile.role_id,
    };

    console.log("Perfil de usuario cargado:", userProfile);

    // Actualiza BehaviorSubject
    this.currentUser.next(userProfile);

    return { user: userProfile };
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.currentUser.next(null);
  }

  async loadUserProfile(userId?: string) {
    // Si no se pasa userId, obtenlo del auth
    if (!userId) {
      const {
        data: { user },
      } = await this.supabase.auth.getUser();
      userId = user?.id;
    }
    if (!userId) return;

    // Consulta la tabla profiles
    const { data: profile, error } = await this.supabase
      .from("profiles")
      .select("full_name, role, role_id")
      .eq("user_id", userId)
      .single();

    // Consulta el email desde auth.users
    const {
      data: { user },
      error: userError,
    } = await this.supabase.auth.getUser();

    if (profile && user) {
      this.currentUser.next({
        id: user.id,
        email: user.email!,
        full_name: profile.full_name,
        role: profile.role,
        role_id: profile.role_id,
      });
    }
  }

  // async getUser(): Promise<User | null> {
  //   const { data: { user } } = await this.supabase.auth.getUser();
  //   this.currentUser.next(user);
  //   return user;
  // }

  // private async loadUser() {
  //   const user = await this.getUser();
  //   this.currentUser.next(user);
  // }
}
