import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../core/services/user.service';
import { UserFormComponent } from './user-form/user-form.component';
import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UserFormComponent, TranslatePipe],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  host: {
    class: 'w-full flex flex-grow'
  }
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private i18n = inject(I18nService);
  
  users: User[] = [];
  selectedUser: User | null = null;
  showForm = false;
  cargando = false;
  successMsg = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.cargando = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
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
    if (confirm(this.i18n.t('users.confirmDelete'))) {
      this.cargando = true;
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
          this.successMsg = this.i18n.t('users.deleted');
          setTimeout(() => {
            this.successMsg = '';
            this.cdr.detectChanges();
          }, 4000);
        },
        error: (err) => {
          this.cargando = false;
          if (err.status === 403) alert(this.i18n.t('users.noPermDelete'));
          else console.error('Error deleting user', err);
          this.cdr.detectChanges();
        }
      });
    }
  }

  onFormSaved(): void {
    const isEdit = !!this.selectedUser;
    this.showForm = false;
    this.loadUsers();
    this.successMsg = isEdit
      ? this.i18n.t('users.updated')
      : this.i18n.t('users.created');
    
    setTimeout(() => {
      this.successMsg = '';
      this.cdr.detectChanges();
    }, 4000);
  }

  onFormCanceled(): void {
    this.showForm = false;
  }
}
