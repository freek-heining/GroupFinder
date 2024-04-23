import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/IUser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  registerForm = this.formBuilder.group({
    firstName: [
      '', [
        Validators.required,
        Validators.minLength(2)]],
    lastName: [
      '', [
        Validators.required,
        Validators.minLength(2)]],
    email: [
      '', [
        Validators.required,
        Validators.email]],
    emailConfirmation: [
      '', [
        Validators.required,
        Validators.email]],
    hometown: [
      '', [
        Validators.required,
        Validators.minLength(2)]],
    biography: [
      '', [
        Validators.required,
        Validators.minLength(20)]],
    password: [
      '', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?!.* ).{6,}$')]],
  })

  // By default, Identity requires that passwords contain an uppercase character, lowercase character, a digit, and a non-alphanumeric character. Passwords must be at least six characters long.

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService) { }

  // In a reactive form, you can always access any form control through the get method on its parent group,
  // but sometimes it's useful to define getters as shorthand for the template.
  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get emailConfirmation() {
    return this.registerForm.get('emailConfirmation');
  }
  get hometown() {
    return this.registerForm.get('hometown');
  }
  get biography() {
    return this.registerForm.get('biography');
  }
  get password() {
    return this.registerForm.get('password');
  }

  onSubmit(form: FormGroup) {
    const user: IUser = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      hometown: form.value.homeTown,
      email: form.value.email,
      biography: form.value.biography,
      password: form.value.password,
      id: undefined,
      refreshToken: undefined
    }

    this.userService.registerUser$(user).subscribe({
      next: (user: IUser) => console.log(user.firstName + 'is succesfully registered!')
    });
  }
}
