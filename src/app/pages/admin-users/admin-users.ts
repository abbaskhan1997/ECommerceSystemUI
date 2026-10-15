import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-admin-users',
  styleUrl: './admin-users.css',
  templateUrl: './admin-users.html',
})
export class AdminUsers {
  users = signal<any[]>([]);

  showSuccessPopup = signal(false);
  showDeletePopup = false;

  deleteUserId: number | null = null;

  selectedUser: any = null;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  edit(user: any) {
    this.selectedUser = user;
  }

  getUsers() {
    this.userService.getUsers().subscribe((data: any) => {
      this.users.set(data);
    });
  }

updateUser() {
  if (!this.selectedUser) {
    return;
  }

  this.userService.updateUser(
    this.selectedUser.id,
    this.selectedUser.role
  ).subscribe({
    next: () => {
      this.getUsers();
      this.selectedUser = null;
      this.showSuccessPopup.set(true);

      setTimeout(() => {
        this.showSuccessPopup.set(false);
      }, 2000);
    },
    error: (error) => {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  });
}


  confirmDelete(userId: number) {
    this.deleteUserId = userId;
    this.showDeletePopup = true;
  }

  confirmDeleteNo() {
    this.showDeletePopup = false;
    this.deleteUserId = null;
  }

  confirmDeleteYes() {
    if (this.deleteUserId === null) {
      return;
    }

    const userId = this.deleteUserId;

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.showDeletePopup = false;
        this.deleteUserId = null;

        this.getUsers();

        this.showSuccessPopup.set(true);

        setTimeout(() => this.showSuccessPopup.set(false), 2000);
      },

      error: (error) => {
        console.error('Error deleting user:', error);
        this.showDeletePopup = false;
        this.deleteUserId = null;
      },
    });
  }
}
