// logo.service.ts
import { Injectable } from "@angular/core";

export interface LogoUrls {
  dark: string;
  light: string;
}

@Injectable({
  providedIn: "root",
})
export class LogoService {
  private supabaseBaseUrl =
    "https://ojbhhxouklkztynalizp.supabase.co/storage/v1/object/public/logosStoresSavvyPos/";
  private logoCache: LogoUrls | null = null; // Cache de logos

  constructor() {}

  // Método público que retorna ambas URLs
  async getLogoUrls(): Promise<LogoUrls> {
    if (this.logoCache) {
      return this.logoCache;
    }

    const hostname = window.location.hostname; // ej: bacota.savvypos.com
    const subdomain = hostname.split(".")[0]; // "bacota"
    const exts = ["svg", "png", "jpeg"]; // prioridades de extensión

    let darkUrl = "";
    let lightUrl = "";

    // Buscar dark mode primero
    for (const ext of exts) {
      const url = `${this.supabaseBaseUrl}logo-${subdomain}-dark.${ext}`;
      try {
        const response = await fetch(url, { method: "HEAD" });
        if (response.ok) {
          darkUrl = url;
          break;
        }
      } catch (error) {}
    }

    // Buscar light mode
    for (const ext of exts) {
      const url = `${this.supabaseBaseUrl}logo-${subdomain}-light.${ext}`;
      try {
        const response = await fetch(url, { method: "HEAD" });
        if (response.ok) {
          lightUrl = url;
          break;
        }
      } catch (error) {}
    }

    // Fallback si no se encuentra
    if (!darkUrl) darkUrl = `/images/logo/logo-bacota-dark.svg`;
    if (!lightUrl) lightUrl = `/images/logo/logo-bacota-light.svg`;

    this.logoCache = { dark: darkUrl, light: lightUrl };
    return this.logoCache;
  }
}