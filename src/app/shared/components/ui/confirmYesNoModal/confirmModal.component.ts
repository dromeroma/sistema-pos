import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { AlertService, ConfirmConfig } from "../../../services/alertModal.service";

@Component({
  selector: "app-confirm-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./confirmModal.component.html",
})
export class ConfirmModalComponent implements AfterViewInit, OnDestroy {
  config: ConfirmConfig = {
    isOpen: false,
    title: "",
    message: "",
    loading: false,
  };

  private sub?: Subscription;

  @ViewChild("yesBtn", { read: ElementRef }) yesBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild("btnNo", { read: ElementRef }) btnNo!: ElementRef<HTMLButtonElement>;
  @ViewChild("modalContainer", { read: ElementRef }) modalContainer!: ElementRef<HTMLDivElement>;

  constructor(private alertService: AlertService) {
    // Nos suscribimos al estado del modal de confirmación
    this.sub = this.alertService.confirmState$.subscribe((cfg) => {
      // actualizar config
      this.config = cfg;

      // cuando se abre, bloquear scroll y poner foco en Sí
      if (cfg.isOpen) {
        // esperar a que el DOM esté listo
        setTimeout(() => {
          try {
            this.lockScroll();
            this.focusYesDefault();
          } catch (e) {}
        }, 0);
      } else {
        // cuando se cierra, restaurar scroll
        this.unlockScroll();
      }
    });
  }

  ngAfterViewInit() {
    // nada crítico aquí porque enfocamos cuando se abre
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.unlockScroll();
  }

  /** Mantener el foco dentro del modal (Tab / Shift+Tab) */
  trapFocus(event: KeyboardEvent) {
    if (!this.config.isOpen) return;

    if (event.key !== "Tab") return;

    const focusable = this.getFocusableElements();
    if (!focusable || focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab
      if (active === first || active === this.modalContainer.nativeElement) {
        event.preventDefault();
        (last as HTMLElement).focus();
      }
    } else {
      // Tab
      if (active === last) {
        event.preventDefault();
        (first as HTMLElement).focus();
      }
    }
  }

  /** Se llama desde HostListener para manejo de Escape y trapFocus */
  @HostListener("document:keydown", ["$event"])
  handleKeydown(event: KeyboardEvent) {
    if (!this.config.isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      this.no();
      return;
    }

    // evitar que otros handlers globales reaccionen mientras el modal está abierto
    // y atrapar Tab para mantener el foco dentro
    this.trapFocus(event);
  }

  /** Click fuera (backdrop) */
  closeOutside() {
    if (!this.config.isOpen) return;
    this.no();
  }

  yes() {
    // Muestra spinner en el modal (estado en servicio)
    this.alertService.startConfirmLoading();

    // Resolver con true
    this.alertService.confirmResponse(true);

    // Nota: el servicio cerrará el modal; aquí también desbloqueamos por si acaso
    this.unlockScroll();
  }

  no() {
    this.alertService.confirmResponse(false);
    this.unlockScroll();
  }

  /* ---------- utilidades internas (no cambiar nombres públicos) ---------- */

  /** Forzar foco en botón Sí cuando se abre */
  private focusYesDefault() {
    try {
      // si existe yesBtn, enfocarlo; si no, el container
      if (this.yesBtn?.nativeElement) {
        this.yesBtn.nativeElement.focus();
      } else if (this.modalContainer?.nativeElement) {
        this.modalContainer.nativeElement.focus();
      }
    } catch (e) {}
  }

  /** Obtener todos los elementos enfocables dentro del modal en orden */
  private getFocusableElements(): HTMLElement[] {
    if (!this.modalContainer) return [];
    const container = this.modalContainer.nativeElement as HTMLElement;
    const nodes = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    return Array.from(nodes).filter((el) => !el.hasAttribute("disabled"));
  }

  /** Evitar scroll del body mientras el modal está abierto */
  private lockScroll() {
    try {
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } catch (e) {}
  }

  /** Restaurar scroll al cerrar */
  private unlockScroll() {
    try {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (top) {
        const scrollY = -parseInt(top || "0");
        window.scrollTo(0, scrollY);
      }
    } catch (e) {}
  }
}
