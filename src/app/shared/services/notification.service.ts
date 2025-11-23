import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type NotificationPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // milisegundos
  position?: NotificationPosition;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private nextId = 1;

  // 🟢 Lista reactiva de notificaciones activas
  notifications = signal<Notification[]>([]);

  /**
   * Muestra una nueva notificación
   */
  show({
    type,
    title,
    message,
    duration = 4000,
    position = 'top-right',
  }: Omit<Notification, 'id'>) {
    const id = this.nextId++;
    const notification: Notification = { id, type, title, message, duration, position };

    // Agregar al signal
    this.notifications.update((list) => [...list, notification]);

    // Auto-eliminar después de 'duration' milisegundos
    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  /**
   * Elimina manualmente una notificación
   */
  remove(id: number) {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }
}