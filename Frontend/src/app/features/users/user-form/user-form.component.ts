import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, User } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  userForm!: FormGroup;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: [this.user?.username || '', [Validators.required]],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      first_name: [this.user?.first_name || ''],
      last_name: [this.user?.last_name || ''],
      is_staff: [this.user?.is_staff || false]
    });

    if (!this.user) {
      this.userForm.addControl('password', this.fb.control('', [Validators.required]));
    } else {
      this.userForm.addControl('password', this.fb.control(''));
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.value;

    if (this.user) {
      this.userService.updateUser(this.user.id!, formValue).subscribe({
        next: () => this.saved.emit(),
        error: (err) => {
          if (err.status === 403) alert('No tienes permiso para editar a este usuario.');
          else alert('Error actualizando usuario');
        }
      });
    } else {
      this.userService.createUser(formValue).subscribe({
        next: () => this.saved.emit(),
        error: (err) => alert('Error creando usuario')
      });
    }
  }

  onCancel(): void {
    this.canceled.emit();
  }
}
