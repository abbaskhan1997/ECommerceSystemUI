import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  imports: [FormsModule,RouterLink],
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

  searchText = '';

  // pagination
  currentPage = 1;
  pageSize = 10;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  // paginated user
  paginatedUsers() {
  const startIndex = (this.currentPage - 1) * this.pageSize;

  return this.filteredUsers().slice(
    startIndex,
    startIndex + this.pageSize
  );
}

totalPages() {
  return Math.ceil(this.filteredUsers().length / this.pageSize);
}

changePage(page: number) {
  if (page >= 1 && page <= this.totalPages()) {
    this.currentPage = page;
  }
}

  filteredUsers() {
  const search = this.searchText.toLowerCase();

  return this.users().filter((user: any) =>
    user.name.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search)
  );
}

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

cancelEdit() {
  this.selectedUser = null;
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
