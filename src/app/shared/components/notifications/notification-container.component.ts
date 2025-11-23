import { Component, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotificationService } from "../../services/notification.service";
import { Notification as ToastNotification } from "../../services/notification.service";

@Component({
  selector: "app-notification-container",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./notification-container.component.html",
})
export class NotificationContainerComponent {
  allNotifications: any;

  constructor(private notificationService: NotificationService) {
    this.allNotifications = this.notificationService.notifications;
  }

  // signals del servicio

  // computeds por ubicación
  topRight = computed(() =>
    this.allNotifications().filter(
      (n: ToastNotification) => n.position === "top-right"
    )
  );

  topLeft = computed(() =>
    this.allNotifications().filter(
      (n: ToastNotification) => n.position === "top-left"
    )
  );

  bottomRight = computed(() =>
    this.allNotifications().filter(
      (n: ToastNotification) => n.position === "bottom-right"
    )
  );

  bottomLeft = computed(() =>
    this.allNotifications().filter(
      (n: ToastNotification) => n.position === "bottom-left"
    )
  );

  remove(id: number) {
    this.notificationService.remove(id);
  }

  getTypeClasses(type: string) {
    switch (type) {
      case "success":
        return `
        text-emerald-900 border-emerald-300/90 bg-emerald-100/70 backdrop-blur
        dark:text-white dark:bg-emerald-600/30 dark:border-emerald-400/40
      `;
      case "error":
        return `
        text-rose-900 border-rose-300/90 bg-rose-100/70 backdrop-blur
        dark:text-white dark:bg-rose-600/30 dark:border-rose-400/40
      `;
      case "warning":
        return `
        text-amber-900 border-amber-300/90 bg-amber-100/70 backdrop-blur
        dark:text-white dark:bg-amber-600/30 dark:border-amber-400/40
      `;
      default:
        return `
        text-blue-900 border-blue-300/90 bg-blue-100/70 backdrop-blur
        dark:text-white dark:bg-blue-600/30 dark:border-blue-400/40
      `;
    }
  }

  //   getTypeClasses(type: string) {
  //     switch (type) {
  //       case "success":
  //         return "bg-emerald-600/20 text-white border-emerald-400/30 backdrop-blur";
  //       case "error":
  //         return "bg-rose-600/20 text-white border-rose-400/30 backdrop-blur";
  //       case "warning":
  //         return "bg-amber-600/20 text-white border-amber-400/30 backdrop-blur";
  //       default:
  //         return "bg-blue-600/20 text-white border-blue-400/30 backdrop-blur";
  //     }
  //   }

  //   getTypeClasses(type: string) {
  //     switch (type) {
  //       case "success":
  //         return "bg-emerald-600/10 text-white border-emerald-400";
  //       case "error":
  //         return "bg-rose-600/10 text-white border-rose-400";
  //       case "warning":
  //         return "bg-amber-600/10 text-white border-amber-400";
  //       default:
  //         return "bg-blue-600/10 text-white border-blue-400";
  //     }
  //   }

  getIcon(type: string) {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  }
}
