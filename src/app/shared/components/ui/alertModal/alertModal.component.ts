import { CommonModule } from "@angular/common";
import { Component, HostListener, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import {
  AlertService,
  AlertConfig,
} from "../../../services/alertModal.service";

@Component({
  selector: "app-alert-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./alertModal.component.html",
})
export class AlertModalComponent implements OnDestroy {
  config: AlertConfig = {
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    autoClose: true,
    autoCloseDelay: 3000,
  };

  private sub?: Subscription;

  constructor(private alertService: AlertService) {
    this.sub = this.alertService.alertState$.subscribe((cfg) => {
      this.config = cfg;

      if (cfg.isOpen && cfg.autoClose) {
        setTimeout(() => this.alertService.close(), cfg.autoCloseDelay);
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  close() {
    this.alertService.close();
  }

  // Cerrar con Escape o Enter — y evitar que otros listeners actúen (prevención + stop)
  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (!this.config.isOpen) return;

    if (event.key === 'Escape' || event.key === 'Enter') {
      // prevenir acciones por defecto (p. ej. submit) y evitar que otros handlers lo reciban
      event.preventDefault();

      // intentar detener la propagación más agresiva posible
      try { event.stopImmediatePropagation(); } catch (e) {}
      try {
        // Algunos navegadores no exponen stopImmediatePropagation en KeyboardEvent typed,
        // pero lo intentamos; si no existe, al menos stopPropagation:
        (event as any).stopImmediatePropagation?.();
      } catch (e) {}

      this.close();
    }
  }

// handler para cuando el usuario hace click en el backdrop:
  onBackdropClick(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this.close();
  }

  // evitar que los clicks dentro del contenido cierren por propagación:
  onContentClick(ev: MouseEvent) {
    ev.stopPropagation();
  }

  get icon(): string {
    switch (this.config.type) {
      case "success":
        return "✅";
      case "info":
        return "ℹ️";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  }

  get colorClasses(): string {
    switch (this.config.type) {
      case "success":
        return "bg-green-100 text-green-700 border-green-300";
      case "info":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "error":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  }
}