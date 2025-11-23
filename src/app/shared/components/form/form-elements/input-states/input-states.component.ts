import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../common/component-card/component-card.component';
import { InputFieldComponent } from '../../input/input-field.component';
import { LabelComponent } from '../../label/label.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-states',
  imports: [
    CommonModule,
    FormsModule,
    ComponentCardComponent,
    InputFieldComponent,
    LabelComponent
  ],
  templateUrl: './input-states.component.html',
})
export class InputStatesComponent {

  email = '';
  emailTwo = 'hello.pimjo@gmail.com';
  error = false;
  emailThree = 'disabled@example.com';

  validateEmail() {
    const value = this.email;
    this.error = !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
  }

  validateEmailTwo() {
    const value = this.emailTwo;
    this.error = !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
  }
}