import { Component } from "@angular/core";
import { DropdownComponent } from "../../ui/dropdown/dropdown.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DropdownItemTwoComponent } from "../../ui/dropdown/dropdown-item/dropdown-item.component-two";
import { AuthService } from "../../../../services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: "app-user-dropdown",
  templateUrl: "./user-dropdown.component.html",
  imports: [
    CommonModule,
    RouterModule,
    DropdownComponent,
    DropdownItemTwoComponent,
  ],
})
export class UserDropdownComponent {
  user: any = null;
  isOpen = false;

  constructor(private auth: AuthService,  private router: Router) {}

  ngOnInit() {
    this.auth.currentUser.subscribe(u => {
      this.user = u;
      console.log("Usuario en UserDropdownComponent:", this.user);
    });
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

   signOut() {
    this.auth.logout().then(() => {
      this.router.navigate(['/signin'], { replaceUrl: true });
    });
  }
}