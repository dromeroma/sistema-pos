import { Component } from "@angular/core";
import { GridShapeComponent } from "../../components/common/grid-shape/grid-shape.component";
import { RouterModule } from "@angular/router";
import { ThemeToggleTwoComponent } from "../../components/common/theme-toggle-two/theme-toggle-two.component";
import { LogoService } from "../../../services/logo.service";

@Component({
  selector: "app-auth-page-layout",
  imports: [GridShapeComponent, RouterModule, ThemeToggleTwoComponent],
  templateUrl: "./auth-page-layout.component.html",
  styles: ``,
})
export class AuthPageLayoutComponent {
  // logoUrl: string = "";
  // supabaseBaseUrl = "https://ojbhhxouklkztynalizp.supabase.co/storage/v1/object/public/logosStoresSavvyPos/";

  // ngOnInit() {
  //   const hostname = window.location.hostname; // ej: bacota.savvypos.com
  //   const subdomain = hostname.split(".")[0]; // "bacota"
  //   console.log("Subdominio detectado:", subdomain);

  //   const exts = ["svg", "png", "jpg"]; // prioridades de extensión

  //   this.setLogoUrl(subdomain, exts);
  // }

  // async setLogoUrl(subdomain: string, exts: string[]) {
  //   for (const ext of exts) {
  //     const url = `${this.supabaseBaseUrl}logo-${subdomain}-dark.${ext}`;
  //     // Verificar si existe la imagen
  //     try {
  //       const response = await fetch(url, { method: "HEAD" });
  //       if (response.ok) {
  //         this.logoUrl = url;
  //         return;
  //       }
  //     } catch (error) {
  //       // Error de red, continuar con la siguiente extensión
  //       console.warn(`No se encontró logo con extensión ${ext}`);
  //     }
  //   }

  //   // Si no se encuentra ningún logo, usar un fallback
  //   //this.logoUrl = `${this.supabaseBaseUrl}logo-default-dark.svg`;
  //   this.logoUrl = `/images/logo/logo-bacota-light.svg`;
  // }

  logoUrl: string = '';

  constructor(private logoService: LogoService) {}

  async ngOnInit() {
    this.logoUrl = await this.logoService.getLogoUrl();
  }
}
