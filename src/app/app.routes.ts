import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { ResetPassword } from './pages/reset-password/reset-password';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminProduct } from './pages/admin-product/admin-product';
import { AdminUsers } from './pages/admin-users/admin-users';
import { AdminCategories } from './pages/admin-categories/admin-categories';
import { AdminSchools } from './pages/admin-schools/admin-schools';
import { AdminClasses } from './pages/admin-classes/admin-classes';
import { Classes } from './pages/classes/classes';
import { Categories } from './pages/categories/categories';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { authGuard } from './guards/auth-guard';
import { MyOrders } from './pages/my-orders/my-orders';
import { AdminOrders } from './pages/admin-orders/admin-orders';

export const routes: Routes = [
  // Home: Customer and guest
  {
    path: '',
    component: Home,
    canActivate: [authGuard],
    data: { role: 'User', allowGuest: true },
  },

  // Public authentication pages
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },

  // Customer pages
  {
    path: 'products',
    component: Products,
    canActivate: [authGuard],
    data: { role: 'User' },
  },
  {
    path: 'products/:id',
    component: ProductDetail,
    canActivate: [authGuard],
    data: { role: 'User' },
  },
  {
    path: 'classes',
    component: Classes,
    canActivate: [authGuard],
    data: { role: 'User' },
  },
  {
    path: 'categories',
    component: Categories,
    canActivate: [authGuard],
    data: { role: 'User' },
  },
  {
    path: 'cart',
    component: Cart,
    canActivate: [authGuard],
    data: { role: 'User' },
  },
  {
    path: 'checkout',
    component: Checkout,
    canActivate: [authGuard],
    data: { role: 'User' },
  },

  {
    path: 'my-orders',
    component: MyOrders,
    canActivate: [authGuard],
    data: { role: 'User' },
  },

  // Admin pages
  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [authGuard],
    data: { role: 'Admin' },
  },
  {
    path: 'admin-product',
    component: AdminProduct,
    canActivate: [authGuard],
    data: { role: 'Admin' },
  },
  {
    path: 'admin-user',
    component: AdminUsers,
    canActivate: [authGuard],
    data: { role: 'Admin' },
  },
  {
    path: 'admin-categories',
    component: AdminCategories,
    canActivate: [authGuard],
    data: { role: 'Admin' },
  },
  {
    path: 'admin-schools',
    component: AdminSchools,
    canActivate: [authGuard],
    data: { role: 'Admin' },
  },
  {
    path: 'admin-classes',
    component: AdminClasses,
    canActivate: [authGuard],
    data: { role: 'Admin' },
  },

  {
    path: 'admin-orders',
    component: AdminOrders,
    canActivate: [authGuard],
    data: { role: 'Admin' },
  },
];
