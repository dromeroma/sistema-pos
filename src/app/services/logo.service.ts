// logo.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoService {
  private supabaseBaseUrl = "https://ojbhhxouklkztynalizp.supabase.co/storage/v1/object/public/logosStoresSavvyPos/";
  private logoUrlCache: string | null = null; // Guardar logo ya resuelto

  constructor() {}

  // Método público para obtener el logo
  async getLogoUrl(): Promise<string> {
    // Retornar cache si ya se resolvió antes
    if (this.logoUrlCache) {
      return this.logoUrlCache;
    }

    const hostname = window.location.hostname; // ej: bacota.savvypos.com
    const subdomain = hostname.split(".")[0]; // "bacota"
    const exts = ["svg", "png", "jpg"];        // prioridades de extensión

    // Buscar logo en Supabase
    for (const ext of exts) {
      const url = `${this.supabaseBaseUrl}logo-${subdomain}-dark.${ext}`;
      try {
        const response = await fetch(url, { method: "HEAD" });
        if (response.ok) {
          this.logoUrlCache = url;
          return url;
        }
      } catch (error) {
        console.warn(`No se encontró logo con extensión ${ext}`);
      }
    }

    // Si no hay logo, fallback local
    this.logoUrlCache = `/images/logo/logo-bacota-light.svg`;
    return this.logoUrlCache;
  }
}