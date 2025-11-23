// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// export type AlertType = 'success' | 'info' | 'warning' | 'error';

// export interface AlertConfig {
//   isOpen: boolean;
//   type: AlertType;
//   title: string;
//   message: string;
//   autoClose?: boolean;
//   autoCloseDelay?: number;
// }

// @Injectable({ providedIn: 'root' })
// export class AlertService {
//   private _alertState = new BehaviorSubject<AlertConfig>({
//     isOpen: false,
//     type: 'info',
//     title: '',
//     message: '',
//     autoClose: true,
//     autoCloseDelay: 3000,
//   });

//   alertState$ = this._alertState.asObservable();

//   // protección contra reopen inmediato:
//   private ignoreOpenUntil = 0; // timestamp ms

//   show(config: Omit<AlertConfig, 'isOpen'>) {
//     const now = Date.now();
//     if (now < this.ignoreOpenUntil) {
//       // ignorar show() si está dentro de la ventana protegida
//       return;
//     }

//     this._alertState.next({
//       ...config,
//       isOpen: true,
//     });
//   }

//   close() {
//     const current = this._alertState.value;
//     // marcar cierre y bloquear re-open por 300ms
//     this._alertState.next({
//       ...current,
//       isOpen: false,
//     });
//     this.ignoreOpenUntil = Date.now() + 300; // 300 ms bloqueo (ajustable)
//   }
// }

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface AlertConfig {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export interface ConfirmConfig {
  isOpen: boolean;
  title: string;
  message: string;
  loading: boolean;       // Spinner mientras se ejecuta la acción
}

@Injectable({ providedIn: 'root' })
export class AlertService {

  // -----------------------------
  // ALERTA NORMAL YA EXISTENTE
  // -----------------------------
  private _alertState = new BehaviorSubject<AlertConfig>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    autoClose: true,
    autoCloseDelay: 3000,
  });

  alertState$ = this._alertState.asObservable();
  private ignoreOpenUntil = 0;

  show(config: Omit<AlertConfig, 'isOpen'>) {
    const now = Date.now();
    if (now < this.ignoreOpenUntil) return;

    this._alertState.next({
      ...config,
      isOpen: true,
    });
  }

  close() {
    const current = this._alertState.value;
    this._alertState.next({
      ...current,
      isOpen: false,
    });
    this.ignoreOpenUntil = Date.now() + 300;
  }

  // -----------------------------
  //   NUEVO: MODAL DE CONFIRMACIÓN
  // -----------------------------
  private _confirmState = new BehaviorSubject<ConfirmConfig>({
    isOpen: false,
    title: '',
    message: '',
    loading: false,
  });

  confirmState$ = this._confirmState.asObservable();

  private confirmResolver?: (value: boolean) => void;

  confirm(options: { title: string; message: string }): Promise<boolean> {
    // Abre modal de confirmación
    this._confirmState.next({
      isOpen: true,
      title: options.title,
      message: options.message,
      loading: false,
    });

    return new Promise<boolean>((resolve) => {
      this.confirmResolver = resolve;
    });
  }

  confirmResponse(value: boolean) {
    if (this.confirmResolver) {
      this.confirmResolver(value);
      this.confirmResolver = undefined;
    }

    // Cerrar modal
    const current = this._confirmState.value;
    this._confirmState.next({ ...current, isOpen: false });
  }

  startConfirmLoading() {
    const current = this._confirmState.value;
    this._confirmState.next({ ...current, loading: true });
  }

  stopConfirmLoading() {
    const current = this._confirmState.value;
    this._confirmState.next({ ...current, loading: false });
  }
}