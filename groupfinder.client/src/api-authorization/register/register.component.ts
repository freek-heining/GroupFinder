import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ILoginModel } from '../../interfaces/ILoginModel';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = this.formBuilder.group({
    email: [
      '', [
      Validators.required,
        Validators.email]],
    emailConfirmation: [
      '', [
        Validators.required,
        Validators.email]],
    // By default, Identity requires that passwords contain an uppercase character, lowercase character, a digit, and a non-alphanumeric character. Passwords must be at least six characters long.
    password: [
      '', [
      Validators.required,
      Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?!.* ).{6,}$')]],
  })

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService) { }

  // In a reactive form, you can always access any form control through the get method on its parent group,
  // but sometimes it's useful to define getters as shorthand for the template.
  get email() {
    return this.registerForm.get('email');
  }
  get emailConfirmation() {
    return this.registerForm.get('emailConfirmation');
  }
  get password() {
    return this.registerForm.get('password');
  }

  onSubmit(form: FormGroup) {
    const credentials: ILoginModel = {
      email: form.value.email,
      password: form.value.password,
    }

    this.userService.registerUser$(credentials).subscribe(
      response => console.log('Registering done: ' + response) // Register only responds with a 200 OK result, which is retrieved in the next/success callback of a subscribe.
    )
  }
}
