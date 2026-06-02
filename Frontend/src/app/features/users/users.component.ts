import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../core/services/user.service';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  
  users: User[] = [];
  selectedUser: User | null = null;
  showForm = false;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error loading users', err)
    });
  }

  openNewUserForm(): void {
    this.selectedUser = null;
    this.showForm = true;
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.showForm = true;
  }

  deleteUser(id: number | undefined): void {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Error deleting user', err)
      });
    }
  }

  onFormSaved(): void {
    this.showForm = false;
    this.loadUsers();
  }

  onFormCanceled(): void {
    this.showForm = false;
  }
}
