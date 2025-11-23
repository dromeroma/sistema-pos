import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  HostListener,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ModalComponent } from "../../ui/modal/modal.component";
import { ConfirmModalComponent } from "../../ui/confirmYesNoModal/confirmModal.component";
import { AlertService } from "../../../services/alertModal.service";
import { NotificationService } from "../../../services/notification.service";

interface Product {
  code: string;
  name: string;
  price: number;
  stock: number;
}

interface SaleItem {
  code: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

@Component({
  selector: "app-pos-register",
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: "./pos-register.component.html",
})
export class PosRegisterComponent implements AfterViewInit {
  //  @ViewChildren('editInput') editInputs!: QueryList<ElementRef<HTMLInputElement>>;
  //@ViewChildren('editInput', { read: ElementRef }) editInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren("rowRef", { read: ElementRef }) rowRefs!: QueryList<
    ElementRef<HTMLElement>
  >;

  // buffer de edición (string) — índice paralelo a productList
  editValues: string[] = [];

  code = "";
  quantity: number | null = null;
  discount = 0;

  selectedProduct?: Product;
  productList: SaleItem[] = [];
  editingIndex: number | null = null; // ✅ índice del producto en edición

  @ViewChild("codeInput") codeInput!: ElementRef<HTMLInputElement>;
  @ViewChild("qtyInput") qtyInput!: ElementRef<HTMLInputElement>;
  @ViewChild("discountInput") discountInput!: ElementRef<HTMLInputElement>;
  @ViewChild("addButton") addButton!: ElementRef<HTMLButtonElement>;

  isAdding = false;
  isProductNotFound = false;

  constructor(
    private alert: AlertService,
    private cd: ChangeDetectorRef,
    private notify: NotificationService
  ) {}

  ngAfterViewInit() {
    // Permitir Enter en el botón sin duplicar acción
    this.addButton.nativeElement.addEventListener(
      "keydown",
      (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault(); // evita doble trigger (enter dispara click)
          this.addProduct();
        }
      }
    );
  }

  get totalItems() {
    return this.productList.reduce((acc, item) => acc + item.quantity, 0);
  }

  get totalProducts() {
    return this.productList.length;
  }

  get totalValue() {
    return this.productList.reduce((acc, item) => acc + item.total, 0);
  }

  // 🔹 Buscar producto al presionar Enter
  onCodeEnter() {
    const product = this.findProductByCode(this.code);

    if (!product) {
      this.alert.show({
        type: "error",
        title: "Producto no registrado",
        message: "No se encontró ningún producto con el código proporcionado.",
      });

      setTimeout(() => {
        this.codeInput.nativeElement.focus();
        this.codeInput.nativeElement.select();
      }, 150);
      this.selectedProduct = undefined;
      return;
    }

    this.selectedProduct = product;

    // Pasa al campo cantidad y selecciona
    setTimeout(() => {
      this.qtyInput.nativeElement.focus();
      this.qtyInput.nativeElement.select();
    }, 150);
  }

  focusDiscount() {
    setTimeout(() => {
      this.discountInput.nativeElement.focus();
      this.discountInput.nativeElement.select();
    }, 100);
  }

  focusAddButton() {
    setTimeout(() => this.addButton.nativeElement.focus(), 100);
  }

  // 🔹 Agregar producto (con acumulación si ya existe)
  addProduct() {
    if (this.isAdding || this.code === "") return;
    this.isAdding = true;

    if (!this.selectedProduct) {
      this.alert.show({
        type: "error",
        title: "Operación inválida",
        message: "Debe seleccionar un producto antes de agregar.",
      });

      setTimeout(() => this.codeInput.nativeElement.focus(), 150);
      this.isAdding = false;
      return;
    }

    const priceAfterDiscount =
      this.selectedProduct.price * (1 - this.discount / 100);
    const totalNew = priceAfterDiscount * (this.quantity ?? 1);

    // ✅ Buscar si ya existe el producto en la lista
    const existing = this.productList.find(
      (item) => item.code === this.selectedProduct!.code
    );

    if (existing) {
      // Si ya existe, actualizar cantidad y total
      existing.quantity += this.quantity ?? 1;
      existing.total = existing.quantity * existing.price;

      this.notify.show({
        type: "info",
        title: "Cantidad actualizada",
        message: "Cantidad actualizada exitosamente.",
        duration: 4000,
        position: "bottom-right",
      });
    } else {
      // Si no existe, agregar nuevo
      const safeQuantity = this.quantity ?? 1;
      const totalNew = priceAfterDiscount * safeQuantity;

      this.productList.push({
        code: this.selectedProduct.code,
        name: this.selectedProduct.name,
        quantity: safeQuantity,
        price: priceAfterDiscount,
        total: totalNew,
      });

      this.notify.show({
        type: "success",
        title: "Producto agregado",
        message: "Producto agregado exitosamente.",
        duration: 4000,
        position: "bottom-right",
      });
    }

    // Orden alfabético (mantiene orden visual)
    this.productList.sort((a, b) => a.name.localeCompare(b.name));

    // Reset de campos (mantiene info visible)
    this.code = "";
    this.quantity = null;
    this.discount = 0;

    // Focus y selección en campo código
    setTimeout(() => {
      this.codeInput.nativeElement.focus();
      this.codeInput.nativeElement.select();
      this.isAdding = false;
      this.selectedProduct = undefined;
    }, 150);
  }

  // 🔹 Simula búsqueda
  findProductByCode(code: string): Product | undefined {
    const mockData: Product[] = [
      { code: "1001", name: "Manzana", price: 2500, stock: 100 },
      { code: "1002", name: "Banana", price: 500, stock: 80 },
      { code: "1003", name: "Naranja", price: 900, stock: 50 },
      { code: "1004", name: "Arrox Diana x 1 Kg", price: 4500, stock: 50 },
    ];
    return mockData.find((p) => p.code === code);
  }

  showProductNotFoundModal() {
    this.isProductNotFound = true;
  }

  closeProductNotFoundModal() {
    this.isProductNotFound = false;
  }

  // ✅ Iniciar edición, enfocar y seleccionar el input

  startEdit(index: number) {
    // 1) marca índice en edición y prepara buffer
    this.editingIndex = index;
    this.ensureEditBufferLength(index);
    this.editValues[index] = String(this.productList[index].quantity);

    // 2) forzar que Angular renderice el input
    this.cd.detectChanges();

    // 3) intentar encontrar el input DENTRO de la fila específica
    const tryFocus = () => {
      const rowEl = this.rowRefs.toArray()[index]?.nativeElement;
      // si la fila aún no está disponible, reintentar en el siguiente frame
      if (!rowEl) {
        requestAnimationFrame(tryFocus);
        return;
      }

      // buscar el input editable dentro del tr (siempre devuelve el input correcto para esa fila)
      const input = rowEl.querySelector("input");
      if (!input) {
        // si no existe aún (por *ngIf) reintentar
        requestAnimationFrame(tryFocus);
        return;
      }

      // sincronizar value si por alguna razón ngModel no lo colocó todavía
      if ((input as HTMLInputElement).value !== this.editValues[index]) {
        (input as HTMLInputElement).value = this.editValues[index];
      }

      // foco y selección
      (input as HTMLInputElement).focus();

      try {
        // setSelectionRange es más fiable
        (input as HTMLInputElement).setSelectionRange(
          0,
          (input as HTMLInputElement).value.length
        );
      } catch (e) {
        try {
          (input as HTMLInputElement).select();
        } catch {}
      }

      // un pequeño retry por compatibilidad móvil/antiguos navegadores
      setTimeout(() => {
        try {
          (input as HTMLInputElement).setSelectionRange(
            0,
            (input as HTMLInputElement).value.length
          );
        } catch {}
      }, 30);
    };

    requestAnimationFrame(tryFocus);
  }

  // startEdit(index: number) {
  //   this.editingIndex = index;
  //   // espera a que Angular renderice el input
  //   setTimeout(() => {
  //     const arr = this.editInputs.toArray();
  //     const el = arr[index]?.nativeElement;
  //     if (el) {
  //       el.focus();
  //       el.select();
  //     }
  //   }, 0);
  // }

  // ✅ Guardar edición y recalcular totales
  saveEdit(index: number) {
    // proteger índices
    if (index < 0 || index >= this.productList.length) {
      this.editingIndex = null;
      return;
    }

    // obtener valor del buffer y parsear
    //const raw = (this.editValues[index] ?? "").trim();
    const raw = (this.editValues[index] ?? "").trim().replace(",", ".");
    const parsed = Number(raw);

    // this.productList[index].quantity = isNaN(parsed) || parsed < 1 ? 1 : Math.floor(parsed);
    // this.productList[index].total = this.productList[index].quantity * this.productList[index].price;

    this.productList[index].quantity =
      isNaN(parsed) || parsed <= 0 ? 1 : parsed;
    this.productList[index].total =
      this.productList[index].quantity * this.productList[index].price;

    // limpiar edición
    this.editingIndex = null;
    // opcional: limpiar buffer de esa posición
    // this.editValues[index] = undefined; // o ''

    // devolver foco al campo de código para seguir facturando
    setTimeout(() => {
      this.codeInput?.nativeElement?.focus();
      this.codeInput?.nativeElement?.select();
    }, 0);

    this.notify.show({
      type: "info",
      title: "Cantidad actualizada",
      message: "Cantidad actualizada exitosamente.",
      duration: 4000,
      position: "bottom-right",
    });
  }

  // saveEdit(index: number) {
  //   const item = this.productList[index];
  //   if (item.quantity < 1) item.quantity = 1;
  //   item.total = item.quantity * item.price;
  //   this.editingIndex = null;

  //   setTimeout(() => {
  //     this.codeInput?.nativeElement?.focus();
  //     this.codeInput?.nativeElement?.select();
  //   }, 0);
  // }

  // ✅ Eliminar producto
  async deleteProduct(index: number) {
    const confirmed = await this.alert.confirm({
      title: "Eliminar producto",
      message: "¿Está seguro de que desea eliminar este producto?",
    });

    if (!confirmed) return;

    this.productList.splice(index, 1);
    this.editValues.splice(index, 1);
  }

  // utilidad para asegurar tamaño del buffer
  private ensureEditBufferLength(index: number) {
    if (!this.editValues) this.editValues = [];
    while (this.editValues.length <= index) this.editValues.push("");
  }

  filterNumericInput(event: KeyboardEvent) {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
    ];
    const input = event.key;

    // Permitir control keys
    if (allowedKeys.includes(input)) return;

    // Permitir solo números, punto y coma
    const regex = /^[0-9.,]$/;
    if (!regex.test(input)) {
      event.preventDefault();
      return;
    }

    // Evitar más de un separador decimal
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if ((input === "." || input === ",") && /[.,]/.test(value)) {
      event.preventDefault();
    }
  }

  onQtyFocus() {
    // Si el campo está vacío, poner 1
    if (!this.quantity) {
      this.quantity = 1;
    }

    // Selecciona el número actual (para reemplazar fácilmente)
    setTimeout(() => {
      this.qtyInput.nativeElement.select();
    });
  }

  onPayClick(): void {
    if (this.totalValue === 0) {
      // No hace nada si el valor es cero
      return;
    }

    // Aquí puedes abrir tu pop-up o modal
    this.openPaymentPopup();
  }

  openPaymentPopup() {
    // Ejemplo: mostrar modal de pago
    console.log("Mostrar popup de pago");
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === "p") {
      event.preventDefault(); // evita que el navegador imprima la página
      this.onPayClick();
    }
  }
}
