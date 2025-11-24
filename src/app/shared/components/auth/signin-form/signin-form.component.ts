import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { LabelComponent } from "../../form/label/label.component";
import { CheckboxComponent } from "../../form/input/checkbox.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { InputFieldComponent } from "../../form/input/input-field.component";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-signin-form",
  imports: [
    CommonModule,
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: "./signin-form.component.html",
  styles: ``,
})
export class SigninFormComponent {
  showPassword = false;
  isChecked = false;

  email = "";
  password = "";

  loading = false;
  error = "";

  constructor(private auth: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSignIn() {
    this.error = "";
    this.loading = true;

    const result = await this.auth.login(this.email, this.password);

    console.log("Resultado del login:", result);

    this.loading = false;

    if (result?.error) {
      this.error = "Credenciales incorrectas MMMM";
      return;
    }

    // si el login es exitoso → redirigir
    if (result?.user) {
      this.router.navigate(["/dashboard"]);
    }
  }
}
